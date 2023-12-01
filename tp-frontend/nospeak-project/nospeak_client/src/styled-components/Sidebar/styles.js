import styled from "styled-components";

const NavContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #000;
    height: 8%;
    padding: 0 20px;
    width: 100%;
    color: white;
    position: fixed;
    top: 0;
    z-index: 1;
`;

const NavBrand = styled.div`
  display: flex;
  align-items: start;
  margin-right: 10px;
  & img {
    max-width: 50%; /* La imagen se ajustará al ancho máximo del contenedor */
    max-height:80px; /* La altura se ajustará automáticamente para mantener la proporción */
  }
`;

const SidebarContainer = styled.div`
display: flex; 
flex-direction: column;
width: 20%;
height: 101vh;
background-color: #000;
min-width: 240px;
color: #fff;
& img{
    height: 70px;
    padding:10px;
    margin-right:auto;
}

& hr{
    border: 1px solid smokegray;
    width:90%;
    margin: 10px auto;

}
@media (max-width: 798px) {
  display: none;
}


`
const Playlists = styled.div`
margin:5px 10px;

`;


const Choices = styled.div`
display: flex;
align-items: center;
color:gray;
height: 40px;
cursor: pointer;
transition: 300ms color ease-in;
margin:5px 10px;
&:hover{
    color: #fff;
}
& h5{
    margin : 10px 0 0 20px;
}

@media (max-width: 798px) {
    /* Estilos específicos para pantallas más pequeñas */
    flex-direction: row; /* Cambia la dirección de flexión a fila */
    width: auto; /* Ancho automático para que los elementos no se superpongan */
  }
`

const ChoicesContainer = styled.div`
  display: flex; /* Utiliza display: flex en un contenedor para alinear los elementos horizontalmente */
  flex-direction: row; /* Para mantener los elementos en una columna */
  align-items: flex-start; /* Alinea los elementos a la izquierda */
  margin-right: 15px;
`;

export { SidebarContainer,Playlists,Choices,ChoicesContainer, NavContainer,NavBrand };