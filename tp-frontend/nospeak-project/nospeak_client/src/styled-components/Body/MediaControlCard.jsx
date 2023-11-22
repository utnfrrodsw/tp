import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { 
    cardStyle, 
    TitleContainer, 
    IconContainer,
    StyledAddCircle, 
    StyledEditIcon, 
    StyledDeleteIcon,
    StyledCard,

} from './styles';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';




export default function MediaControlCard({client, songs, setSongs, setDeleteAlertData}) {
    const user = useSelector((state) => state.user.user);
    const [userHistorial, setUserHistorial] = useState(null);


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


    const isSongInHistorial = (songId) => {
        if (userHistorial && userHistorial.canciones) {
            return userHistorial.canciones.some((cancion) => cancion._id === songId);
        }
        return false;
    };

    const handleFavoriteClick = async (songId) => {
        const isSongInHistorial = userHistorial && userHistorial.canciones.some((cancion) => cancion._id === songId);
    
        if (isSongInHistorial) {
            const updatedCanciones = userHistorial.canciones.filter((cancion) => cancion._id !== songId);
            userHistorial.canciones = updatedCanciones;
        } else {
            if (!userHistorial.canciones) {
                userHistorial.canciones = {};
            }
            const songToAdd = songs.find((cancion) => cancion._id === songId);
            userHistorial.canciones.push(songToAdd);
        }
    
        try {

            await client.patch(`/api/historiales/${userHistorial._id}/`, userHistorial);
            setUserHistorial({ ...userHistorial });
        } catch (error) {
            console.error('Error al actualizar el historial:', error);
        }
    };
    
    return (
        <>
            <TitleContainer>
                <h1 style={{color: 'white'}}>Songs</h1>
                <IconContainer>
                    {user.isAdmin && (
                    <Link to={{ pathname: `/song/${0}` }}>
                        <StyledAddCircle sx={{ color: '#FFA130'}} />
                    </Link>)}
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
                                    {user.isAdmin && (
                                    <IconButton aria-label="delete" onClick={() => handleDelete(song._id, index)}>
                                        <StyledDeleteIcon sx={{ color: 'white' }} />
                                    </IconButton>)}
                                    <IconButton
                                        aria-label="play/pause"
                                        onClick={() => handleFavoriteClick(song._id)}
                                    >
                                        <FavoriteIcon
                                            sx={{
                                                height: 35,
                                                width: 35,
                                                color: isSongInHistorial(song._id) ? '#FFA130' : 'white',
                                            }}
                                        />
                                    </IconButton>
                                    {user.isAdmin && (
                                    <IconButton aria-label="edit">
                                        <Link to={{ pathname: `/song/${song._id}` }}>
                                            <StyledEditIcon sx={{ color: 'white' }} />
                                        </Link>
                                    </IconButton>
                                    )}
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
