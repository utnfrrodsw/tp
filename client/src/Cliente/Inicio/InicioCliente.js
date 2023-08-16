import React,{useState} from 'react';
import { Button } from 'react-bootstrap';
import './InicioCliente.css';


function InicioCliente() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='inicio-cliente-container'>
            <h1>Inicio Cliente</h1>
            <Button className="floating-button" onMouseEnter={toggleMenu} onMouseLeave={toggleMenu}>+</Button>
            {isMenuOpen && (
                <div className="menu">
                    <div className="menu-option">Nueva Solicitud</div>
                </div>
            )}
        </div>
    );
}

export default InicioCliente;