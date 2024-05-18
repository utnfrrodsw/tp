import './LogIn.css'

export const LogIn = ({onClose}: {onClose: Function}) => {
    return(
        <>
            <div className='loginScreen' onClick={e => {
                    if((e.target as HTMLElement).className === "loginScreen") {
                    onClose()}
                    }}>
                <div className='loginCuadro'>
                    <div className='login_leftside'>
                        <div className='login_image'>
                            <img className='image' src="./src/assets/images/login_ruleta.jpg" alt="" />
                        </div>
                        <div className='login_form'>
                            <h2 className='loginTitle'>UTimbaN</h2>
                            <h3 className='loginSubTitle'>Login</h3>
                            <form action="" method="" className='formulario'>
                                <div className='name'>
                                    <p className='formFrase'>Username or Email</p>
                                    <input type="text" id='userId' className='ingresoForm' name='user_name'/>
                                </div>
                                <div className='password'>
                                    <p className='formFrase'>Password</p>
                                    <input type="password" id='password' className='ingresoForm' name='user_password'/>
                                    <p>Forgot your password?</p>
                                </div>
                                <div className='submitClass'>
                                    <button type='submit' className='boton_submit'>SUBMIT</button>
                                    <p className='text-center'>REGISTRE FREE!</p>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='login_rightside'>
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