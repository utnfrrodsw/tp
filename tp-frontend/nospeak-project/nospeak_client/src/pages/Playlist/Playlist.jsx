import React from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../../pages/Home/styles.js'
import Footer from '../../styled-components/Footer/Footer'
import { PlaylistContainer, CardContainer, TableContainerStyled,
CardLeftContainer, CardRightContainer, ImagePlaylist, TableSongs} from './styles';
import BigCard from '../../styled-components/Body/BigCard.jsx'
import {StyledH1} from './styles';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'artist', label: 'Artist', minWidth: 170 },
    { id: 'duration', label: 'Duration', minWidth: 100}
  ];
  
  function createData(title, artist, duration) {
    return { title, artist, duration};
  }
  
  const rows = [
    createData('Hablando a tu corazón', 'Charly García', '4:15'),
    createData('Demoliendo Hoteles', 'Charly García', '2:16'),
    createData('Nos siguen pegando abajo', 'Charly García', '3:27'),
  ];

const Playlist = () => {

    const playlistData = {
        title: 'Nombre de la Playlist que quieran prom.',
        description: 'Breve descripción de la Playlist',
        image: 'https://static.posters.cz/image/750/buque-costero/coldplay-parachutes-album-cover-i56853.jpg',
    };

    return (
        <>
            <SpotifyBody>
                <Sidebar/>
                <BodyContainer css={`align-items: center;`}>
                    <PlaylistContainer>
                        <CardContainer>
                            <CardLeftContainer>
                                <ImagePlaylist src={playlistData.image}></ImagePlaylist>
                            </CardLeftContainer>
                            
                            <CardRightContainer>
                                <StyledH1>{playlistData.title}</StyledH1>
                                <p>{playlistData.description}</p>
                            </CardRightContainer>
                        </CardContainer>
                        <TableContainerStyled>
                            <TableContainer sx={{ maxHeight: 440}}>
                                <Table stickyHeader aria-label="sticky table" sx={{margin: 0}}>
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
                                        {rows
                                        .map((row) => {
                                            return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align} sx={{backgroundColor: 'transparent', color: '#fff'}}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                );
                                                })}
                                            </TableRow>
                                        );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TableContainerStyled>
                    </PlaylistContainer>
                </BodyContainer>
            </SpotifyBody>
            <Footer/>
        </>  )
}

export default Playlist;