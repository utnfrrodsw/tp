import styled from "styled-components";

const FooterContainer = styled.div`
    position:fixed;
    bottom:0;
    width:100%;
    height:10%;
    background-color:#181818;
    color:#fff;
    display: flex;
    justify-content: space-between;

`

const FooterLeft = styled.div`
    flex: 0.3;
    display: flex;
    align-items: center;
    max-width: 300px;
    & h4 {
        margin-bottom: auto;
        font-size: 18px;
        margin-top: -1px;
    }
    & p {  
        font-size: 12px;
        margin-top: auto;
    }
    & img{ 
        height: 60px;
        width: 60px;
        margin-right: 20px;
        object-fit: contain;
        margin-left: 8px;
    }
`;

const FooterCenter = styled.div`
    flex: 0.4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 300px;
`;

const FooterRight = styled.div`
    flex: 0.3;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 35px;

    // Ahora accedo a la clase del slider para cambiarle el color
    // Tuve que fijarme inspeccionando cual era pq era color azul y no pegaba con el resto
    & .MuiSlider-root{
        color:#FFA130;
    }
`;

export { FooterContainer, FooterLeft, FooterRight, FooterCenter };