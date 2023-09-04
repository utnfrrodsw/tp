import React, { useEffect, useState } from 'react';
import { SidebarContainer, Playlists } from './styles.js';
import SidebarChoice from './SidebarChoice.jsx';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { Navigate, useLocation } from "react-router-dom";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../../interceptors/axiosConfig.js';

export default function Sidebar() {
  const [playlists, setPlaylists] = useState([]);
  const user = useSelector(state => state.user.user);
  const location = useLocation();

  const [goToPlaylist, setGoToPlaylist] = React.useState(false);
  const [goToSearch, setGoToSearch] = React.useState(false);
  const [goToHome, setGoToHome] = React.useState(false);
  const [goToLibrary, setGoToLibrary] = React.useState(false);

  useEffect(() => {
    if (user) {
      // Llamada a la API para obtener las playlists del usuario
      axios.get(`/api/playlists-usuario/${user.id}`)
        .then(response => {
          setPlaylists(response.data);
        })
        .catch(error => {
          console.error('Error fetching playlists:', error);
        });
    }
  }, [user]);

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
      <SidebarChoice title="Home" Icon={HomeIcon} onClick={() => setGoToHome(true)} />
      <SidebarChoice title="Search" Icon={SearchIcon} onClick={() => setGoToSearch(true)} />
      <SidebarChoice title="Library" onClick={() => setGoToLibrary(true)} Icon={LibraryMusicIcon} />
      <br />
      <br />
      <Playlists>PLAYLISTS</Playlists>
      <hr />
      {playlists.map((playlist, index) => (
        <Link key={index} to={`/playlist/${playlist.id}`} style={{textDecoration: 'none'}}>
            <SidebarChoice key={playlist.id} title={playlist.titulo} />
        </Link>
        
      ))}
    </SidebarContainer>
  )
}
