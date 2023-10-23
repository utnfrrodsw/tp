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

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: space-between;
    gap: 35px;
    width: 15%;
`;

export{InicioContainer, ButtonContainer};