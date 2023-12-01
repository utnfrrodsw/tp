import styled from "styled-components";

const PlaylistContainer = styled.div`
display: flex;
flex-direction: column;
height: 100%;
width: 100%;
border-radius: 5px;
overflow: hidden;
background-image: linear-gradient(to bottom, #FFA130, #000);
font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
`

const CardContainer = styled.div`
display: flex;
flex-direction: row;
height: 30%;
width: 100%;
background-color: transparent;
`

const TableContainerStyled = styled.div`
display: flex;
height: 70%;
width: 100%;
background-color: rgba(0, 0, 0, .3);
padding: 10px 20px 20px 20px;
`

const CardLeftContainer = styled.div`
display: flex;
background-color: transparent;
width: 20%;
align-items: center;
justify-content: center;
padding: 15px 15px 15px 15px;
`

const CardRightContainer = styled.div`
display: flex;
flex-direction: column;
background-color: transparent;
width: 78%;
color: #fff;
`

const ImagePlaylist = styled.img`
block-size: 80%;
inline-size: 80%;
margin: auto;
width: fit-content;
box-shadow: 0px 0px 10px 1px;
width: 90%; /* Asegura que la imagen ocupe todo el ancho del contenedor */
height: 90%; /* Asegura que la imagen ocupe todo el alto del contenedor */
object-fit: cover;
`

const StyledH1 = styled.h1` 
font-size:35px;

@media (max-width: 500px){
    font-size:29px;
}
`


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  gap: 10px;
  margin-top: 20px;
`;

const ColumnContainer = styled.div`
margin: 0 auto;
display: flex;
flex-direction: row;
justify-content: space-between;
width: 100%;
`;

const ColumnForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 48%;
`;


const ComboBox = styled.select`
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





export {PlaylistContainer, CardContainer, TableContainerStyled, CardLeftContainer, 
CardRightContainer, ImagePlaylist, StyledH1, FormContainer, ColumnForm, ComboBox, 
ColumnContainer}