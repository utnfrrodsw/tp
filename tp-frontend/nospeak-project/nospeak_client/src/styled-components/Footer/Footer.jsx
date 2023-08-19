import React from 'react'
import { FooterContainer,FooterLeft,FooterRight,FooterCenter } from './styles.js'
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { Grid,Slider } from '@mui/material';

const Footer = () => {
    return (
        <FooterContainer>
            <FooterLeft>
                <img src="https://static.posters.cz/image/750/buque-costero/coldplay-parachutes-album-cover-i56853.jpg" alt="Album cover" />
                <div>
                    <h4>Trouble</h4>
                    <p>Coldplay</p>
                </div>
            </FooterLeft>
            <FooterCenter>
                <ShuffleIcon/>
                <SkipPreviousIcon/>
                <PlayCircleOutlineIcon/>
                <SkipNextIcon/>
                <RepeatIcon/>

            </FooterCenter>
            <FooterRight>
                <Grid container spacing={2}>
                    <Grid item>
                        <PlaylistPlayIcon/>
                    </Grid>
                    <Grid item>
                        <VolumeDownIcon/>
                    </Grid>
                    <Grid item xs>
                        <Slider aria-label="Volume" />
                    </Grid>
                </Grid>
            </FooterRight>
        </FooterContainer>
    )
    }

export default Footer