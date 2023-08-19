import React from 'react'
import { HeaderContainer, HeaderLeft, HeaderRight, SearchInput } from './styles.js'
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from '@mui/material';
import { Navigate } from "react-router-dom";

const Header = () => {

    const [goToAccount, setGoToAccount] = React.useState(false);

    if (goToAccount) {
        return <Navigate to="/account" />;
    }

    return (
    <HeaderContainer>
        <HeaderLeft>
            <SearchIcon style={{ color: "white" }}/>
            <SearchInput  type="text" placeholder='Search for artists, songs, or other' />
        </HeaderLeft>
        <HeaderRight>
            <Avatar/>
            <h4 style={{color:'white'}} onClick={() => {setGoToAccount(true);}}>Username</h4>
        </HeaderRight>
    </HeaderContainer>

    )
}

export default Header