import styled from "styled-components";

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
`

export { SidebarContainer,Playlists,Choices };