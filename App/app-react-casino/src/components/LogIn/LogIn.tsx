import { useState } from "react";
import { NavLink as Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import './LogIn.css'

export const LogIn = ({onClose}: {onClose: Function}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    let navigate = useNavigate()

    const handleSubmit = async () => {
        try{
            const response = 
                await axios.post('http://localhost:3000/api/v1/login',
                    { username, password });
            setMessage(response.data);
            navigate("/")
            window.location.reload();
            localStorage.clear();
            localStorage.setItem('jwt-token', response.data.accessToken)
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    return(
        <>
            <div className='loginScreen' onClick={e => {
                if((e.target as HTMLElement).className === "loginScreen" || (e.target as HTMLElement).className === "registerButton") {
                    onClose()}
                    }}>
                <div className='login'>
                    <div className='login_leftside'>
                        <div className='login_image'>
                            <img className='image' src="./src/assets/images/login_ruleta.jpg" alt="" />
                        </div>
                        <div className='login_form'>
                            <h2 className='loginTitle'>UTimbaN</h2>
                            <h3 className='loginSubTitle'>Login</h3>
                            <form className='form'>
                                <div className='name'>
                                    <p className='formWord'>Username or Email</p>
                                    <input type="text" id='userId' className='loginForm' name='username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                                </div>
                                <div className='password'>
                                    <p className='formWord'>Password</p>
                                    <input type="password" id='password' className='loginForm' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                    <p className='forgotPassword'>Forgot your password?</p>
                                </div>
                            </form>
                            <div className='submitClass'>
                                <button onClick={handleSubmit} className='submit'> SUBMIT </button>
                                <Link to="/register" className="registerButton">Register here!</Link>
                                {message && <p>{message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className='login_rightside'>
                        <button onClick={() => onClose()}><img src="./src/assets/images/close.svg" alt="close" className='anotherLogin exitButton'/></button>
                        <p className='loginText'>ALSO LOG WITH</p>
                        <img src="./src/assets/images/apple.svg" alt="apple" className='anotherLogin'/>
                        <img src="./src/assets/images/google.svg" alt="google" className='anotherLogin'/>
                        <img src="./src/assets/images/steam.svg" alt="steam" className='anotherLogin'/>
                    </div>
                </div>
            </div>
        </>
    )
}