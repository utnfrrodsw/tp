import './Principal.css'

export function Principal() {
    return(
        <div>
            <section className='prueba'>
                <video muted autoPlay loop disablePictureInPicture className='top-0 absolute -z-10 prueba2'> {/* use 2 clases de CSS, "prueba" y "prueba2", nose usar Tailwind y queria arreglarlo rapido, despues veo de pasarlas a tailwind */}
                    <source src='./src/assets/vid-bg/vid-bg-header.mp4'/>
                </video>
                {/* Se armo medio un quilombito que tuve que corregir con el tema de la posicion absoluta, Todavia no quedo completamente arreglado pero creo que quedo "decente" y era que el video seguia el scroll vertical y siempre quedaba pegado a la pantalla (por algun motivo), queda perfeccionarlo*/}
                <div className='imagenes'> {/* Se puede mejorar, despues veo como lo hago. */}
                    <img src="./src/assets/images/casino.gif" alt="Casino"/>
                    <img src="./src/assets/images/utimban.gif" alt="UtimbaN"/>
                </div>
            </section>
            <section className='px-20'>
                {/*QUIZAS ES MEJOR PONER LOS ESTILOS EN UN CSS ??? que decis mauri*/}
                <h1 className='pb-10 text-5xl text-[#70ae6e]'>Games</h1>
                <div className='grid grid-cols-4 gap-10 pb-20 rounded-xl'>
                    <div className='bg-red-500 border-2 text-white rounded-[40px]'></div>
                    <div className='col-span-2 bg-red-500 border-2 text-white rounded-[40px]'></div>
                    <div className='bg-red-500 p-20 border-2 text-white rounded-[40px]'></div>
                    <div className='col-span-2 bg-red-500 border-2 text-white rounded-[40px]'></div>
                    <div className='bg-red-500 p-20 border-2 text-white rounded-[40px]'></div>
                    <div className='bg-red-500 p-24 border-2 text-white rounded-[40px]'></div>
                    <div className='bg-red-500 border-2 text-white rounded-[40px]'></div>
                    <div className='bg-red-500 border-2 text-white rounded-[40px]'></div>
                    <div className='col-span-2 bg-red-500 p-24 border-2 text-white rounded-[40px]'></div>
                </div>
                
            </section>
            PRUEBA DE SCROLL VERTICAL 

            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, quis illum suscipit molestias architecto inventore exercitationem rerum, nulla, perferendis modi cumque iusto voluptas excepturi distinctio? Laborum quaerat placeat consectetur ducimus!</p>
        </div>
    
    )
}
