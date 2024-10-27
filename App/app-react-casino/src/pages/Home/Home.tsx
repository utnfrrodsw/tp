import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './Home.css'

export function Home() {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return(
        <div>
            <section className='video-container'>
                <video muted autoPlay loop disablePictureInPicture className='video'>
                    <source src='./src/assets/vid-bg/vid-bg-header.mp4'/>
                </video>
                <div className='casino-image'>
                    <img src="./src/assets/images/casinofull.png" alt='Casino UTimbaN' />
                </div>
            </section>
            <section className='games-section'>
                <h1 className='games-title'>Games</h1>
                <div className='games-container'>
                    <Link to="/dice" className='animated-hover game dice-img' ></Link>
                    <Link to="/slot" className='animated-hover game slots-img'> </Link>
                    <Link to="/wheel" className='animated-hover game wheel-img'> </Link>
                    <Link to="" className='cooming-soon'> </Link>
                </div>
            </section>
        </div>
    
    )
}
