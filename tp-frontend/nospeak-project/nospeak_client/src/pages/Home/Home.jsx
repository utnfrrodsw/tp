import React from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import Body from '../../styled-components/Body/Body';
import { SpotifyBody, HomeContainer } from './styles.js';
import Footer from '../../styled-components/Footer/Footer';
import {useSelector} from 'react-redux';

export default function Home({client}) {
    
    const user = useSelector(state => state.user.user);

    const [songs, setSongs] = React.useState([]);

    React.useEffect(() => {
        client.get('/nospeak-app/api/canciones/')
        .then(response => {
            setSongs(response.data);
        })
        .catch(error => {
            console.error('Error al obtener las canciones:', error);
        });
    }, []);

    return (
        <HomeContainer>
            <SpotifyBody>
                <Sidebar/>
                <Body client={client} songs={songs} setSongs={setSongs}/>
            </SpotifyBody>
            <Footer/>
        </HomeContainer>
        );
    
}
