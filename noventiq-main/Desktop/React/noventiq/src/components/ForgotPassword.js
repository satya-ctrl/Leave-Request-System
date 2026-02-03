import React from "react";
import { Link } from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";
import '../css/Login.css';

function ForgotPassword(){
    return(
        <>
            <Header />
            {   
                <div className="login">
                    <form className="form-login">
                        <div className='form-group'>
                            <label htmlFor="email">Email :</label>
                            <div className="input-email">
                                <i className="fas fa-envelope icon"></i>
                                <input type="email" name="email" placeholder="Enter your email" required />
                            </div>
                        </div>
                    </form>
                    <div className="login-button">
                        <button type='submit'>Reset</button>
                    </div>
                    <div className="login-button">
                        <Link to="/">Back To Login</Link>
                    </div>
                </div>
            }
            <Footer />
        </>
    )
}

export default ForgotPassword;