import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { gradientStyle } from './styles';

export default function BigCard({songs}) {

    const song = songs[0];

    return (
        <React.Fragment>
        <Card sx={{ ...gradientStyle, display: 'flex', marginBottom: 10, width:900,height:200, marginLeft:2 }}>
            <CardMedia
            component="img"
            sx={{ width: 200, height: 200}}
            image={song.album.portada}
            alt={song.titulo}
            />
            <CardContent sx={{ flex: '1 0 auto'}}>
            <Typography component="div" variant="h4" gutterBottom color={'white'}>
                {song.titulo}
            </Typography>
            <Typography variant="body1" color={'white'} component="div">
                {song.anio_lanzamiento}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2}}>
                <IconButton aria-label="play" >
                <PlayArrowIcon style={{height: 38, width: 38, color:'white'}} />
                </IconButton>
            </Box>
            </CardContent>
        </Card>
        </React.Fragment>
    );
    }
