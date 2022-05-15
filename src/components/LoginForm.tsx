import "./LoginForm.css"
import { MainContext, useContext } from '../components/Context';
//hooks
import { useHistory } from 'react-router';
import React from "react";
    
export default function LoginForm(){
    
    const {currentPageDetails, setCurrentPageDetails} = useContext(MainContext);
    const history = useHistory();
    //form data states
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");


    const goToRegister = () => {
        history.push("/register");
        setCurrentPageDetails((prevState: any)=>{
            return{
                ...prevState,
                page: "register"
            }
        });
    }

    return(
        <section>
            <form className="login-form">
                
                <input onChange={(e)=>{setUsername(e.target.value)}}
                    className="form-input" type="text"
                    placeholder="username" value={username}/>

                <input onChange={(e)=>{setPassword(e.target.value)}}
                    className="form-input" type="password"
                    placeholder="password" value={password}/>

                <div className="register-buttons">
                    <button className="register-btn" type="button">log in</button>
                    <button onClick={goToRegister} className="goto-login-btn" type="button">register</button>
                </div>
            </form>
            
            <div className="decorative-rect"></div>
        </section>

    )
}