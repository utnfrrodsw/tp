import styled from "styled-components";

const BodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    background-color: #232323;
    padding: 10px;
    `
const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 35px;
    padding: 10px;
    `;

const HeaderLeft = styled.div`
border: 0px;
display: block;
font-size: 1rem;
font-weight: 400;
font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
transition: box-shadow 0.1s ease-in-out 0s, color 0.1s ease-in-out 0s;
inline-size: 100%;
box-sizing: border-box;
-webkit-tap-highlight-color: transparent;
border-radius: var(--border-radius-md,8px);
padding-inline: 14px;
padding-block-start: var(--spacer--2,8px);
padding-block-end: var(--spacer--2,8px);
min-block-size: var(--control-size-md,48px);
background-color: #121212;
box-shadow: inset 0 0 0 1px var(--essential-subdued,#878787);
color: white;
width: 40%;
display: flex;
align-items: center;
flex:0.5;
min-width: 75px;
border-radius: 30px;
padding:10px;

& input{
    border: none;
    width: 100%;
    
}
&:hover,
&:focus {
    outline: white solid;
  }

`;

const SearchInput = styled.input`
background-color: #121212;
font-size: 1rem;
font-weight: 400;
font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
inline-size: 100%;
box-sizing: border-box;
color: white;
&:focus{
    outline: none;
}
`

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    & h4{
        margin-left: 15px;
        margin-right: 15px;
    }`;

const gradientStyle = {
    backgroundImage: `linear-gradient(to right, black, #232323)`,
  };

const cardStyle = {
    backgroundColor: '#181818'
}


export { cardStyle,gradientStyle, BodyContainer, HeaderContainer, HeaderLeft, HeaderRight, SearchInput };