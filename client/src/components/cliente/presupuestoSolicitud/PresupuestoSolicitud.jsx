import React from 'react';
import { Card, Button} from 'react-bootstrap';
import './presupuestosSolicitud.css'


function PresupuestoSolicitud(props) {

    const presupuesto = {
        id: 123123,
        horasTotales: 2,
        prestador: {
            nombre: "Juan Perez",
        },
        costoMateriales: 1000,
        costoXHora: 500,
        fechasDisponibles: [
            "2021-10-10T10:00:00",
            "2021-10-10T11:00:00",
            "2021-10-10T12:00:00",
            "2021-10-10T13:00:00",
            "2021-10-10T14:00:00",
            "2021-10-10T15:00:00",
            "2021-10-10T16:00:00",
            "2021-10-10T17:00:00",
            "2021-10-10T18:00:00",
            "2021-10-10T19:00:00",
            "2021-10-10T20:00:00",
            "2021-10-10T21:00:00",
            "2021-10-10T22:00:00",
            "2021-10-10T23:00:00",
            "2021-10-10T24:00:00",
        ]
    }

    return (
        <Card className='card-presupuesto'>
            <Card.Header>
                <Card.Title style={{color:'white', fontSize:'24px'}}>Presupuesto {presupuesto.id}</Card.Title>
            </Card.Header>
            <Card.Body style={{display:"flex", flexDirection:"row", width:'100%'}}>
                
                <div>
                    <Card.Text className='card-text'>
                        <p>Prestador: {presupuesto.prestador.nombre}</p>
                        <p>Costo Materiales: {presupuesto.costoMateriales}</p>
                        <p>Costo por Hora: {presupuesto.costoXHora}</p>
                        <p>Costo Total: {(presupuesto.costoXHora*presupuesto.horasTotales) + presupuesto.costoMateriales}</p>
                        <Card.Subtitle>Fechas Disponibles</Card.Subtitle>
                        <select>
                            {presupuesto.fechasDisponibles.map((fecha) =>(
                                //const dateTime = new Date(fecha)
                                <option>{fecha}</option>)
                            )}
                        </select>
                    </Card.Text>
                </div>
                <Button variant="primary" style={{alignSelf:"flex-end"}}>Aceptar Presupuesto</Button>
            </Card.Body>
        </Card>
    )

}

export default PresupuestoSolicitud;