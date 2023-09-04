import React, { useState } from 'react';
import Header from './Header.jsx';
import MediaControlCard from './MediaControlCard.jsx';
import BigCard from './BigCard.jsx';
import { BodyContainer } from './styles.js';
import {
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer,
  } from './styles';
import { StyledButton, StyledButtonSecondary } from '../styles.js';
import { useSelector } from 'react-redux';
import axios from '../../interceptors/axiosConfig.js';

export default function Body({ client }) {
    const [filteredSongs, setFilteredSongs] = useState([]);

    const [songs, setSongs] = React.useState([]);

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);

    const user = useSelector(state => state.user.user);
    const [userPlaylists, setUserPlaylists] = useState([]);

    const handleDeleteConfirm = async (alertData) => {
        try {
        
            

          // Realiza la llamada DELETE a la API para eliminar la canción
          await client.delete(`/nospeak-app/api/canciones/${alertData.songId}/`);
    
          // Actualiza el arreglo de canciones local eliminando la canción correspondiente
          const updatedSongs = [...songs];
          updatedSongs.splice(alertData.indexToRemove, 1);
          setSongs(updatedSongs);
    
          // Cierra la alerta
          setDeleteAlertData(null);
        } catch (error) {
          console.error('Error al eliminar la canción:', error);
        }
      };
    
      const handleDeleteCancel = () => {
        // Cierra la alerta
        setDeleteAlertData(null);
      };

    React.useEffect(() => {

        axios.get('/api/canciones/')
        .then(response => {
            setSongs(response.data);
            setFilteredSongs(response.data);
        })
        .catch(error => {
            console.error('Error al obtener las canciones:', error);
        });

        if (user) {
            client.get(`/api/playlists-usuario/${user.id}`)
                .then(response => setUserPlaylists(response.data))
                .catch(error => console.error('Error fetching user playlists:', error));
        }
    }, [user]);

    return (
        <>
            <BodyContainer>
                <Header songs={songs} setFilteredSongs={setFilteredSongs} />
                <MediaControlCard
                    client={client}
                    songs={filteredSongs} // Usa las canciones filtradas
                    setSongs={setSongs}
                    style={{ marginBottom: -150 }}
                    setDeleteAlertData={setDeleteAlertData}
                    userPlaylists={userPlaylists}
                />
            </BodyContainer>
            {deleteAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Eliminar canción</AlertTitle>
                    <AlertText>
                        ¿Estás seguro de que deseas eliminar la canción "{deleteAlertData?.songTitle}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteConfirm(deleteAlertData)}>
                        Eliminar
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>
        
    );
}
