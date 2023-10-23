import styled from "styled-components";
import {Link} from 'react-router-dom';

const FormLoginContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: start;
height: 100vh;
overflow-x: hidden;
background: linear-gradient(0deg, black, rgb(50,50,50));
& img{
    width:100%;
}
`

const NavLogin = styled.nav`
display: flex;
flex-direction: row;
justify-content: start;
align-items: center;
background-color: black;
color: white;
padding: 0px 0px 0px 30px;
width: 100%;
height: 12%;
& img{
    height: 50px;
    width:160px;
}
@media (max-width: 500px){
    padding: 0px;
    justify-content: center;
}
`

const FormLogin = styled.div`
display:flex;
justify-content: start;
align-items: center;
flex-direction: column;
gap: 12.5px;
background-color: black;
padding: 10px;
margin-top: 20px;
color: white;
border-radius: 8px;
height:80%;
width: 50%;
@media (max-width: 500px){
    width: 90%;
    margin-top: 10px;
    font-size: smaller;
}
font-weight: bold;
font-family: var(--font-family,CircularSpTitle,CircularSpTitle-Tall,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
`



const LoginInput = styled.input`
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
width: 40%;

@media (max-width: 500px){
    width: 90%;
}

&:hover{
    outline: white solid;
}

`

const LoginButton = styled.button`
padding:10px;
background-color:#FFA130;
border-radius:90px;
margin-block: 2px;
color:#000;
font-weight:bold;
font-size: 20px;
display: inline-block;
width: 40%;
@media (max-width: 500px){
    width: 90%;
}
font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
`

const RegisterContainer = styled.div`
display: flex;
flex-direction: row;
gap: 10px;

@media (max-width: 500px){
    flex-direction: column;
}
`

const StyledLink = styled(Link)`
color: white;
&:hover{
    color: #FFA130;
}
`

const StyledH1 = styled.h1`
margin: 25px; 
font-size:35px;

@media (max-width: 500px){
    margin: 25px; 
    font-size:29px;
}
`

const StyledSpan = styled.span`
font-weight: normal;
color: #707070;
`

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: space-between;
    gap: 35px;
    width: 40%;
`;


export {FormLoginContainer, FormLogin, NavLogin, LoginButton, LoginInput, StyledLink, StyledH1, StyledSpan,
RegisterContainer, ButtonContainer};