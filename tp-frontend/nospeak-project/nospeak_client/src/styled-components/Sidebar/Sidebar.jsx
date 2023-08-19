import * as React from 'react';
import { SidebarContainer, Playlists } from './styles.js';
import SidebarChoice from './SidebarChoice.jsx';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { Navigate, useLocation } from "react-router-dom";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

export default function Sidebar() {

    const [goToPlaylist, setGoToPlaylist] = React.useState(false);
    const [goToSearch, setGoToSearch] = React.useState(false);
    const [goToHome, setGoToHome] = React.useState(false);
    const [goToLibrary, setGoToLibrary] = React.useState(false);
    const location = useLocation();

    if (goToPlaylist && location.pathname !== "/playlist") {
        return <Navigate to="/playlist" />;
    }
    if (goToSearch && location.pathname !== "/search") {
        return <Navigate to="/search" />;
    }
    if (goToHome && location.pathname !== "/home"){
        return <Navigate to="/home" />;
    }
    if (goToLibrary && location.pathname !== "/library"){
        return <Navigate to="/library" />;
    }


    return (
        <SidebarContainer>
            <img src="https://1000logos.net/wp-content/uploads/2017/08/Spotify-symbol.jpg" alt="Logo de Spotify" />
            <SidebarChoice title="Home" Icon={HomeIcon} onClick={() => {setGoToHome(true);}}/>
            <SidebarChoice title="Search" Icon={SearchIcon} onClick={() => {setGoToSearch(true);}}/>
            <SidebarChoice title="Your Library" onClick={() => {setGoToLibrary(true);}} Icon={LibraryMusicIcon}/>
            <br/>
            <br/>
            <Playlists>PLAYLISTS</Playlists>
            <hr />
            <SidebarChoice title="Roadtrip"/>
            <SidebarChoice title="Previa - POLACO GDC" onClick={() => {setGoToPlaylist(true);}}/>
            <SidebarChoice title="Top 50 - Argentina"/>
            <SidebarChoice title="Top 50 - Global"/>
        </SidebarContainer>
    )
}
