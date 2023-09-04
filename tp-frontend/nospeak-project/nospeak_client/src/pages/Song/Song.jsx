import React from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../../pages/Home/styles.js'
import Footer from '../../styled-components/Footer/Footer'
import { 
    PlaylistContainer, 
    CardContainer, 
    TableContainerStyled,
    CardLeftContainer,
    CardRightContainer, 
    ImagePlaylist, 
    StyledH1,
    FormContainer, 
    ColumnForm, 
    ComboBox, 
    ColumnContainer
} from './styles';
import { 
    Label, 
    Input, 
    ButtonContainer, 
    StyledButton, 
    StyledButtonSecondary 
} from '../../styled-components/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import {
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer as AlertButtonContainer,
} from '../../styled-components/Body/styles';



export default function Song({client}) {

    
    const { songId } = useParams();
    const [song, setSong] = React.useState(null);
    const [artists, setArtists] = React.useState([]);
    const [albums, setAlbums] = React.useState([]);

    const [titulo, setTitulo] = React.useState(null);
    const [anioLanzamiento, setAnioLanzamiento] = React.useState(null);
    const [genero, setGenero] = React.useState(null);
    const [duracion, setDuracion] = React.useState(null);
    const [audio, setAudio] = React.useState(null);
    const [spotify_id, setSpotifyId] = React.useState(null);
    const [artista, setArtista] = React.useState(null);
    const [album, setAlbum] = React.useState(null);

    const [goToHome, setGoToHome] = React.useState(false);

    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);

    

    console.log(songId);


    React.useEffect(() => {
        if (songId !== '0') {
            client.get(`/nospeak-app/api/canciones-info/${songId}/`)
              .then(response => {
                setSong(response.data);
      
                setTitulo(response.data.titulo);
                setAnioLanzamiento(response.data.anio_lanzamiento);
                setGenero(response.data.genero);
                setDuracion(response.data.duracion);
                setAudio(response.data.audio);
                setSpotifyId(response.data.spotify_id);
                setArtista(response.data.artista.id);
                setAlbum(response.data.album.id);
              })
              .catch(error => {
                console.error('Error al obtener la canción:', error);
              });
        }

        client.get('/nospeak-app/api/artistas/')
        .then(response => {
            setArtists(response.data);
        })
        .catch(error => {
            console.error('Error al obtener la lista de artistas:', error);
        });

        client.get('/nospeak-app/api/albums/')
        .then(response => {
            setAlbums(response.data);
        })
        .catch(error => {
            console.error('Error al obtener la lista de álbumes:', error);
        });

        

    }, [songId]);
    console.log(song)


    const handleSave = () => {
        const newSong = {
          titulo,
          anio_lanzamiento: anioLanzamiento,
          genero,
          duracion,
          audio,
          spotify_id,
          artista,
          album,
        };
    
        if (songId === '0') {
          // Realiza la llamada POST a la API para crear una nueva canción
          client.post('/nospeak-app/api/canciones/', newSong)
            .then(response => {
              console.log('Nueva canción creada:', response.data);
              setShowSuccessAlert(true);
            })
            .catch(error => {
              console.error('Error al crear la nueva canción:', error);
            });
        } else {
          // Realiza la llamada PUT a la API para actualizar la canción existente
          client.put(`/nospeak-app/api/canciones/${songId}/`, newSong)
            .then(response => {
              console.log('Canción actualizada:', response.data);
              setShowSuccessAlert(true);
            })
            .catch(error => {
              console.error('Error al actualizar la canción:', error);
            });
        }
      };

    if (goToHome) {
        return <Navigate to="/home" />;
    }
    
    const handleCancel = () => {
        setGoToHome(true);
    };
    

    const handleArtistaChange = (value) => {
        console.log('Valor combo:', value);
        setArtista(value);
    };
    
    const handleAlbumChange = (value) => {
        console.log('Valor combo:', value);
        setAlbum(value);
    };

    const handleAlertAccept = () => {
        setGoToHome(true);
    };
    

    return (
        <>
            <SpotifyBody>
                <Sidebar/>
                <BodyContainer css={`align-items: center;`}>
                    <PlaylistContainer>
                        <CardContainer song={song}>
                            {song && (
                                <>
                                    <CardLeftContainer>
                                        <ImagePlaylist src={song.album.portada}></ImagePlaylist>
                                    </CardLeftContainer>
                                    <CardRightContainer>
                                        <StyledH1>{song.titulo}</StyledH1>
                                        <p>{song.artista.nombre}</p>
                                    </CardRightContainer>
                                </>
                            )}
                            {!song && (
                                <>
                                    <StyledH1 style={{color: 'white', marginLeft: '30px', fontSize: '3em'}}>Crear canción</StyledH1>
                                    
                                </>
                            )}
                        </CardContainer>
                        <TableContainerStyled song={song}>
                            <FormContainer>
                                <ColumnContainer>
                                    <ColumnForm>
                                        <Label>Título</Label>
                                        <Input type="text" value={titulo} onChange={(e) => {setTitulo(e.target.value)}}/>

                                        <Label>Año lanzamiento</Label>
                                        <Input type="text" value={anioLanzamiento} onChange={(e) => setAnioLanzamiento(e.target.value)}/>

                                        <Label>Género</Label>
                                        <Input type="text" value={genero} onChange={(e) => setGenero(e.target.value)}/>
                                        
                                        <Label>Duración</Label>
                                        <Input type="text" value={duracion} onChange={(e) => setDuracion(e.target.value)}/>
    
                                    </ColumnForm>
                                    <ColumnForm>
                                        <Label>Audio</Label>
                                        <Input type="text" value={audio} onChange={(e) => setAudio(e.target.value)}/>
                                        
                                        <Label>Spotify id</Label>
                                        <Input type="text" value={spotify_id} onChange={(e) => setSpotifyId(e.target.value)}/>
                                        
                                        <Label>Artista</Label>
                                        <ComboBox value={artista} onChange={(e) => handleArtistaChange(e.target.value)}>
                                            <option value="">Seleccionar artista...</option>
                                            {artists.map(artist => (
                                                <option key={artist.id} value={artist.id}>
                                                    {artist.nombre}
                                                </option>
                                            ))}
                                        </ComboBox>
                                        
                                        <Label>Álbum</Label>
                                        <ComboBox value={album} onChange={(e) => handleAlbumChange(e.target.value)}>
                                            <option value="">Seleccionar álbum...</option>
                                            {albums.map(album => (
                                                <option key={album.id} value={album.id}>
                                                    {album.titulo}
                                                </option>
                                            ))}
                                        </ComboBox>
                                    </ColumnForm>
                                </ColumnContainer>
                                <ButtonContainer>
                                    <StyledButtonSecondary onClick={handleCancel}>Cancelar</StyledButtonSecondary>
                                    <StyledButton onClick={handleSave}>Guardar</StyledButton>
                                </ButtonContainer>
                            </FormContainer>
                        </TableContainerStyled>
                    </PlaylistContainer>
                </BodyContainer>
            </SpotifyBody>
            {/* <Footer/> */}
            {showSuccessAlert && (
                <Overlay>
                    <AlertContainer>
                        <AlertTitle>
                        {songId === '0' ? 'Nueva canción creada' : 'Actualizar canción'}
                        </AlertTitle>
                        <AlertText>
                        {songId === '0'
                            ? `La canción ${titulo} se ha creado correctamente.`
                            : `La canción ${titulo} se ha actualizado correctamente.`}
                        </AlertText>
                        <AlertButtonContainer>
                        <StyledButton
                            css={`width: 50%`}
                            onClick={handleAlertAccept}
                        >
                            Aceptar
                        </StyledButton>
                        </AlertButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>  )
}
