import React, { useState } from 'react';
import { Card, Button, Spinner} from 'react-bootstrap';
import './presupuestosSolicitud.css'
import Rating from '@mui/material/Rating';
import { useAuth } from '../../../auth/authProvider.jsx';
import { fetchPagarPresupuesto } from '../../../services/Presupuesto.js';


function PresupuestoSolicitud(props){

    const [pagarLoading, setPagarLoading] = useState(false);
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const [fecha, setFecha] = useState(undefined);
    const auth = useAuth();

    const handlePagar = async () => {
        setPagarLoading(true);
        try{
            const response = await fetchPagarPresupuesto(props.idSolicitud, props.idPrestador, fecha, auth.getRefreshToken());
            if(response.statusCode === 200){
                setPagoExitoso(true);
            }else{
                setPagoExitoso(false);
            }
        }catch(error){
            setPagoExitoso(false);
        }finally{
            setTimeout(() => {
                setPagarLoading(false);
                props.hendlePresupuestoPagado();
            }, 3000);
        }
    }
    
    return (
        <Card className='card-presu' style={{backgroundColor: '#213555', height: 'auto', margin:'10px'}}>
            <Card.Header>
                <Card.Title style={{color:'white', fontSize:'24px'}}>Presupuesto #{props.idPrestador}</Card.Title>
            </Card.Header>
            <Card.Body style={{display:"flex", flexDirection:"row", width:'100%', justifyContent: 'space-between', padding: '5px'}}>
                <div>
                    <Card.Text className='card-text'>
                        <p>Prestador: {props.nombrePrestador}</p>
                        <Rating name="read-only" value={props.rating} readOnly precision={0.25}/>
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