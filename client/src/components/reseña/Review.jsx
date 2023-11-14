import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { API_URL } from '../../auth/constants';

const Review = (props) => {
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);  

    const handleCalificar = async () => {
        setLoading(true);
        const response = await fetch(`${API_URL}/servicio/setreview/${props.idSolicitud}/${props.idPrestador}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resenia: rating
            }
        )});
        if(response.ok){
            setTimeout(() => {
                setLoading(false);
                props.hendleCalificarUpdate();
            }, 3000);
        }else{
            setError(true);
            setLoading(false);
            setTimeout(() => {
                setError(false);
            }, 10000);
        }

    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    return (
        <div>
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    style={{
                    cursor: 'pointer',
                    color: star <= rating ? 'gold' : 'gray',
                    fontSize: '24px',
                    }}
                >
                    ★
                </span>
                ))}
            </div>
            <p>Tu calificación: {rating} estrella(s)</p>
            <p>{error ? 'Error al calificar' : ''}</p>
            { loading ? (
                <Button variant="primary" disabled>
                    <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                    Calificando...
                </Button>) 
                :(
                    <Button onClick={handleCalificar}>Calificar</Button>
                )}
        </div>
    );
};

export default Review;
