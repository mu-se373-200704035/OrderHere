import "./LoginForm.css"
import React from "react";
//context
import { MainContext, useContext } from '../components/Context';
//hooks
import { Redirect, useHistory } from 'react-router';
import { useIonToast } from "@ionic/react";
//utility
import { Storage } from "@capacitor/storage";
//interfaces
import IFormValidation from "../interfaces/IFormValidation";
import { render } from "@testing-library/react";
    
export default function LoginForm(){
    
    const [present, dismiss] = useIonToast();
    const {currentPageDetails, setCurrentPageDetails, axios, rootURL,setSession} = useContext(MainContext);
    const history = useHistory();
    //form data states
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");


    const goToRegister = () => {
        setCurrentPageDetails((prevState: any)=>{
            return{
                ...prevState,
                page: "/register"
            }
        });
        history.push("/register");
    }
    const goToAdminOrders = () => {
        setCurrentPageDetails((prevState: any)=>{
            return{
                ...prevState,
                page: "/admin/orders"
            }
        });
        history.push("/admin/orders");
    }

    const isLoginFormValid=()=>{
        let result: IFormValidation = {
            formValid: false,
            errors: []
        }
        let emailValid;
        let passwordValid;
        
        if(email.includes("@") && email.includes(".")){
            emailValid = true;
        }else{
            emailValid = false;
            result.errors.push("email is not valid");
        }

        if(password.length > 0){
            passwordValid = true;
        }else{
            passwordValid = false;
            result.errors.push("Password cannot be blank.")
        }
        if(emailValid && passwordValid){
            result.formValid = true;
        }
        return result;
    }

    const Login = async () => {
        const validityObject = isLoginFormValid();
        if(validityObject.formValid){
            try {
                const res = await axios.post(rootURL+"/auth/sign_in",{
                    email: email,
                    password: password,
                });
    
                if( res.status===200 ){
                    const sessionObject = {
                        "access-token": res.headers["access-token"],
                        "token-type": res.headers["token-type"],
                        client: res.headers.client,
                        uid: res.headers.uid
                    };
                    setSession(sessionObject);
                    Storage.set({
                        key: "session",
                        value: JSON.stringify(sessionObject)
                    })
                    goToAdminOrders();
                }else{
                    console.log("something went wrong!")
                }
              }
              catch (error: any) {
                if (axios.isAxiosError(error)) {
                  console.log('error message: ', error.message);
                  if(error.message==="Request failed with status code 401"){
                      present("wrong credientials.",2000);
                  }
                }else {
                  console.log('unexpected error: ', error);
                }
              }
        }else{
            present(validityObject.errors[0], 2000);
        }
    }

    return(
        <section>
            <form className="login-form">
                
                <input onChange={(e)=>{setEmail(e.target.value)}}
                    className="form-input" type="text"
                    placeholder="email" value={email}/>

                <input onChange={(e)=>{setPassword(e.target.value)}}
                    className="form-input" type="password"
                    placeholder="password" value={password}/>

                <div className="register-buttons">
                    <button onClick={Login} className="register-btn" type="button">log in</button>
                    <button onClick={goToRegister} className="goto-login-btn" type="button">register</button>
                </div>
            </form>
            
            <div className="decorative-rect-login"></div>
        </section>

    )
}