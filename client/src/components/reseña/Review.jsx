import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { fetchHacerReseña } from '../../services/Solicitud.js';
import { useAuth } from '../../auth/authProvider';

const Review = (props) => {
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);  
    const auth = useAuth();

    const handleCalificar = async () => {
        setLoading(true);
        try{
            const response = await fetchHacerReseña(props.idSolicitud, props.idPrestador, rating, auth.getRefreshToken());
            if (response.statusCode === 200) {
                props.hendleCalificarUpdate();
            } else {
                setError(true);
            }
        }catch(error){
            setError(true);
        }finally{
            setLoading(false);
            if(error){
                setTimeout(() => {
                    setError(false);
                }, 10000);
            }
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
            <p style={{color: 'red'}}>{error ? 'Error al calificar' : ''}</p>
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
