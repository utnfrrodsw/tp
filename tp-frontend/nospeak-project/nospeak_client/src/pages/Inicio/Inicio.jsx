import React from "react";
import { InicioContainer, ButtonContainer } from "./styles.js";
import { Navigate } from "react-router-dom";
import { StyledButton } from "../../styled-components/styles.js";



export function Inicio() {
    const [goToLogin, setGoToLogin] = React.useState(false);

    if (goToLogin) {
        return <Navigate to="/login" />;
    }

    return (
        <InicioContainer>
            <img src={process.env.PUBLIC_URL + '/logo_nospeak.png'} alt="logo" style={{ width: '50%', height: '60%' }}/>
            <ButtonContainer>
                <StyledButton onClick={() => {setGoToLogin(true);}}>
                        Login with NoSpeak
                </StyledButton>
            </ButtonContainer>
        </InicioContainer>
    );
}


export default Inicio;