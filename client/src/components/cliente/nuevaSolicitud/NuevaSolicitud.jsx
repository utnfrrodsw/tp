import React, {useState}  from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from 'react-bootstrap';
import '../Inicio/InicioCliente.css';



export function NuevaSolicitud(){

    const especialidades = [
        {value: '1', label: 'Carpintería'},
        {value: '2', label: 'Electricidad'},
        {value: '3', label: 'Plomería'},
        {value: '4', label: 'Pintura'},
        {value: '5', label: 'Albañilería'},
        {value: '6', label: 'Otros'},
    ];

    const handleChange = (event) => {
        setEspecialidad(event.target.value);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [open, setOpen] = React.useState(false);

    const [esp, setEspecialidad] = useState('0');


    const handleClose = () => {
        
        setOpen(false)
    };
    
    const handleOpen = () =>{
        setFormData({
            titulo: '',
            desc: '',
            ubicacion: '',
            fotos: '',
        }); // Limpia los datos del formulario
        setEspecialidad('0'); // Limpia el select
        setOpen(true)
    };

    //formdata

    const [formData, setFormData] = useState({
        titulo: '',
        desc: '',
        especialidad: '',
        ubicacion: '',
        fotos: '',
    });

    const handleInputChange = (event) => {
        const { name, value, type, files } = event.target;

        // Maneja campos de entrada de texto y select
        if (type === 'text' || type === 'select-one'){
            setFormData({
            ...formData,
            [name]: value,
            });
        }
      // Maneja campos de archivos (input[type="file"])
        else if (type === 'file') {
        setFormData({
            ...formData,
            [name]: files, // Almacena los archivos seleccionados
        });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Aquí puedes acceder a los datos del formulario en formData
        console.log(formData);
        
        // Realiza cualquier acción adicional, como enviar los datos al servidor
        // ...
    };
    
    return (
        <div>
            <Button className="floating-button" onMouseEnter={toggleMenu} onMouseLeave={toggleMenu} onClick={handleOpen}>+</Button>    
            {isMenuOpen && (
                <div className="menu">
                    <div className="menu-option">Nueva Solicitud</div>
                </div>
            )}

            <Modal
                className='Backdrop'
                aria-labelledby="transition-modal-title" 
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 700,
                },
                }}>
                <Fade in={open}>
                <Box className='modal'>
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                    Nueva Solicitud
                    </Typography>
                    <form action="/upload" method="post" enctype="multipart/form-data" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Titulo</label>
                            <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <input type="text" id="desc" name="desc" value={formData.desc} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label >Especialidad</label>
                            <Select
                            className='select-especialidad'
                            id="select-especialidad"
                            name='select-especialidad'
                            value={esp}
                            onChange={handleChange}
                            label="Age">
                                <MenuItem value='0'>
                                    <em>Elija una opcion</em>
                                </MenuItem>
                                {especialidades.map((especialidad) => {
                                    return <MenuItem value={especialidad.value}> {especialidad.label} </MenuItem>
                                })}
                            </Select>
                        </div>
                        <div className="form-group" >
                            <label>Ubicación</label>
                            <input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>fotos</label>
                            <input type="file" id="fotos" name="fotos" value={formData.fotos} onChange={handleInputChange} multiple/>
                        </div>
                        <div>
                            <Button type="submit" className='buttonModal' onClick={handleClose}>Cancelar</Button>
                            <Button type="reset" className='buttonModal' onClick={handleClose}>Solicitar</Button> { /* Falta la funcionalidad */}
                        </div>
                    </form>
                </Box>
                </Fade>
            </Modal>
        </div>
    );
};