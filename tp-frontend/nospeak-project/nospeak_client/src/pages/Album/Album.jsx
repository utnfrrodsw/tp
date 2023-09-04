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

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
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
    CardLeftContainer, 
    EditAlertTitle,
    CustomEditAlert,
    EditAlertButtonContainer,
    EditAlertContent,
    EditAlertText, 
} from '../Artist/styles';
import { Navigate } from 'react-router-dom';
import {ImagePlaylist} from '../Song/styles'


const columns = [
    { id: 'option', label: '', minWidth: 10 },
    { id: 'titulo', label: 'Titulo', minWidth: 170 },
    { id: 'duracion', label: 'Duracion', minWidth: 100}
  ];


const AlbumPage = ({client}) => {

    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const { albumId } = useParams();

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);

    const [deleteAlbumAlertData, setDeleteAlbumAlertData] = React.useState(null);

    const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);

    const [editedAlbum, setEditedAlbum] = useState({
        titulo: '',
        portada: ''
    });

    const [goToLibrary, setGoToLibrary] = React.useState(false);


    useEffect(() => {

        client.get(`/nospeak-app/api/albums/${albumId}/`)
          .then(response => {
            setAlbum(response.data)
            setEditedAlbum(response.data)
          })
          .catch(error => console.error('Error fetching album:', error));
        

        client.get(`/nospeak-app/api/canciones-album/${albumId}/`)
          .then(response => setSongs(response.data))
          .catch(error => console.error('Error fetching album songs:', error));
      }, [albumId]);

      const handleDeleteSong = (songId, index) => {
        const songToDelete = songs[index];
        setDeleteAlertData({
          songId: songToDelete.id,
          songTitle: songToDelete.titulo,
          indexToRemove: index,
        });
        }

    const handleDeleteConfirm = async () => {
        const updatedSongs = songs.filter(song => song.id !== deleteAlertData.songId);
        setSongs(updatedSongs);

        try {
            await client.delete(`/nospeak-app/api/canciones/${deleteAlertData.songId}/`);
            setDeleteAlertData(null);
        } catch (error) {
            console.error('Error updating songs of album:', error);
        }
    };
    const handleDeleteCancel = () => {
        // Cierra la alerta
        setDeleteAlertData(null);
        setDeleteAlbumAlertData(null);
      };

    const handleDeleteAlbum = () => {
        setDeleteAlbumAlertData(true);
    }

    const handleDeleteAlbumConfirm = async () => {
        try {
            await client.delete(`/nospeak-app/api/albums/${albumId}/`);
            setDeleteAlertData(null);
            setGoToLibrary(true);

        } catch (error) {
            console.error('Error deleting album:', error);
        }
    };

    if (goToLibrary) {
        return <Navigate to="/library" />;
    }
    
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
            await client.patch(`/nospeak-app/api/albums/${albumId}/`, editedAlbum);
            setAlbum(editedAlbum);
            setIsEditAlertOpen(false);
        } catch (error) {
            console.error('Error updating album:', error);
        }
    };

    return (
        <>
            <SpotifyBody>
                <Sidebar />
                <BodyContainer css={`align-items: center;`}>
                    <PlaylistContainer>
                    {album ? (
                        <CardContainer>
                            <CardLeftContainer>
                                <ImagePlaylist src={album.portada}></ImagePlaylist>
                            </CardLeftContainer>

                            <CardRightContainer style={{ paddingBottom: '30px' }}>
                                <p style={{ marginBottom: '0', marginTop: '20px' }}>Album</p>
                                <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '3em' }}>{album.titulo}</StyledH1>
                            </CardRightContainer>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:'20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StyledEditIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={handleEditButtonClick} />
                                    <StyledDeleteIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={() => handleDeleteAlbum()}/>
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
                                                        {column.id === 'option' && columnIndex === 0 ? (
                                                            <StyledDeleteIcon fontSize="small" cursor="pointer" onClick={() => handleDeleteSong(song.id, rowIndex)}/>
                                                        ) : null}
                                                        {column.id === 'titulo' && columnIndex === 1 ? (
                                                            <span>{song.titulo}</span>
                                                        ) : null}
                                                        {column.id === 'duracion' && columnIndex === 2 ? (
                                                            <span>{formatDuration(song.duracion)}</span>
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
                            <EditAlertTitle>Editar album</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Titulo</Label>
                                <Input
                                    type="text"
                                    value={editedAlbum.titulo}
                                    onChange={event => setEditedAlbum({ ...editedAlbum, titulo: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Portada</Label>
                                <Input
                                    type="text"
                                    value={editedAlbum.portada}
                                    onChange={event => setEditedAlbum({ ...editedAlbum, portada: event.target.value })}
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
            {deleteAlbumAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Eliminar album</AlertTitle>
                    <AlertText>
                        ¿Estás seguro de que deseas eliminar el album "{album?.titulo}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteAlbumConfirm()}>
                        Eliminar
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>
    )
}

export default AlbumPage;

