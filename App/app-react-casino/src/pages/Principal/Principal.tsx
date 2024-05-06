import './Principal.css'

export function Principal() {
    return(
        <div>
            <video muted autoPlay loop playsInline className='w-screen cover left-0 right-0 top-0 bottom-0 fixed object-cover -z-10'>
                <source src='./src/assets/vid-bg/vid-bg-header.mp4'/>
            </video>
        </div>
    )
}
