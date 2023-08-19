import React from "react";
import { InicioContainer, InicioButton } from "./styles.js";
import { Navigate } from "react-router-dom";



export function Inicio() {
    const [goToLogin, setGoToLogin] = React.useState(false);

    if (goToLogin) {
        return <Navigate to="/login" />;
    }

    return (
        <InicioContainer>
            <img src="https://1000logos.net/wp-content/uploads/2017/08/Spotify-symbol.jpg" alt="Logo de nospeak" />
            <InicioButton onClick={() => {setGoToLogin(true);}}>
                    Login with NoSpeak
            </InicioButton>
        </InicioContainer>
    );
}


export default Inicio;