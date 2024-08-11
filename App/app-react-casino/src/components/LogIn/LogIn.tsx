import './LogIn.css'

export const LogIn = ({onClose}: {onClose: Function}) => {
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
                            <form action="" method="" className='form'>
                                <div className='name'>
                                    <p className='formWord'>Username or Email</p>
                                    <input type="text" id='userId' className='loginForm' name='user_name'/>
                                </div>
                                <div className='password'>
                                    <p className='formWord'>Password</p>
                                    <input type="password" id='password' className='loginForm' name='user_password'/>
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
        </>
    )
}