import { useRef, useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import './LogIn.css'
import AuthContext from '../../context/AuthProvider';

import axios from '../Axios/axios';
const LOGIN_URL = 'users';

export const LogIn = ({onClose}: {onClose: Function}) => {
    const setAuth = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
        console.log(username, password);
        setUsername('');
        setPassword('');
        setSuccess(true);
    } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg('Login Failed');
        }
        errRef.current.focus();
    }}

    return(
        <>
                {success ? (
                    <section>
                        <h1>You are logged in!</h1>
                        <br />
                        <p>
                            <Link to='/'>Go to home</Link>
                        </p>
                    </section>
                ): (
            <div className='loginScreen' onClick={e => {
                if((e.target as HTMLElement).className === "loginScreen") {
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
                            <form action="" method="" className='form' onSubmit={handleSubmit}>
                                <div className='name'>
                                    <p className='formWord'>Username or Email</p>
                                    <input type="text" id='userId' className='loginForm' name='user_name' ref={userRef} autoComplete='off' onChange={(e) => setUsername(e.target.value)} value={username} required/>
                                </div>
                                <div className='password'>
                                    <p className='formWord'>Password</p>
                                    <input type="password" id='password' className='loginForm' name='user_password' onChange={(e) => setPassword(e.target.value)} value={password} required/>
                                    <p className='forgotPassword'>Forgot your password?</p>
                                </div>
                                <div className='submitClass'>
                                    <button type='submit' className='submit'>SUBMIT</button>
                                    <p className='registerButton'>REGISTER FREE!</p>
                                </div>
                            </form>
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
            )}
        </>
    )
}