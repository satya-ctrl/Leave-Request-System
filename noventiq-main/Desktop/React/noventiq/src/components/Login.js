import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import Header from './Header';
import Footer from './Footer';
import '../css/Login.css';

function Login(){
    const { t, i18n } = useTranslation(); // Initialize useTranslation hook

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [language, setLanguage] = useState('en');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        // Function to fetch and set the browser's language preference
        const fetchBrowserLanguage = () => {
            const userLanguage = navigator.language.split('-')[0]; // Get the user's preferred language without region code
            switch (userLanguage) {
                case 'en':
                case 'hi':
                case 'bn':
                    setLanguage(userLanguage);
                    i18n.changeLanguage(userLanguage); // Change language
                    break;
                default:
                    setLanguage('en'); // Default to English if the browser language is unsupported
                    i18n.changeLanguage('en');
                    break;
            }
        };

        fetchBrowserLanguage(); // Fetch and set the language on component mount

         // Check if "rememberMe" cookie is set and retrieve stored email
         const rememberMeCookie = getCookie('rememberMe');
         if (rememberMeCookie) {
             setEmail(rememberMeCookie);
             setRememberMe(true);
         }
    }, []); // Empty dependency array ensures this effect runs only once

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(''); // Clear email error when user starts typing again
    };

    const validateEmail = (email) => {
        // Basic email validation using regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(String(email).toLowerCase())) {
            return false;
        }

        // Check if email is from a valid corporate domain and not from public providers
        const domain = email.split('@')[1];
        const publicDomains = ['gmail.com', 'outlook.com', 'yahoo.com']; // Add other public domains as needed
        if (publicDomains.includes(domain)) {
            return false;
        }

        // Check if email is from a valid corporate domain
        const corporateDomains = ['noventiq.com']; // Add other corporate domains as needed
        if (!corporateDomains.includes(domain)) {
            return false;
        }

        return true;
    };

    const validatePassword = (password) => {
        if(!password)  return false;

        return true;

    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError(''); // Clear password error when user starts typing again
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage); // Change language dynamically
    };

    const handleRememberMeChange = (e) => {
        const isChecked = e.target.checked;
        setRememberMe(isChecked);

        // Manually set or delete cookie based on checkbox state
        if (isChecked) {
            setCookie('rememberMe', email, 30); // Set cookie for 30 days
        } else {
            deleteCookie('rememberMe');
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Email validation check
        if (!validateEmail(email)) {
            setEmailError(t('login.errors.email'));
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError(t('login.errors.password'));
            return;
        }

        console.log('Logging in with:', { email, password, rememberMe, language });
    };

     // Function to set cookie
     const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    };

    // Function to get cookie by name
    const getCookie = (name) => {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    };

     // Function to delete cookie by name
     const deleteCookie = (name) => {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    };
    return(
        <>
        <Header/>
        <div className="login">
            <form className="form-login">
                <div className='form-group'>
                    <label htmlFor="email">{t('login.email')}</label>
                    <div className="input-email">
                        <i className="fas fa-envelope icon"></i>
                        <input type="email" name="email" value={email} onChange={handleEmailChange} placeholder={t('login.emailPlaceholder')} required />
                    </div>
                </div>
                {emailError && <div className="error">{emailError}</div>}
                <div className='form-group'>
                    <label htmlFor="password">{t('login.password')}</label>
                    <div className="input-password">
                        <i className="fas fa-lock icon"></i>
                        <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={handlePasswordChange} placeholder={t('login.passwordPlaceholder')} required />
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} icon`} onClick={togglePasswordVisibility} id="togglePassword"></i>
                    </div>
                </div>
                {passwordError && <div className="error">{passwordError}</div>}
                <div className="forgot">
                        <span> <Link to='/forgot'>{t('login.forgotPassword')}</Link></span>
                </div>
                <div className="form-group">
                    <label htmlFor="language">{t('login.language')}</label>
                    <div className="language-dropdown">
                        <select name="language" id="language" value={language} onChange={handleLanguageChange}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="bn">Bengla</option>
                        </select>
                        <i className="fas fa-caret-down dropdown-icon"></i>
                    </div>
                </div>
                <div className="form-switch forgot remember-me">
                    <input className="form-check-input" type="checkbox" role="switch" id="rememberMe" checked={rememberMe} onChange={handleRememberMeChange}/>
                    <span className="form-check-label" htmlFor="remember">{t('login.rememberMe')}</span>
                </div>
            </form>
        </div>
        <div className="login-button">
            <button type='submit' onClick={handleFormSubmit}>{t('login.loginButton')}</button>
        </div>
        <Footer />
        </>
    )
}

export default Login;