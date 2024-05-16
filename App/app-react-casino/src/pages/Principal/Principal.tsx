import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './Principal.css'

export function Principal() {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])


    return(
        <div>
            <section className='prueba'>
                <video muted autoPlay loop disablePictureInPicture className='top-0 absolute -z-10 prueba2'> {/* use 2 clases de CSS, "prueba" y "prueba2", nose usar Tailwind y queria arreglarlo rapido, despues veo de pasarlas a tailwind */}
                    <source src='./src/assets/vid-bg/vid-bg-header.mp4'/>
                </video>
                {/* Se armo medio un quilombito que tuve que corregir con el tema de la posicion absoluta, Todavia no quedo completamente arreglado pero creo que quedo "decente" y era que el video seguia el scroll vertical y siempre quedaba pegado a la pantalla (por algun motivo), queda perfeccionarlo*/}
                <div className='imagenes'> {/* Se puede mejorar, despues veo como lo hago. */}
                    <img src="./src/assets/images/casino.gif" alt="Casino"/>
                    <img src="./src/assets/images/utimban.png" alt="UtimbaN"/>
                </div>
            </section>
            <section className='px-20 max-sm:px-3'>
                <h1 className='py-10 text-5xl text-[#70ae6e]'>Games</h1>
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10 pb-20 rounded-xl max-sm:gap-2 text-center'>
                    <Link to="/dice" className='max-md:col-span-2 md:col-span-2 lg:col-span-1 bg-red-500 p-20 border-2 text-white rounded-[40px] bg-[url("./src/assets/images/dice.webp")] bg-center lg:hover:scale-110 transition ease-in-out bg-cover hover:scale-[1.05]'></Link>
                    <Link to="/tragamonedas" className='lg:col-span-2 p-20 bg-red-500 border-2 text-white rounded-[40px] bg-[url("./src/assets/images/slots.webp")] bg-center lg:hover:scale-110 transition ease-in-ou bg-cover hover:scale-[1.05]'></Link>
                    <Link to={""} className='lg:col-span-1 bg-red-500 p-20 border-2 text-white rounded-[40px]'>3</Link>
                    <Link to={""} className='max-md:col-span-2 md:col-span-2 lg:col-span-2 p-20 bg-red-500 border-2 text-white rounded-[40px]'>4</Link>
                    <Link to={""} className='md:col-span-2 lg:col-span-1 bg-red-500 p-20 border-2 text-white rounded-[40px]'>5</Link>
                    <Link to={""} className='bg-red-500 p-20 border-2 text-white rounded-[40px]'>6</Link>
                    <Link to={""} className='max-md:col-span-2 bg-red-500 p-20 border-2 text-white rounded-[40px]'>7</Link>
                    <Link to={""} className='bg-red-500 p-20 border-2 text-white rounded-[40px]'>8</Link>
                    <Link to={""} className='md:col-span-1 lg:col-span-2 p-20 bg-red-500 p-20 border-2 text-white rounded-[40px]'>9</Link>
                </div>
            </section>
        </div>
    
    )
}
