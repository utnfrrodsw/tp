import styled from "styled-components";

const InicioContainer = styled.div`
display:grid;
place-items:center;
height:100vh;
background-color:#000;
& img{
    width:100%;
}
`

const InicioButton = styled.button`
padding:20px;
background-color:#FFA130;
border-radius:90px;
color:#000;
font-weight:bold;
text-decoration:none;
text-transform:uppercase;
`
export{InicioContainer, InicioButton};