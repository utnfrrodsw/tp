import React from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import Body from '../../styled-components/Body/Body';
import { SpotifyBody, HomeContainer } from './styles.js';
import {useSelector} from 'react-redux';


export default function Home({client}) {
    
    const user = useSelector(state => state.user.user);

    return (
        <HomeContainer>
            <SpotifyBody>
                <Sidebar client={client}/>
                <Body client={client}/>
            </SpotifyBody>
        </HomeContainer>
        );
    
}
