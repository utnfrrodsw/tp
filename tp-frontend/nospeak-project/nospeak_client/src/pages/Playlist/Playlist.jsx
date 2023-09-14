import React, { useEffect, useState } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../../pages/Home/styles.js'
import Footer from '../../styled-components/Footer/Footer'
import { PlaylistContainer, CardContainer, TableContainerStyled, CardRightContainer} from './styles';
import { CardLeftContainer, ImagePlaylist } from '../Song/styles';
import {StyledH1, UsuarioContainer} from './styles';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledDeleteIcon } from '../../styled-components/Body/styles';
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import { StyledEditIcon } from '../../styled-components/Body/styles';
import { format } from 'date-fns';
import {
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer,
  } from '../../styled-components/Body/styles';
import { StyledButton, StyledButtonSecondary, Input, Label } from '../../styled-components/styles';
import{
    EditAlertTitle,
    CustomEditAlert,
    EditAlertButtonContainer,
    EditAlertContent,
    EditAlertText, 
} from '../Artist/styles';
import { Navigate } from 'react-router-dom';


const columns = [
    { id: 'option', label: '', minWidth: 10 },
    { id: 'titulo', label: 'Titulo', minWidth: 170 },
    { id: 'artista', label: 'Artista', minWidth: 170 },
    { id: 'duracion', label: 'Duracion', minWidth: 100}
  ];

const columnsAlert = [
    { id: 'option', label: '', minWidth: 10 },
    { id: 'titulo', label: 'Titulo', minWidth: 170 },
    { id: 'artista', label: 'Artista', minWidth: 170 }
  ];


