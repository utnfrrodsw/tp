import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './Home.css'

export function Home() {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return(
        <div>
            <section className='flex flex-col items-center justify-center gap-16 h-screen w-full'>
                <video muted autoPlay loop disablePictureInPicture className='top-0 absolute -z-10 w-full h-screen object-cover'>
                    <source src='./src/assets/vid-bg/vid-bg-header.mp4'/>
                </video>
                <div className='flex mx-8 my-20 flex-col gap-12'>
                    <img src="./src/assets/images/casinofull.png" alt='Casino UTimbaN' />
                </div>
            </section>
            <section className='px-20 max-sm:px-3'>
                <h1 className='py-10 text-5xl font-semibold'>Games</h1>
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-8 gap-y-4 pb-20 rounded-xl max-sm:gap-2 text-center'>
                    <Link to="/dice" className='animated-hover max-md:col-span-2 md:col-span-2 lg:col-span-1 h-[175px] border-2 border-[#e19400] rounded-[20px] bg-[url("./src/assets/images/games-dice.png")] bg-center bg-cover bg-contain lg:hover:scale-110 transition ease-in-out hover:scale-[1.05]' ></Link>
                    <Link to="/slot" className='animated-hover lg:col-span-2 bg-white border-2 border-[#e19400] h-[175px] text-white rounded-[20px] bg-[url("./src/assets/images/games-slots.png")] bg-center bg-cover bg-contain lg:hover:scale-110 transition ease-in-out hover:scale-[1.05]'> </Link>
                    <Link to="/wheel" className='animated-hover lg:col-span-1 w-full border-2 border-[#e19400] rounded-[20px] h-[175px] bg-[url("./src/assets/images/games-wheel.png")] bg-center lg:hover:scale-110 transition ease-in-out bg-cover hover:scale-[1.05]'> </Link>
                    <Link to="" className='max-md:col-span-2 md:col-span-2 lg:col-span-2 bg-[#808080] border-2 border-[#e19400] h-[175px rounded-[20px] bg-[url("./src/assets/images/games-roulette.png")] bg-center bg-cover text-[#D81536] text-7xl font-bold flex justify-center items-center'></Link>

                    <Link to="" className='md:col-span-2 lg:col-span-1 h-[175px] border-1 rounded-[20px]'> </Link>
                    <Link to="" className='md:col-span-2 lg:col-span-1 h-[175px] border-1 rounded-[20px]'> </Link>
                    {/*<Link to={""} className='max-md:col-span-2 bg-red-500 p-20 border-2 text-white rounded-[40px]'>7</Link>
                    <Link to={""} className='bg-red-500 p-20 border-2 text-white rounded-[40px]'>8</Link>
                    <Link to={""} className='md:col-span-1 lg:col-span-2 p-20 bg-red-500 p-20 border-2 text-white rounded-[40px]'>9</Link>
                    */}
                </div>
            </section>
        </div>
    
    )
}
