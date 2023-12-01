import React from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../../pages/Home/styles.js'
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

    const [title, setTitle] = React.useState(null);
    const [year, setYear] = React.useState(null);
    const [genre, setGenre] = React.useState(null);
    const [duration, setDuration] = React.useState(null);
    const [audio, setAudio] = React.useState(null);
    const [spotify_id, setSpotifyId] = React.useState(null);
    const [artist, setArtist] = React.useState(null);
    const [album, setAlbum] = React.useState(null);

    const [goToHome, setGoToHome] = React.useState(false);

    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);

    React.useEffect(() => {
        if (songId !== '0') {
            client.get(`/api/canciones/${songId}/`)
              .then(response => {
                setSong(response.data);
      
                setTitle(response.data.titulo);
                setYear(response.data.anio_lanzamiento);
                setGenre(response.data.genero);
                setDuration(response.data.duracion);
                setAudio(response.data.audio);
                setSpotifyId(response.data.spotify_id);
                setArtist(response.data.artista._id);
                setAlbum(response.data.album._id);
              })
              .catch(error => {
                console.error('Error al obtener la canción:', error);
              });
        }

        client.get('/api/artistas/')
        .then(response => {
            setArtists(response.data);
        })
        .catch(error => {
            console.error('Error al obtener la lista de artistas:', error);
        });

        client.get('/api/albums/')
        .then(response => {
            setAlbums(response.data);
        })
        .catch(error => {
            console.error('Error al obtener la lista de álbumes:', error);
        });

        

    }, [songId]);



    const handleSave = () => {
        const newSong = {
          title,
          anio_lanzamiento: year,
          genre,
          duration,
          audio,
          spotify_id,
          artist,
          album,
        };
    
        if (songId === '0') {

          client.post('/api/canciones/', newSong)
            .then(response => {
              setShowSuccessAlert(true);
            })
            .catch(error => {
              console.error('Error al crear la nueva canción:', error);
            });
        } else {
          client.patch(`/api/canciones/${songId}/`, newSong)
            .then(response => {
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
    

    const handleArtistChange = (value) => {
        setArtist(value);
    };
    
    const handleAlbumChange = (value) => {
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
                                        <Input type="text" value={title} onChange={(e) => {setTitle(e.target.value)}}/>

                                        <Label>Año lanzamiento</Label>
                                        <Input type="text" value={year} onChange={(e) => setYear(e.target.value)}/>

                                        <Label>Género</Label>
                                        <Input type="text" value={genre} onChange={(e) => setGenre(e.target.value)}/>
                                        
                                        <Label>Duración</Label>
                                        <Input type="text" value={duration} onChange={(e) => setDuration(e.target.value)}/>
    
                                    </ColumnForm>
                                    <ColumnForm>
                                        <Label>Audio</Label>
                                        <Input type="text" value={audio} onChange={(e) => setAudio(e.target.value)}/>
                                        
                                        <Label>Spotify id</Label>
                                        <Input type="text" value={spotify_id} onChange={(e) => setSpotifyId(e.target.value)}/>
                                        
                                        <Label>Artista</Label>
                                        <ComboBox value={artist} onChange={(e) => handleArtistChange(e.target.value)}>
                                            <option value="">Seleccionar artista...</option>
                                            {artists.map(artist => (
                                                <option key={artist._id} value={artist._id}>
                                                    {artist.nombre}
                                                </option>
                                            ))}
                                        </ComboBox>
                                        
                                        <Label>Álbum</Label>
                                        <ComboBox value={album} onChange={(e) => handleAlbumChange(e.target.value)}>
                                            <option value="">Seleccionar álbum...</option>
                                            {albums.map(album => (
                                                <option key={album._id} value={album._id}>
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
                            ? `La canción ${title} se ha creado correctamente.`
                            : `La canción ${title} se ha actualizado correctamente.`}
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
