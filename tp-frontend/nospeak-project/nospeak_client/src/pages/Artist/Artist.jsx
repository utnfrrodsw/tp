import React from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../../pages/Home/styles.js';
import Footer from '../../styled-components/Footer/Footer';
import {
    PlaylistContainer,
    CardContainer,
    TableContainerStyled,
    StyledH1
} from '../Song/styles';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {useSelector} from 'react-redux';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledDeleteIcon, StyledEditIcon } from '../../styled-components/Body/styles';
import {
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer,
  } from '../../styled-components/Body/styles';
import { 
    StyledButton, 
    StyledButtonSecondary,
    Input,
    Label
} from '../../styled-components/styles';
import { 
    CardRightContainer, 
    ImagePlaylist, 
    CardLeftContainer, 
    EditAlertTitle,
    CustomEditAlert,
    EditAlertButtonContainer,
    EditAlertContent,
    EditAlertText, 
} from './styles';
import { Navigate } from 'react-router-dom';


const columns = [
    { id: 'option', label: '', minWidth: 10 },
    { id: 'titulo', label: 'Titulo', minWidth: 170 },
    { id: 'duracion', label: 'Duracion', minWidth: 100},
    { id: 'album', label: 'Album', minWidth: 170 }
  ];


const ArtistPage = ({client}) => {

    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const { artistId } = useParams();

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);

    const [deleteArtistAlertData, setDeleteArtistAlertData] = React.useState(null);

    const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);

    const [editedArtist, setEditedArtist] = useState({
        nombre: '',
        nacionalidad: '',
        nro_seguidores: '',
        portada: '',
    });

    const [goToLibrary, setGoToLibrary] = React.useState(false);

    const user = useSelector(state => state.user.user);


    useEffect(() => {

        client.get(`/api/artistas/${artistId}/`)
          .then(response => {
            setArtist(response.data)
            setEditedArtist(response.data)
          })
          .catch(error => console.error('Error fetching artist:', error));
        
        client.get(`/api/canciones-artista/${artistId}/`)
          .then(response => setSongs(response.data))
          .catch(error => console.error('Error fetching artist songs:', error));
      }, [artistId]);

      const handleDeleteSong = (songId, index) => {
        const songToDelete = songs[index];
        setDeleteAlertData({
          songId: songToDelete._id,
          songTitle: songToDelete.titulo,
          indexToRemove: index,
        });
        }

    const handleDeleteConfirm = async () => {
        const updatedSongs = songs.filter(song => song._id !== deleteAlertData.songId);
        setSongs(updatedSongs);

        try {
            await client.delete(`/api/canciones/${deleteAlertData.songId}/`);
            setDeleteAlertData(null);
        } catch (error) {
            console.error('Error updating songs of artist:', error);
        }
    };
    const handleDeleteCancel = () => {
        setDeleteAlertData(null);
        setDeleteArtistAlertData(null);
      };

    const handleDeleteArtist = () => {
        setDeleteArtistAlertData(true);
    }

    const handleDeleteArtistConfirm = async () => {
        try {
            await client.delete(`/api/artistas/${artistId}/`);
            setDeleteAlertData(null);
            setGoToLibrary(true);

        } catch (error) {
            console.error('Error deleting artist:', error);
        }
    };

    if (goToLibrary) {
        return <Navigate to="/library" />;
    }
    
    const formatFollowers = (followers) => {
        return followers.toLocaleString();
    };


    const formatDuration = (durationInSeconds) => {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleEditButtonClick = () => {
        setIsEditAlertOpen(true);
      };

      const handleCloseAlert = () => {
        setIsEditAlertOpen(false);
      };

      const handleSaveButtonClick = async () => {
        try {
            await client.patch(`/api/artistas/${artistId}/`, editedArtist);
            setArtist(editedArtist);
            setIsEditAlertOpen(false);
        } catch (error) {
            console.error('Error updating artist:', error);
        }
    };

    return (
        <>
            <SpotifyBody>
                <Sidebar />
                <BodyContainer css={`align-items: center;`}>
                    <PlaylistContainer>
                    {artist ? (
                        <CardContainer>
                            <CardLeftContainer>
                                <ImagePlaylist src={artist.portada}></ImagePlaylist>
                            </CardLeftContainer>

                            <CardRightContainer style={{ paddingBottom: '30px' }}>
                                <p style={{ marginBottom: '0', marginTop: '20px' }}>Artista</p>
                                <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '3em' }}>{artist.nombre}</StyledH1>
                                <p style={{ margin: '0' }}>{artist.nacionalidad}</p>
                                <p style={{ margin: '0' }}>{formatFollowers(artist.nro_seguidores)} oyentes.</p>
                            </CardRightContainer>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:'20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {user.isAdmin && (
                                    <>
                                        <StyledEditIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={handleEditButtonClick} />
                                        <StyledDeleteIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={() => handleDeleteArtist()}/>
                                    </>)}
                                    </div>
                            </div>
                        </CardContainer>

                        ) : (
                            <p>Loading user information...</p>
                        )}
                        <TableContainerStyled>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table  sx={{ margin: 0 }}>
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                  key={column.id}
                                                  align={column.align}
                                                  style={{ minWidth: column.minWidth, backgroundColor: 'transparent', color: '#fff', fontWeight: 'bold' }}
                                                >
                                                  {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {songs.map((song, rowIndex) => ( 
                                            <TableRow hover role="checkbox" tabIndex={-1} key={song.code}>
                                                {columns.map((column, columnIndex) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        sx={{ backgroundColor: 'transparent', color: '#fff' }}
                                                    >
                                                        {column.id === 'option' && columnIndex === 0 && user.isAdmin ? (
                                                            <StyledDeleteIcon fontSize="small" cursor="pointer" onClick={() => handleDeleteSong(song.id, rowIndex)}/>
                                                        ) : null}
                                                        {column.id === 'titulo' && columnIndex === 1 ? (
                                                            <span>{song.titulo}</span>
                                                        ) : null}
                                                        {column.id === 'duracion' && columnIndex === 2 ? (
                                                            <span>{formatDuration(song.duracion)}</span>
                                                        ) : null}
                                                        {column.id === 'album' && columnIndex === 3 ? (
                                                            <span>{song.album.titulo}</span>
                                                        ) : null}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TableContainerStyled>
                    </PlaylistContainer>
                </BodyContainer>
            </SpotifyBody>
          <Footer />
          {deleteAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Eliminar canción</AlertTitle>
                    <AlertText>
                        ¿Estás seguro de que deseas eliminar la canción "{deleteAlertData?.songTitle}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteConfirm()}>
                        Eliminar
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
            {isEditAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Editar artista</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Nombre</Label>
                                <Input
                                    type="text"
                                    value={editedArtist.nombre}
                                    onChange={event => setEditedArtist({ ...editedArtist, nombre: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Nacionalidad</Label>
                                <Input
                                    type="text"
                                    value={editedArtist.nacionalidad}
                                    onChange={event => setEditedArtist({ ...editedArtist, nacionalidad: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Número de seguidores</Label>
                                <Input
                                    type="text"
                                    value={editedArtist.nro_seguidores}
                                    onChange={event => setEditedArtist({ ...editedArtist, nro_seguidores: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Portada</Label>
                                <Input
                                    type="text"
                                    value={editedArtist.portada}
                                    onChange={event => setEditedArtist({ ...editedArtist, portada: event.target.value })}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton onClick={handleSaveButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>
                // </Overlay>
                
            )}
            {deleteArtistAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Eliminar artista</AlertTitle>
                    <AlertText>
                        ¿Estás seguro de que deseas eliminar el artista "{artist?.nombre}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteArtistConfirm()}>
                        Eliminar
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>
    )
}

export default ArtistPage;

