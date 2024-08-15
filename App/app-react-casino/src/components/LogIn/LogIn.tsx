import { useState } from "react";
import axios from 'axios';
import './LogIn.css'

export const LogIn = ({onClose}: {onClose: Function}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try{
            const response = 
                await axios.post('http://localhost:3000/api/v1/login',
                    {username, password});
            setMessage(response.data);
            console.log('Sesion iniciada')
        } catch (error) {
            setMessage('Ocurrio un error al iniciar sesion')
            console.error(error)
        }
    };

    return(
        <>
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
                            <form className='form' onSubmit={handleSubmit}>
                                <div className='name'>
                                    <p className='formWord'>Username or Email</p>
                                    <input type="text" id='userId' className='loginForm' name='username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                                </div>
                                <div className='password'>
                                    <p className='formWord'>Password</p>
                                    <input type="password" id='password' className='loginForm' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                    <p className='forgotPassword'>Forgot your password?</p>
                                </div>
                                <div className='submitClass'>
                                    <button type='submit' className='submit'> SUBMIT </button>
                                    <p className='registerButton'> REGISTER FREE! </p>
                                </div>
                                {message && <p>{message}</p>}
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
        </>
    )
}