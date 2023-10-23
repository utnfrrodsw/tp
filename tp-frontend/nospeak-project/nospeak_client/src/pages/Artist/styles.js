import styled from "styled-components";


const CardRightContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
background-color: transparent;
width: 78%;
color: #fff;
padding-bottom: 15px;
gap: 10px;
`

export const CardLeftContainer = styled.div`
display: flex;
flex-direction: column;
background-color: transparent;
width: 20%;
align-items: center;
justify-content: center;
padding: 15px 15px 15px 15px;
`

export const ImagePlaylist = styled.img`
  width: 150px; /* Ajusta el tamaño según sea necesario */
  height: 150px;
  border-radius: 50%; /* Agrega el estilo de borde redondeado */
  object-fit: cover; /* Ajusta cómo se ajusta la imagen dentro del círculo */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Opcional: sombra para resaltar */
`;


export const CustomEditAlert = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EditAlertContent = styled.div`
  background-color: #242424;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const EditAlertTitle = styled.h1`
  color: #fff;
  font-size: 1.5rem;
`;

export const EditAlertText = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
  font-size: 1rem;
`;

export const EditAlertButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px
`;


export {CardRightContainer}