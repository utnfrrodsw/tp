import './Principal.css'

export function Principal() {
    return(
        <div>
            <section className='prueba'>
                <video muted autoPlay loop className='top-0 absolute -z-10 prueba2'> {/* use 2 clases de CSS, "prueba" y "prueba2", nose usar Tailwind y queria arreglarlo rapido, despues veo de pasarlas a tailwind */}
                    <source src='./src/assets/vid-bg/vid-bg-header.mp4'/>
                </video>
                {/* Se armo medio un quilombito que tuve que corregir con el tema de la posicion absoluta, Todavia no quedo completamente arreglado pero creo que quedo "decente" y era que el video seguia el scroll vertical y siempre quedaba pegado a la pantalla (por algun motivo), queda perfeccionarlo*/}
                <img src="./src/assets/images/CASINO.png" alt="Casino"/>
                <img src="./src/assets/images/UTIMBAN.png" alt="UtimbaN"/>
            </section>
            <p>hola soy un texto escrito afuera del absolute</p>

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
