import styled from "styled-components";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import AddCircle from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



const BodyContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 80%;
    background-color: #232323;
    padding: 10px;
    @media (max-width: 798px) {
        width: 100%;
    }
    `
const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0px;
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

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-left: 15px;
    padding-bottom: 15px;
`;

const IconContainer = styled.div`
display: flex;
align-items: center;
padding-left: 10px;
`;



export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    width: 300px;
  }
`;

export const StyledDialogTitle = styled(DialogTitle)`
  color: white;
`;

export const StyledDialogContentText = styled(DialogContentText)`
  color: white;
`;

export const StyledButton = styled(Button)`
  color: white;
`;


export const Overlay = styled.div`
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

export const AlertContainer = styled.div`
  background-color: #000;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

export const AlertTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  margin-top: 0px;
  color: white;

`;

export const AlertText = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
  color: white;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledButtonAlert = styled.button`
  background-color: #FFA130;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin: 0 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #FF7F00;
  }
`;

const StyledAddCircle = styled(AddCircle)`
  &:hover {
      transform: scale(1.1);
      // color: #FFD560; /* Cambia el color de fondo en el hover */
    }
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  &:hover {
      transform: scale(1.1);
      color: #FFD560; /* Cambia el color de fondo en el hover */
    }
`;

const StyledEditIcon = styled(EditIcon)`
  &:hover {
      transform: scale(1.1);
      color: #FFD560; /* Cambia el color de fondo en el hover */
    }
`;

const StyledCard = styled(Card)`
cursor: pointer;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    
    &:hover {
        transform: translateY(-5px); 
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
    }
`;

export const ComboBoxContainer = styled.div`
    position: relative;
    display: inline-block;
`;

export const ComboBoxButton = styled.button`
    background-color: transparent;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

export const ArrowIcon = styled(ArrowDropDownIcon)`
    margin-left: 8px;
`;

export const ComboBoxList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #282828;
    border-radius: 4px;
    border: 1px solid #333333;
    padding: 8px;
    list-style: none;
    max-height: 200px;
    overflow-y: auto;
`;

export const ComboBoxItem = styled.li`
    padding: 8px;
    color: white;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        background-color: #333333;
    }
`;


export { cardStyle,gradientStyle, BodyContainer, HeaderContainer, HeaderLeft, HeaderRight, SearchInput, TitleContainer,
IconContainer, StyledAddCircle, StyledDeleteIcon, StyledEditIcon, StyledCard };