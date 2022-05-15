import "./RegisterForm.css";
import React from "react";
import { MainContext, useContext } from '../components/Context';
//hooks
import { useHistory } from 'react-router';
import { useIonToast } from "@ionic/react";
    
export default function RegisterForm(){
    const [present, dismiss] = useIonToast();
    const {currentPageDetails, setCurrentPageDetails} = useContext(MainContext);
    const history = useHistory();
    // form data states
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState("");

    // FORM VALIDATION 
    interface formValidation {
        formValid: boolean;
        errors: string[];
    }
    const isRegisterFormValid=()=>{
        let result: formValidation = {
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
    const mockPostData = () => {
        const{formValid, errors} = isRegisterFormValid();
        if(formValid){
            present("Form is valid",2000);
        }else{
            present(errors[0],2000);
        }
    }

    // NAVIGATE TO LOGIN PAGE
    const goToLogin = () => {
        history.push("/login");
        setCurrentPageDetails((prevState: any)=>{
            return{
                ...prevState,
                page: "login"
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

                <input onChange={(e)=>{setPassword(e.target.value)}}
                className="form-input" type="password"
                placeholder="password" value={password}/>

                <input onChange={(e)=>{setConfirm(e.target.value)}}
                className="form-input" type="password"
                placeholder="confirm password" value={confirm}/>

                <div className="register-buttons">
                    <button onClick={mockPostData}className="register-btn" type="button">register</button>
                    <button onClick={goToLogin} className="goto-login-btn" type="button">log in</button>
                </div>
            </form>

            <div className="decorative-rect"></div>
        </section>

    )
}