import React, { useState } from 'react';
import { Card, Button, Spinner} from 'react-bootstrap';
import './presupuestosSolicitud.css'
import { API_URL } from '../../../auth/constants';
import Rating from '@mui/material/Rating';


function PresupuestoSolicitud(props){

    const [pagarLoading, setPagarLoading] = useState(false);
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const [fecha, setFecha] = useState(undefined);

    const handlePagar = async () => {
        setPagarLoading(true);
        console.log('pagar presupuesto para idPrestador ' + props.idPrestador + ' y idSolicitud ' + props.idSolicitud)
        const response = await fetch(`${API_URL}/presupuesto/pagar/${props.idSolicitud}/${props.idPrestador}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                fecha: fecha,
            }),
        })
        .catch((error) => {
            console.error('Error al pagar presupuesto:', error);
        });

        if(response.ok){
            console.log('Presupuesto pagado');
        }else{
            console.log('Error al pagar presupuesto');
        }

        setTimeout(() => {
            setPagarLoading(false);
            setPagoExitoso(true);
            props.hendlePresupuestoPagado();
        }, 3000);
    }
    return (
        <Card className='card-presu' style={{backgroundColor: '#213555', height: '40%', margin:'10px'}}>
            <Card.Header>
                <Card.Title style={{color:'white', fontSize:'24px'}}>Presupuesto #{props.idPrestador}</Card.Title>
            </Card.Header>
            <Card.Body style={{display:"flex", flexDirection:"row", width:'100%', justifyContent: 'space-between', padding: '5px'}}>
                <div>
                    <Card.Text className='card-text'>
                        <p>Prestador: {props.nombrePrestador}</p>
                        <p>Reputacion del prestador: <Rating name="read-only" value={props.rating} readOnly precision={0.25}/></p>
                        <p>Materiales: {props.materiales}</p>
                        <p>Costo Materiales: {props.costoMateriales}</p>
                        <p>Costo por Hora: {props.costoXHora}</p>
                        <p>Costo Total: {props.costoTotal}</p>
                    </Card.Text>
                </div>
                <div className='fecha-boton-content'>
                    <div>
                        <Card.Subtitle style={{color: 'white'}}>Fechas Disponibles</Card.Subtitle>
                        <select value={fecha} onChange={(e) => setFecha(e.target.value)}>
                            <option value={undefined}>Seleccione una fecha</option>
                            {props.fechasDisponibles.map((fecha, index) =>(
                                //const dateTime = new Date(fecha)
                                <option key={index} value={fecha}> {new Date(fecha).toLocaleString()}</option>)
                            )}
                        </select>
                    </div>
                    {pagoExitoso ? (
                        <Button> Pago aceptado </Button>
                    ) : (
                        <div>
                            {pagarLoading ? (
                            <Button variant="primary" disabled>
                                <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                />
                                Pagando...
                            </Button>) 
                            :(
                                <Button onClick={handlePagar}>Aceptar Presupuesto</Button>
                            )}
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    )

}

export default PresupuestoSolicitud;