const Playlist = ({client}) => {
    const { playlistId } = useParams();

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);

    const [playlist, setPlaylist] = useState([]);
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const [allSongs, setAllSongs] = useState([]);

    const [showAddSongsAlert, setShowAddSongsAlert] = useState(false);

    const [selectedSongs, setSelectedSongs] = useState([]);

    const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);

    const [deletePlaylistAlertData, setDeletePlaylistAlertData] = React.useState(null);

    const [editedPlaylist, setEditedPlaylist] = useState({
        titulo: '',
        descripcion: '',
        portada: '',
        usuario: '',
    });

    const [goToLibrary, setGoToLibrary] = React.useState(false);

    

    const handleAddSongsClick = () => {
        try{
            client.get('/api/canciones/')
            .then(response => {
                const songsNotInPlaylist = response.data.filter(song => !playlistSongs.some(playlistSong => playlistSong._id === song._id));
                setAllSongs(songsNotInPlaylist);
                setShowAddSongsAlert(true);
            })
        } catch (error){
            console.error('Error al obtener las canciones:', error);
        }
        
    };



    const fetchPlaylistAndSongs = async (playlistId) => {
        try {
          const response = await client.get(`/api/playlists/${playlistId}/`);
          setPlaylist(response.data);    
          setPlaylistSongs(response.data.canciones);
          response.data.usuario = response.data.usuario._id

          response.data.canciones = response.data.canciones.map(song => ({
            ...song,
            artista: song.artista._id,
            album: song.album._id,
        }));

          setEditedPlaylist(response.data)
        } catch (error) {
          console.error('Error fetching playlist info:', error);
        }
      };
    
      useEffect(() => {
        fetchPlaylistAndSongs(playlistId);
      }, [playlistId]);
    

    

    const handleDeleteSong = (songId, index) => {
        const songToDelete = playlistSongs[index];
        setDeleteAlertData({
          songId: songToDelete._id,
          songTitle: songToDelete.titulo,
          indexToRemove: index,
        });
        }

        const handleDeleteConfirm = async () => {
            const updatedSongs = playlistSongs.filter(song => song._id !== deleteAlertData.songId);
            setPlaylistSongs(updatedSongs);
        
            const songsToUpdate = updatedSongs.map(song => ({
                ...song,
                artista: song.artista._id,
                album: song.album._id,
            }));
        
            try {
                await client.patch(`/api/playlists/${playlistId}/`, { canciones: songsToUpdate });
                setDeleteAlertData(null);
            } catch (error) {
                console.error('Error updating playlist:', error);
            }
        };
    const handleDeleteCancel = () => {
        setDeleteAlertData(null);
        setDeletePlaylistAlertData(null);
      };

    const handleDeletePlaylist = () => {
        setDeletePlaylistAlertData(true);
    }

    const handleDeletePlaylistConfirm = async () => {
        try {
            await client.delete(`/api/playlists/${playlistId}/`);
            setDeletePlaylistAlertData(null);
            setGoToLibrary(true);

        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    if (goToLibrary) {
        return <Navigate to="/library" />;
    }

    const handleAddSongToPlaylist = async (songId) => {
        const updatedSongs = [...playlistSongs, allSongs.find(song => song._id === songId)];
        
        setPlaylistSongs(updatedSongs);
        setAllSongs(allSongs.filter(song => song._id !== songId))
      
        const songsToUpdate = updatedSongs.map(song => ({
          ...song,
          artista: song.artista._id,
          album: song.album._id,
        }));
      
        try {
          await client.patch(`/api/playlists/${playlistId}/`, { canciones: songsToUpdate });
          setSelectedSongs([]);

        } catch (error) {
          console.error('Error updating playlist:', error);
        }
      };

      const handleEditButtonClick = () => {
        setIsEditAlertOpen(true);
      };

      const handleCloseAlert = () => {
        setIsEditAlertOpen(false);
      };

      const handleSaveButtonClick = async () => {
        try {
            await client.patch(`/api/playlists/${playlistId}/`, editedPlaylist);
            setPlaylist(editedPlaylist);
            setIsEditAlertOpen(false);
        } catch (error) {
            console.error('Error updating playlist:', error);
        }
    };
      
    
    return (
        <>
            <SpotifyBody>
                <Sidebar/>
                <BodyContainer css={`align-items: center;`}>
                    <PlaylistContainer>
                        <CardContainer>
                            <CardLeftContainer>
                                <ImagePlaylist src={playlist.portada}></ImagePlaylist>
                            </CardLeftContainer>
                            
                            <CardRightContainer style={{paddingBottom: '30px'}}>
                                <p>Playlist</p>
                                <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '3em'}}>{playlist.titulo}</StyledH1>
                                <p>{playlist.descripcion}</p>
                                {playlist.usuario ? (
                                    <UsuarioContainer className="user-date-container">
                                        <p className="user">{playlist.usuario.username}</p>
                                        <p className="date">Created on: {format(new Date(playlist.fecha_creacion), 'MMMM dd, yyyy')}</p>
                                    </UsuarioContainer>
                                ) : (
                                    <p>Loading user information...</p>
                                )}
                            </CardRightContainer>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:'20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StyledEditIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={handleEditButtonClick}/>
                                    <StyledDeleteIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={() => handleDeletePlaylist()} />
                                </div>
                            </div>
                        </CardContainer>
                        <TableContainerStyled>
                            <TableContainer sx={{ maxHeight: 440}}>
                                <Table  sx={{margin: 0}}>
                                    <TableHead >
                                        <TableRow >
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
                                    {playlistSongs
                                        .map((song, rowIndex) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={song.id}>
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
                                                {column.id === 'artista' && columnIndex === 2 ? (
                                                    <span>{song.artista.nombre}</span>
                                                ) : null}
                                                {column.id === 'duracion' && columnIndex === 3 ? (
                                                    <span>{song.duracion}</span>
                                                ) : null}
                                                </TableCell>
                                            ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <ButtonContainer style={{justifyContent: 'end', paddingRight: '40px'}}>
                                <StyledButton style={{width: '20%'}} onClick={handleAddSongsClick}>Añadir canciones</StyledButton>
                            </ButtonContainer>
                        </TableContainerStyled>
                    </PlaylistContainer>
                </BodyContainer>
            </SpotifyBody>
            <Footer/>
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
            {showAddSongsAlert && (
                <Overlay>
                    <AlertContainer style={{backgroundColor: '#242424', width: '30%'}}>
                    <AlertTitle style={{marginBottom: '20px'}}>Añadir canciones</AlertTitle>
                    <TableContainer sx={{ maxHeight: 440, marginBottom: '20px'}}>
                                <Table  sx={{margin: 0}}>
                                    <TableHead >
                                        <TableRow >
                                            {columnsAlert.map((column) => (
                                                <TableCell
                                                key={columnsAlert.id}
                                                align={columnsAlert.align}
                                                style={{ minWidth: columnsAlert.minWidth, backgroundColor: 'transparent', color: '#fff', fontWeight: 'bold' }}
                                                
                                                >
                                                {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {allSongs
                                        .map((song, rowIndex) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={song._id}>
                                            {columnsAlert.map((column, columnIndex) => (
                                                <TableCell
                                                key={column.id}
                                                align={column.align}
                                                sx={{ backgroundColor: 'transparent', color: '#fff' }}
                                                >
                                                {column.id === 'option' && columnIndex === 0 ? (
                                                    <PlaylistAdd
                                                    onClick={() => handleAddSongToPlaylist(song._id)}
                                                    style={{
                                                      cursor: 'pointer',
                                                      color: selectedSongs.includes(song._id) ? 'green' : 'inherit',
                                                    }}
                                                  />
                                                ) : null}
                                                {column.id === 'titulo' && columnIndex === 1 ? (
                                                    <span>{song.titulo}</span>
                                                ) : null}
                                                {column.id === 'artista' && columnIndex === 2 ? (
                                                    <span>{song.artista.nombre}</span>
                                                ) : null}
                                                </TableCell>
                                            ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                    </TableContainer>
                    <ButtonContainer style={{marginTop: '20px'}}>
                        <StyledButtonSecondary style={{marginRight: '5px'}} onClick={() => setShowAddSongsAlert(false)}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{marginLeft: '5px'}} onClick={() => setShowAddSongsAlert(false)}>Guardar</StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
                )}
                {isEditAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Editar playlist</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Titulo</Label>
                                <Input
                                    type="text"
                                    value={editedPlaylist.titulo}
                                    onChange={event => setEditedPlaylist({ ...editedPlaylist, titulo: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Descripcion</Label>
                                <Input
                                    type="text"
                                    value={editedPlaylist.descripcion}
                                    onChange={event => setEditedPlaylist({ ...editedPlaylist, descripcion: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Portada</Label>
                                <Input
                                    type="text"
                                    value={editedPlaylist.portada}
                                    onChange={event => setEditedPlaylist({ ...editedPlaylist, portada: event.target.value })}
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
            {deletePlaylistAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Eliminar playlist</AlertTitle>
                    <AlertText>
                        ¿Estás seguro de que deseas eliminar la playlist "{playlist?.titulo}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeletePlaylistConfirm()}>
                        Eliminar
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>  
        );
}

export default Playlist;