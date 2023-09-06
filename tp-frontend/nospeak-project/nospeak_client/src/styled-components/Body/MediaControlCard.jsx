import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import AddCircle from '@mui/icons-material/AddCircle';
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { 
    cardStyle, 
    TitleContainer, 
    IconContainer,
    StyledAddCircle, 
    StyledEditIcon, 
    StyledDeleteIcon,
    StyledCard,
    ComboBoxContainer,
    ComboBoxButton,
    ArrowIcon,
    ComboBoxList,
    ComboBoxItem
} from './styles';
import {Navigate} from "react-router-dom";
import { Link } from 'react-router-dom';
import Icon from '@mui/material/Icon';
import { useSelector } from 'react-redux';




export default function MediaControlCard({client, songs, setSongs, setDeleteAlertData}) {
    const theme = useTheme();
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
    const [availablePlaylists, setAvailablePlaylists] = useState([]);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const user = useSelector((state) => state.user.user);

    const [userHistorial, setUserHistorial] = useState(null);
    const [songToAdd, setSongToAdd] = useState(null);
    const [favoriteState, setFavoriteState] = useState({});




    const handleDelete = (songId, index) => {
        const songToDelete = songs[index];
        setDeleteAlertData({
          songId: songToDelete._id,
          songTitle: songToDelete.titulo,
          indexToRemove: index,
        });
      };

    const fetchUserHistorial = () => {
        if (user && user.id) {
            client.get(`/api/historiales-usuario/${user.id}`)
            .then(response => {
                setUserHistorial(response.data);
            })
            .catch(error => {
                console.error('Error fetching user historial:', error);
            });
        }
    };
      

  
    useEffect(() => {

        fetchUserHistorial();
    }, [user]);

    // useEffect(() => {
    //     if (userHistorial && songToAdd) {

    //       client.patch(`/api/historiales/${userHistorial._id}`, {
    //         canciones: [...userHistorial.canciones, songToAdd],
    //       })
    //         .then(response => {

    //           console.log('Canción agregada al historial:', response.data);
      
    //         })
    //         .catch(error => {
    //           console.error('Error al agregar la canción al historial:', error);
    //         });
    //     }
    //   }, [userHistorial, songToAdd]);

    const handleFavoriteToggle = (songId) => {
        // Cambia el estado isFavorite para esta canción al contrario de su valor actual
        setFavoriteState((prevState) => ({
          ...prevState,
          [songId]: !prevState[songId],
        }));
      
        // Obtén el historial del usuario desde el estado
        const userHistorialCopy = { ...userHistorial };
      
        // Verifica si la canción ya está en el historial
        const songIndex = userHistorialCopy.canciones.findIndex(
          (cancion) => cancion === songId
        );
      
        if (songIndex !== -1) {
          // Si la canción está en el historial, elimínala
          userHistorialCopy.canciones.splice(songIndex, 1);
      
          // Realiza una solicitud PATCH para actualizar el historial
          client
            .patch(`/api/historiales/${userHistorialCopy._id}`, userHistorialCopy)
            .then((response) => {
              console.log('Canción eliminada del historial:', response.data);
            })
            .catch((error) => {
              console.error('Error al eliminar la canción del historial:', error);
            });
        } else {
          // Si la canción no está en el historial, agrégala
          userHistorialCopy.canciones.push(songId);
      
          // Realiza una solicitud PATCH para actualizar el historial
          client
            .patch(`/api/historiales/${userHistorialCopy._id}`, userHistorialCopy)
            .then((response) => {
              console.log('Canción agregada al historial:', response.data);
            })
            .catch((error) => {
              console.error('Error al agregar la canción al historial:', error);
            });
        }
      };
      
      
      
  

    return (
        <>
            <TitleContainer>
                <h1 style={{color: 'white'}}>Songs</h1>
                <IconContainer>
                    <Link to={{ pathname: `/song/${0}` }}>
                        <StyledAddCircle sx={{ color: '#FFA130'}} />
                    </Link>
                </IconContainer>
            </TitleContainer>
            <React.Fragment>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap:5 }}>
                    {songs.map((song, index) => (
                        <StyledCard key={index} sx={{ display: 'flex', width: 300, marginBottom: 5, marginLeft:2, borderRadius: '10px' }}>
                        <Box sx={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5" color="white">
                                    {song.titulo}
                                </Typography>
                                <Typography variant="subtitle1" color="white" component="div">
                                    {song.artista.nombre}
                                </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 1, pb: 1}}>
                                    <IconButton aria-label="delete" onClick={() => handleDelete(song.id, index)}>
                                        <StyledDeleteIcon sx={{ color: 'white' }} />
                                    </IconButton>
                                    <IconButton
                                        aria-label="play/pause"
                                        onClick={() => handleFavoriteToggle(song.id)}
                                        >
                                        <FavoriteIcon
                                            sx={{
                                            height: 35,
                                            width: 35,
                                            color: favoriteState[song.id] ? '#FFA130' : 'white',
                                            }}
                                        />
                                        </IconButton>
                                    <IconButton aria-label="edit">
                                        <Link to={{ pathname: `/song/${song.id}` }}>
                                            <StyledEditIcon sx={{ color: 'white' }} />
                                        </Link>
                                    </IconButton>
                            </Box>
                            
                        </Box>
                        <CardMedia
                            component="img"
                            sx={{ width: 160 }}
                            image={song.album.portada}
                            alt={`${song.titulo} album cover`}
                        />
                        </StyledCard>
                    ))}
                </Box>
            </React.Fragment>
        </>
        
    );
}
