import React, {useState} from "react";
import Anuncio from '../anuncio/Anuncio';
import './anuncios.css'

function Anuncios(props) {
const text= 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt ipsum numquam consequuntur temporibus nobis adipisci voluptate delectus, velit, saepe, omnis est incidunt ullam iusto facilis totam minima atque dolorem sunt?'
const linkcito= 'https://unavatar.io/kikobeats?ttl=1h'    
const anuncios = [
        { id: 1, titulo: 'Se busca plomero', descripcion: text, nombre: 'Pablo Perez' ,foto: linkcito},
        { titulo: 'Se busca todo', descripcion: text, nombre: 'Claudio Perez' ,foto: linkcito},
        { titulo: 'Se busca electricista', descripcion: text, nombre: 'Enzo Perez' ,foto: linkcito},
        { titulo: 'Se busca gasista', descripcion: text, nombre: 'Javier Perez' ,foto: linkcito},
        // Esto lo saco de la base de datos
    ];
    
    const anunciosPorPagina = 3;
    const [paginaActual, setPaginaActual] = useState(1);
    const totalPaginas = Math.ceil(anuncios.length / anunciosPorPagina);

    const indiceInicio = (paginaActual - 1) * anunciosPorPagina;
    const AnunciosPagina = anuncios.slice(indiceInicio, indiceInicio + anunciosPorPagina);

    const irAtras = () => {
        if (paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
        }
    };

    const irAdelante = () => {
        if (paginaActual < totalPaginas) {
        setPaginaActual(paginaActual + 1);
        }
    };

    return (
        <div className="anuncios-container">
            <div>
                {AnunciosPagina.map((anuncio, index) => (
                <Anuncio 
                    key={index}
                    id={anuncio.id} 
                    titulo={anuncio.titulo}
                    descripcion={anuncio.descripcion}
                    nombre={anuncio.nombre}
                    linkcito={anuncio.linkcito}
                    fecha={anuncio.fecha}
                    ubicacion={anuncio.ubicacion}
                />
                ))}
            </div>
            <div className="pagination">
                <button onClick={irAtras} disabled={paginaActual === 1}>Atrás</button>
                <span>{paginaActual} / {totalPaginas}</span>
                <button onClick={irAdelante} disabled={paginaActual === totalPaginas}>Adelante</button>
            </div>
        </div>   
    )
}

export default Anuncios;