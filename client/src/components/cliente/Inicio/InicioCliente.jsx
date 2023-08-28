import React,{useState} from 'react';
import { Button } from 'react-bootstrap';
import './InicioCliente.css';
import { Link, Outlet } from 'react-router-dom';


function InicioCliente() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='inicio-cliente-container'>
            <div>
                <nav className="navigation">
                    <div className="links">
                        <Link to="requests" className="link">Solicitudes</Link>
                        <Link to="finished" className="link">Terminados</Link>
                    </div>
                </nav>
                <Outlet/>
            </div>

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