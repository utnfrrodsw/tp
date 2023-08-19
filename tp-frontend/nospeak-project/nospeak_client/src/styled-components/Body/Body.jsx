import React from 'react'
import Header from './Header.jsx'
import MediaControlCard from './MediaControlCard.jsx'
import BigCard from './BigCard.jsx'
import { BodyContainer } from './styles.js'

export default function Body({client, songs, setSongs}){

    
    return (
        <BodyContainer>
            <Header/>
            {/* <BigCard songs={songs} /> */}
            <MediaControlCard client={client} songs={songs} setSongs={setSongs} style={{ marginBottom: -150 }} />
        </BodyContainer>
    )

}
