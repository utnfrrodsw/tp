import './LogIn.css'

export const LogIn = ({onClose}: {onClose: Function}) => {
    return(
        <>
            <div className='loginScreen' onClick={e => {
                    if((e.target as HTMLElement).className === "loginScreen") {
                    onClose()}
                    }}>
                <div className='loginCuadro'>
                    <div className='bienvenida'>
                        <p>Iniciar Sesion</p>
                        <button className='svgCruz' onClick={() => onClose()}><svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cross-circle</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Icon-Set" transform="translate(-568.000000, -1087.000000)" fill="#ffffff"> <path d="M584,1117 C576.268,1117 570,1110.73 570,1103 C570,1095.27 576.268,1089 584,1089 C591.732,1089 598,1095.27 598,1103 C598,1110.73 591.732,1117 584,1117 L584,1117 Z M584,1087 C575.163,1087 568,1094.16 568,1103 C568,1111.84 575.163,1119 584,1119 C592.837,1119 600,1111.84 600,1103 C600,1094.16 592.837,1087 584,1087 L584,1087 Z M589.717,1097.28 C589.323,1096.89 588.686,1096.89 588.292,1097.28 L583.994,1101.58 L579.758,1097.34 C579.367,1096.95 578.733,1096.95 578.344,1097.34 C577.953,1097.73 577.953,1098.37 578.344,1098.76 L582.58,1102.99 L578.314,1107.26 C577.921,1107.65 577.921,1108.29 578.314,1108.69 C578.708,1109.08 579.346,1109.08 579.74,1108.69 L584.006,1104.42 L588.242,1108.66 C588.633,1109.05 589.267,1109.05 589.657,1108.66 C590.048,1108.27 590.048,1107.63 589.657,1107.24 L585.42,1103.01 L589.717,1098.71 C590.11,1098.31 590.11,1097.68 589.717,1097.28 L589.717,1097.28 Z" id="cross-circle"></path></g></g></g></svg></button>
                    </div>
                    <form action="" method="" className='formulario'>
                        <ul className='formularioUl'>
                            <li className='formLogin'>
                                <label htmlFor="userId">Nombre de usuario:</label>
                                <input type="text" id='userId' className='ingresoForm' name='user_name'/>
                            </li>
                            <li className='formLogin'>
                                <label htmlFor="password">Contraseña:</label>
                                <input type="password" id='password' className='ingresoForm' name='user_password'/>
                            </li>
                            <li className='formSubmit'>
                                <button type='submit' className='gold-button'>Iniciar Sesion</button>
                            </li>
                        </ul>
                    </form>
                    <p>No tenes una cuenta? <span>Crea aca una</span> de forma gratuita!</p>
                </div>
            </div>
        </>
    )
}