import React, { useEffect, useState } from 'react';
import { SidebarContainer, Playlists, NavContainer, NavBrand,ChoicesContainer } from './styles.js';
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
  const [showNavbar, setShowNavbar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (windowWidth <= 798) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  }, [windowWidth]);


  useEffect(() => {
    if (user) {
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
    <>
      {showNavbar ? (
        <NavContainer>
          <NavBrand><img src={process.env.PUBLIC_URL + '/logo_nospeak.png'} alt="logo" style={{ width: '160px', height: '70px', marginLeft: '55px' }}/></NavBrand>
          <ChoicesContainer>
            <SidebarChoice  Icon={HomeIcon} onClick={() => setGoToHome(true)} />
            <SidebarChoice  Icon={SearchIcon} onClick={() => setGoToSearch(true)} />
            <SidebarChoice  onClick={() => setGoToLibrary(true)} Icon={LibraryMusicIcon} />
          </ChoicesContainer>
        </NavContainer>
      ) : (
        <SidebarContainer>
          <img src={process.env.PUBLIC_URL + '/logo_nospeak.png'} alt="logo" style={{ width: '160px', height: '70px', marginLeft: '55px' }}/>
          <SidebarChoice title="Home" Icon={HomeIcon} onClick={() => setGoToHome(true)} />
          <SidebarChoice title="Search" Icon={SearchIcon} onClick={() => setGoToSearch(true)} />
          <SidebarChoice title="Library" onClick={() => setGoToLibrary(true)} Icon={LibraryMusicIcon} />
          <br />
          <br />
          <Playlists>PLAYLISTS</Playlists>
          <hr />
          {playlists.map((playlist, index) => (
            <Link key={index} to={`/playlist/${playlist._id}`} style={{ textDecoration: 'none' }}>
              <SidebarChoice key={playlist.id} title={playlist.titulo} />
            </Link>
          ))}
        </SidebarContainer>
      )}
    </>
  );
}  