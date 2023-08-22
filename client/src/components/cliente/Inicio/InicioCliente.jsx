import React,{useState} from 'react';
import { Button } from 'react-bootstrap';
import './InicioCliente.css';
import Header from '../../header/Header.jsx';
import { Link, Outlet } from 'react-router-dom';


function InicioCliente() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='inicio-cliente-container'>
            <Header />
            <div>
            <nav className="navigation">
                <div className="links">
                    <Link to="/client/home/requests/:id" className="link">Solicitudes</Link>
                    <Link to="/client/home/finished/:id" className="link">Terminados</Link>
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