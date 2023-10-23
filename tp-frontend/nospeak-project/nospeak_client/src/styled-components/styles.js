import styled, {keyframes} from "styled-components";


const ButtonContainer = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: space-between;
gap: 35px;
width: 100%;
`;

const pressAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledButton = styled.button`
  padding: 10px;
  background-color: #FFA130;
  border-radius: 90px;
  margin-block: 2px;
  color: #000;
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  width: 100%;
  border: none; /* Elimina el borde del botón */
  box-shadow: none; /* Elimina la sombra */
  transition: background-color 0.2s ease; /* Agrega transición al color de fondo */
  margin-bottom: 30px;
  
  &:hover {
    background-color: #FFD560;
    transform: scale(1.05);
    color: #333; /* Cambia el color de fondo en el hover */
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    top: 0;
    left: 0;
    transform-origin: center;
    animation: ${pressAnimation} 0.3s ease-in-out;
    pointer-events: none;
    opacity: 0;
  }

  &:active::after {
    opacity: 1;
  }

  @media (max-width: 991px) {
    /* Ajustamos el ancho en pantallas pequeñas (hasta 991px) */
    width: 60%;
  }
`;

const StyledButtonSecondary = styled.button`
padding: 10px;
background-color: rgb(120,120,120);
border-radius: 90px;
margin-block: 2px;
color: #000;
font-weight: bold;
font-size: 20px;
display: inline-block;
width: 100%;
border: none; /* Elimina el borde del botón */
box-shadow: none; /* Elimina la sombra */
transition: background-color 0.2s ease; /* Agrega transición al color de fondo */
margin-bottom: 30px;
&:hover {
  background-color: #FFD560;
  transform: scale(1.05);
  color: #333; /* Cambia el color de fondo en el hover */
}

&::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
  transform-origin: center;
  animation: ${pressAnimation} 0.3s ease-in-out;
  pointer-events: none;
  opacity: 0;
}

&:active::after {
  opacity: 1;
}
`;

const Label = styled.label`
  font-size: 1rem;
  color: white;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  border: 0px;
  font-size: 1rem;
  font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
  box-sizing: border-box;
  border-radius: 4px;
  padding-inline: 14px;
  padding-block-start: var(--spacer--2,8px);
  padding-block-end: var(--spacer--2,8px);
  min-block-size: 48px;
  background-color: transparent;
  box-shadow: inset 0 0 0 1px var(--essential-subdued,#878787);
  color: white;
  width: 100%;
`;

const SuccessAlert = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin-bottom: 10px;
  }

  button {
    margin-top: 10px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;



export {ButtonContainer, StyledButton, Input, Label, StyledButtonSecondary, SuccessAlert, Overlay}