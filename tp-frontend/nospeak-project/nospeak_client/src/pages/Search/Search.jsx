import React from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer} from '../../styled-components/Body/styles';
import { SpotifyBody } from '../Home/styles';
import Footer from '../../styled-components/Footer/Footer';
import Header from '../../styled-components/Body/Header';
import { CategoryContainer, CategoryBox, CategoryName } from './styles.js';


const Search = () => {

    const generos = ['For You', 'New Releases', 'Rankings', 'Live', 'Cumbia', 'Reggaeton', 'Rock', 'Pop', 'Hip Hop', 'Indie', 'Jazz', 'Blues', 'Latina', 'Country', 'Nacional'];
    const colores = [
        '#FFB6C1', // Light Pink
        '#B19CD9', // Light Purple
        '#FFDAB9', // Peach Puff
        '#F0D58A', // Light Yellow
        '#A6D6D6', // Light Blue
        '#FFD699', // Light Orange
        '#C3C3E5', // Light Lavender
        '#F0E68C', // Khaki
        '#98FB98', // Pale Green
        '#87CEEB', // Sky Blue
        '#D8BFD8', // Thistle
        '#98D8D8', // Light Cyan     
    ];

    return (
        <>
            <SpotifyBody>
                <Sidebar/>
                <BodyContainer css={`align-items: center;`}>
                    <Header/>
                    <h1 style={{color: '#fff', marginLeft: '10px'}}>Categories</h1>

                    <CategoryContainer>
                        
                        {generos.map((genero, index) => (
                            <CategoryBox key={genero} style={{ backgroundColor: colores[index % colores.length] }}>
                                <CategoryName>{genero}</CategoryName>
                            </CategoryBox>
                        ))}
                            
                       
                    </CategoryContainer>
                    
                </BodyContainer>
            </SpotifyBody>
            <Footer/>
        </>  )
}

export default Search;