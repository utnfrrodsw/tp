import styled from "styled-components";
import BigCard from '../../styled-components/Body/BigCard.jsx'

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
padding: 10px;
`

const CardLeftContainer = styled.div`
display: flex;
background-color: transparent;
width: 20%;
align-items: center;
justify-content: center;
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
object-fit: cover;
width: fit-content;
box-shadow: 0px 0px 10px 1px;
`

const StyledH1 = styled.h1` 
font-size:35px;

@media (max-width: 500px){
    font-size:29px;
}
`

const TableSongs = styled.ol`
    display: flex;
    background-color: transparent;
    flex-direction: column;
    gap: 20px;
    opacity: 1;
    width: 100%;
    margin: 0 auto;
    color: #fff;
`

export {PlaylistContainer, CardContainer, TableContainerStyled, CardLeftContainer, 
CardRightContainer, ImagePlaylist, StyledH1, TableSongs}