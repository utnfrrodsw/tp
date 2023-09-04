import React from "react";
import { InicioContainer, InicioButton, ButtonContainer } from "./styles.js";
import { Navigate } from "react-router-dom";
import { StyledButton } from "../../styled-components/styles.js";



export function Inicio() {
    const [goToLogin, setGoToLogin] = React.useState(false);

    if (goToLogin) {
        return <Navigate to="/login" />;
    }

    return (
        <InicioContainer>
            <img src="https://1000logos.net/wp-content/uploads/2017/08/Spotify-symbol.jpg" alt="Logo de nospeak" />
            <ButtonContainer>
                <StyledButton onClick={() => {setGoToLogin(true);}}>
                        Login with NoSpeak
                </StyledButton>
            </ButtonContainer>
        </InicioContainer>
    );
}


export default Inicio;