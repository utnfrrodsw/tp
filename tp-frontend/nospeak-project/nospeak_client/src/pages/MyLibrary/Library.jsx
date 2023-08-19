import React, { useState } from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer} from '../../styled-components/Body/styles';
import { SpotifyBody } from '../Home/styles';
import Footer from '../../styled-components/Footer/Footer';
import Header from '../../styled-components/Body/Header';
import { NavContainer, NavItem, PlaylistBox, PlaylistDescription, PlaylistGrid, PlaylistImage, PlaylistName } from './styles';
import { useHistory } from "react-router"; // Import useHistory from 'react-router'



const Library = () => {

    const playlistData = [
        {
            title: 'Previa',
            author: 'PolaDJ',
            image: 'https://i.scdn.co/image/ab67706c0000da84e4c3b621c226f0a097097aeb',
        }, 
        {
            title: 'Cumbia',
            author: 'PolaDJ',
            image: 'https://i.scdn.co/image/ab67706c0000da84e4c3b621c226f0a097097aeb',
        },
        {
            title: 'HipHop',
            author: 'Flecha Vivas',
            image: 'https://i.scdn.co/image/ab67706c0000d72c8b058b2ebbed37e23ca56fd3',
        },
        {
            title: 'To the lobby blowjob',
            author: 'Luquitas Mancini',
            image: 'https://i.scdn.co/image/ab67706c0000d72c8b058b2ebbed37e23ca56fd3',
        },
    ];

    const categories = ['Playlists', 'Made for You', 'Liked Songs', 'Artists', 'Podcats'];

    const [activeCategory, setActiveCategory] = useState(categories[0]); // Initialize with the first category

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <>
            <SpotifyBody>
                <Sidebar/>
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
                    </NavContainer>
                    <PlaylistGrid>
                        {activeCategory === 'Playlists' && (
                            playlistData.map((playlist, index) => (
                            <PlaylistBox key={index}>
                                <PlaylistImage src={playlist.image}></PlaylistImage>
                                <PlaylistName>{playlist.title}</PlaylistName>
                                <PlaylistDescription>{playlist.author}</PlaylistDescription>
                            </PlaylistBox>
                        ))
                        )}
                        {activeCategory === 'Made for You' && (
                            <h1> Made for You </h1>
                        )}
                        {activeCategory === 'Liked Songs' && (
                            <h1> Liked Songs </h1>
                        )}
                        {activeCategory === 'Artists' && (
                            <h1> Artists </h1>
                        )}
                        {activeCategory === 'Podcats' && (
                            <h1> Podcasts </h1>
                        )}
                        
                    </PlaylistGrid>

                </BodyContainer>
            </SpotifyBody>
            <Footer/>
        </>
    )
}

export default Library