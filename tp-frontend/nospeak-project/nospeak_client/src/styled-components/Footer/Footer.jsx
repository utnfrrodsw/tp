import React from 'react'
import { FooterContainer,FooterLeft,FooterRight,FooterCenter } from './styles.js'
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import IconButton from '@mui/material/IconButton';
import { Grid,Slider } from '@mui/material';

const Footer = () => {

    const [volume, setVolume] = React.useState(100);

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
    };

    const muteVolume = () => {
        setVolume(0);
    };

    let volumeIcon;
    if (volume === 0) {
        volumeIcon = (
        <IconButton color="inherit" centerRipple onClick={muteVolume}>
            <VolumeOffIcon />
        </IconButton>
        );
    } else if (volume <= 50) {
        volumeIcon = (
        <IconButton color="inherit" centerRipple onClick={muteVolume}>
            <VolumeDownIcon />
        </IconButton>
        );
    } else {
        volumeIcon = (
        <IconButton color="inherit" centerRipple onClick={muteVolume}>
            <VolumeUpIcon />
        </IconButton>
        );
    }


    return (
        <FooterContainer>
            <FooterLeft>
                <img src="https://static.posters.cz/image/750/buque-costero/coldplay-parachutes-album-cover-i56853.jpg" alt="Album cover" />
                <div>
                    <h4 style={{ margin: '0 0 4px' }}>Trouble</h4>
                    <p style={{ margin: 0 }}>Coldplay</p>
                </div>
            </FooterLeft>
            <FooterCenter>
                <IconButton color="inherit" centerRipple>
                    <ShuffleIcon />
                </IconButton>
                <IconButton color="inherit" centerRipple>
                    <SkipPreviousIcon />
                </IconButton>
                <IconButton color="inherit" centerRipple>
                    <PlayCircleOutlineIcon style={{ fontSize: 32 }} />
                </IconButton>
                <IconButton color="inherit" centerRipple>
                    <SkipNextIcon />
                </IconButton>
                <IconButton color="inherit" centerRipple>
                    <RepeatIcon />
                </IconButton>
            </FooterCenter>
            <FooterRight>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <PlaylistPlayIcon/>
                    </Grid>
                    <Grid item>
                        {volumeIcon}
                    </Grid>
                    <Grid item style={{ flexGrow: 1 }}>
                        <Slider value={volume} onChange={handleVolumeChange} aria-label="Volume"/>
                    </Grid>
                </Grid>
            </FooterRight>
        </FooterContainer>
    )
    }

export default Footer