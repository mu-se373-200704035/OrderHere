import "./RegisterForm.css";
import React from "react";
import { MainContext, useContext } from '../components/Context';
//hooks
import { useHistory } from 'react-router';
import { useIonToast } from "@ionic/react";
import { Storage } from "@capacitor/storage";
import IFormValidation from "../interfaces/IFormValidation";
//interfaces
    
export default function RegisterForm(){
    const [present, dismiss] = useIonToast();
    const {currentPageDetails, setCurrentPageDetails, axios, rootURL, 
            session, setSession} = useContext(MainContext);

    const history = useHistory();
    // form data states
    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState("");
    const [shopId, setShopId] = React.useState("");

    // FORM VALIDATION 
    const isRegisterFormValid=()=>{
        let result: IFormValidation = {
            formValid: false,
            errors: []
        }
        let usernameValid; let emailValid;
        let passwordValid; let confirmValid;
        if(username.length> 3){
            usernameValid = true;
        }else{
            usernameValid = false;
            result.errors.push("username must be at least 4 characters");
        }

        if(email.includes("@") && email.includes(".")){
            emailValid = true;
        }else{
            emailValid = false;
            result.errors.push("email is not valid");
        }

        if(password.length > 7 && password.length < 16){
            passwordValid = true;
        }else{
            passwordValid = false;
            if(password.length <= 7){
                result.errors.push("password must be at least 8 characters.");
            }else{
                result.errors.push("password must be at most 15 characters");
            }
        }

        if(confirm === password){
            confirmValid = true;
        }else{
            confirmValid = false;
            result.errors.push("passwords do not match!");
        }

        if(usernameValid && emailValid && passwordValid && confirmValid){
            result.formValid = true;
        }
        return result;
    }

    // POSTING THE FORM (not yet implemented)
    const Register = async () => {
        const validityObject = isRegisterFormValid();
        if(validityObject.formValid){
            try {
                const res = await axios.post(rootURL+"/auth",{
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    email: email,
                    password: password,
                    password_confirmation: confirm,
                    shop_id: shopId
                });
                if(res.status === 200 ){
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
                    present("You have successfully registered!",2000);
                    goToAdminOrders();
                }
              }
              catch (error: any) {
                if (axios.isAxiosError(error)) {
                  console.log('error message: ', error.message);
                  present("Some of the credientials are not available try different ones",4000);
                } else {
                  console.log('unexpected error: ', error);
                  present(error, 2000);
                }
              }
        }else{
            present(validityObject.errors[0],2000);
        }
    }

    // NAVIGATION
    const goToLogin = () => {
        history.push("/login");
        setCurrentPageDetails((prevState: any)=>{
            return{
                ...prevState,
                page: "login"
            }
        });
    }
    const goToAdminOrders = () => {
        history.push("/admin/orders");
        setCurrentPageDetails((prevState: any)=>{
            return{
                ...prevState,
                page: "admin/orders"
            }
        });
    }

    return(
        <section>
            <form className="register-form">
                <input onChange={(e)=>{setUsername(e.target.value)}}
                className="form-input" type="text"
                placeholder="username" value={username}/>

                <input onChange={(e)=>{setEmail(e.target.value)}}
                className="form-input" type="email"
                placeholder="email" value={email}/>
                
                <input onChange={(e)=>{setFirstname(e.target.value)}}
                className="form-input" type="text"
                placeholder="first name" value={firstname}/>
                
                <input onChange={(e)=>{setLastname(e.target.value)}}
                className="form-input" type="text"
                placeholder="last name" value={lastname}/>

                <input onChange={(e)=>{setPassword(e.target.value)}}
                className="form-input" type="password"
                placeholder="password" value={password}/>

                <input onChange={(e)=>{setConfirm(e.target.value)}}
                className="form-input" type="password"
                placeholder="confirm password" value={confirm}/>
                
                <input onChange={(e)=>{setShopId(e.target.value)}}
                className="form-input" type="number"
                placeholder="shop id" value={shopId}/>

                <div className="register-buttons">
                    <button onClick={Register}className="register-btn" type="button">register</button>
                    <button onClick={goToLogin} className="goto-login-btn" type="button">log in</button>
                </div>
            </form>

            <div className="decorative-rect"></div>
        </section>

    )
}