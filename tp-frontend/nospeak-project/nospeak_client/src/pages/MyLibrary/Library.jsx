import React, { useState, useEffect } from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer} from '../../styled-components/Body/styles';
import { SpotifyBody } from '../Home/styles';
import Footer from '../../styled-components/Footer/Footer';
import Header from '../../styled-components/Body/Header';
import { NavContainer, NavItem, PlaylistBox, PlaylistDescription, PlaylistGrid, PlaylistImage, PlaylistName } from './styles';
import { ArtistBox, ArtistImage, ArtistName, ArtistGrid,
ComboBoxContainer, ComboBoxOption, ComboBoxOptions } from './styles';
import { Navigate, useLocation } from 'react-router-dom';
import { StyledAddCircle, IconContainer } from '../../styled-components/Body/styles';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { 
    EditAlertTitle,
    CustomEditAlert,
    EditAlertButtonContainer,
    EditAlertContent,
    EditAlertText, 
} from '../Artist/styles';
import { 
    StyledButton, 
    StyledButtonSecondary,
    Input,
    Label
} from '../../styled-components/styles';

const Library = ({client}) => {

    const categories = ['Playlists', 'Artists', 'Albums', 'Made for You'];

    const location = useLocation();

    const [goToPlaylist, setGoToPlaylist] = React.useState(false);
    const [activeCategory, setActiveCategory] = useState(categories[0]); 
    const [goToArtist, setGoToArtist] = React.useState(false);

    const [playlistData, setPlaylistData] = useState([]);
    const [artists, setArtists] = useState([]);

    const [albumData, setAlbumData] = useState([]);

    const [isComboBoxOpen, setIsComboBoxOpen] = useState(false);

    const [isCreateArtistAlertOpen, setIsCreateArtistAlertOpen] = useState(false);

    const [isCreateAlbumAlertOpen, setIsCreateAlbumAlertOpen] = useState(false);

    const [isCreatePlaylistAlertOpen, setIsCreatePlaylistAlertOpen] = useState(false);

    const [newArtista, setNewArtista] = useState({
        nombre: '',
        nacionalidad: '',
        nro_seguidores: '',
    });

    const [newAlbum, setNewAlbum] = useState({
        titulo: '',
        portada: '',
    });

    const user = useSelector(state => state.user.user);

    const [newPlaylist, setNewPlaylist] = useState({
        canciones: [],
        titulo: '',
        descripcion: '',
        portada: '',
        usuario: user.id
    });

    useEffect(() => {
        // Llamada a la API para obtener las playlists del usuario
        client.get(`/nospeak-app/api/playlists-usuario-info/${user.id}`)
            .then(response => {
                setPlaylistData(response.data);
            })
            .catch(error => {
                console.error('Error fetching playlists:', error);
            });
    
        // Llamada a la API para obtener los albums
        client.get('/nospeak-app/api/albums/')
            .then(response => {
                setAlbumData(response.data);
            })
            .catch(error => {
                console.error('Error fetching albums:', error);
            });
    
        // Fetch artists
        client.get('/nospeak-app/api/artistas/')
            .then(response => {
                setArtists(response.data);
            })
            .catch(error => {
                console.error('Error fetching artists:', error);
            });
    }, []);
    

      if (goToArtist && location.pathname !== "/artist") {
        return <Navigate to="/artist" />;
    }

    if (goToPlaylist && location.pathname !== "/playlist") {
        return <Navigate to="/playlist" />;
    }

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };



    const handleComboBoxButtonClick = () => {
        setIsComboBoxOpen(!isComboBoxOpen);
    };

    const handleOptionClick = (option) => {
        if(option === 'playlist'){
            setIsCreatePlaylistAlertOpen(true)

        }
        if(option === 'artista'){
            setIsCreateArtistAlertOpen(true)
        }
        if(option === 'album'){
            setIsCreateAlbumAlertOpen(true)

        }
        console.log('Selected option:', option);
        setIsComboBoxOpen(false);
    };

    const handleCloseAlert = () => {
        setIsCreateArtistAlertOpen(false);
        setIsCreateAlbumAlertOpen(false);
        setIsCreatePlaylistAlertOpen(false)
      };

      const handleSaveArtistaButtonClick = async () => {
        try {
            await client.post(`/nospeak-app/api/artistas/`, newArtista);
            setNewArtista({
                nombre: '',
                nacionalidad: '',
                nro_seguidores: '',
            });
            setIsCreateArtistAlertOpen(false);
        } catch (error) {
            console.error('Error creating artist:', error);
        }
    };

    const handleSaveAlbumButtonClick = async () => {
        try {
            await client.post(`/nospeak-app/api/albums/`, newAlbum);
            setNewAlbum({
                titulo: '',
                portada: ''
            });
            setIsCreateAlbumAlertOpen(false);
        } catch (error) {
            console.error('Error creating album:', error);
        }
    };

    const handleSavePlaylistButtonClick = async () => {
        try {
            await client.post(`/nospeak-app/api/playlists/`, newPlaylist);
            setNewPlaylist({
                canciones: [],
                titulo: '',
                descripcion: '',
                portada: '',
                usuario: user.id
            });
            setIsCreatePlaylistAlertOpen(false);
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    return (
        <>
            <SpotifyBody>
                <Sidebar client={client}/>
                <BodyContainer css={`align-items: center;`}>
                    <Header/>
                    <h1 style={{color: '#fff', marginLeft: '10px'}}>Library</h1>

                    <NavContainer>
                        {categories.map(category => (
                            <NavItem
                                key={category}
                                onClick={() => handleCategoryChange(category)} // Change category on click
                                active={category === activeCategory}
                            >
                            {category}
                            </NavItem>
                        ))}
                        <IconContainer>
                            <StyledAddCircle sx={{ color: '#FFA130'}} onClick={handleComboBoxButtonClick}/>
                            {isComboBoxOpen && (
                                <ComboBoxContainer>
                                    <ComboBoxOptions>
                                    <ComboBoxOption onClick={() => handleOptionClick('playlist')}>
                                    Crear playlist
                                    </ComboBoxOption>
                                    <ComboBoxOption onClick={() => handleOptionClick('artista')}>
                                    Crear artista
                                    </ComboBoxOption>
                                    <ComboBoxOption onClick={() => handleOptionClick('album')}>
                                    Crear album
                                    </ComboBoxOption>
                                </ComboBoxOptions>
                                </ComboBoxContainer>
                                )}
                        </IconContainer>
                    </NavContainer>
                    <PlaylistGrid>
                        {activeCategory === 'Playlists' && (
                            playlistData.map((playlist, index) => (
                            <Link key={index} to={`/playlist/${playlist.id}`}>
                                <PlaylistBox key={index}>
                                    <PlaylistImage src={playlist.portada}></PlaylistImage>
                                    <PlaylistName>{playlist.titulo}</PlaylistName>
                                    <PlaylistDescription>{playlist.usuario.username}</PlaylistDescription>
                                </PlaylistBox>
                            </Link>
                        ))
                        )}
                        {/* {activeCategory === 'Made for You' && (
                            madeForYou.map((playlist, index) => (
                                <PlaylistBox key={index}>
                                    <PlaylistImage src={playlist.image}></PlaylistImage>
                                    <PlaylistName>{playlist.title}</PlaylistName>
                                    <PlaylistDescription>{playlist.author}</PlaylistDescription>
                                </PlaylistBox>
                            )
                        ))} */}
                        {activeCategory === 'Artists' && (
                            artists.map((artist, index) => (
                                <Link key={index} to={`/artist/${artist.id}`}>
                                    <ArtistBox key={index}>
                                        <ArtistImage src={artist.portada} alt={artist.nombre} onClick={() => {setGoToArtist(true);}} />
                                        <ArtistName>{artist.nombre}</ArtistName>
                                    </ArtistBox>
                                </Link>
                            ))
                        )}
                        {activeCategory === 'Podcasts' && (
                            <h1> Podcasts </h1>
                        )}
                        {activeCategory === 'Albums' && (
                            albumData.map((album, index) => (
                                <Link key={index} to={`/album/${album.id}`}>
                                    <PlaylistBox key={index}>
                                        <PlaylistImage src={album.portada}></PlaylistImage>
                                        <PlaylistName>{album.titulo}</PlaylistName>
                                        {/* Puedes agregar más detalles aquí si lo deseas */}
                                    </PlaylistBox>
                                </Link>
                            ))
                        )}
                        
                    </PlaylistGrid>

                </BodyContainer>
            </SpotifyBody>
            <Footer/>
            {isCreateArtistAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Crear artista</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Nombre</Label>
                                <Input
                                    type="text"
                                    value={newArtista.nombre}
                                    onChange={event => setNewArtista({ ...newArtista, nombre: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Nacionalidad</Label>
                                <Input
                                    type="text"
                                    value={newArtista.nacionalidad}
                                    onChange={event => setNewArtista({ ...newArtista, nacionalidad: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Número de seguidores</Label>
                                <Input
                                    type="text"
                                    value={newArtista.nro_seguidores}
                                    onChange={event => setNewArtista({ ...newArtista, nro_seguidores: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Portada</Label>
                                <Input
                                    type="text"
                                    value={newArtista.portada}
                                    onChange={event => setNewArtista({ ...newArtista, portada: event.target.value })}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton onClick={handleSaveArtistaButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>

            )}
            {isCreateAlbumAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Crear album</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Título</Label>
                                <Input
                                    type="text"
                                    value={newAlbum.titulo}
                                    onChange={event => setNewAlbum({ ...newAlbum, titulo: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Portada</Label>
                                <Input
                                    type="text"
                                    value={newAlbum.portada}
                                    onChange={event => setNewAlbum({ ...newAlbum, portada: event.target.value })}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton onClick={handleSaveAlbumButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>
            )}
            {isCreatePlaylistAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Crear Playlist</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Título</Label>
                                <Input
                                    type="text"
                                    value={newPlaylist.titulo}
                                    onChange={event => setNewPlaylist({ ...newPlaylist, titulo: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Descripción</Label>
                                <Input
                                    type="text"
                                    value={newPlaylist.descripcion}
                                    onChange={event => setNewPlaylist({ ...newPlaylist, descripcion: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Portada</Label>
                                <Input
                                    type="text"
                                    value={newPlaylist.portada}
                                    onChange={event => setNewPlaylist({ ...newPlaylist, portada: event.target.value })}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton onClick={handleSavePlaylistButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>
            )}
        </>
    )
}

export default Library