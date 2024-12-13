import './BalanceModal.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from '../../../libs/axios'
import { useState, useEffect } from 'react';

interface BalanceModalProps {
    onClose: () => void;
    idUser: String;
}

export const BalanceModal: React.FC<BalanceModalProps> = ({ onClose, idUser }) => {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);

    useEffect(() => {
        initMercadoPago('APP_USR-03fdd897-d911-496d-8c09-61802b128fa3', {
            locale: "es-AR",
        });
    }, []);
    

    const createPreference = async (price:number) => {
        try {
            const response = await axios.post(`http://localhost:3000/create_preference`, {
                title: "Deposit",
                quantity: 1,
                price: price,
                id_user: idUser
            });

            const { id } = response.data;
            return id;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async (price:number) => {
        const id = await createPreference(price);
        if (id) {
            setPreferenceId(id);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="modal-body">
                    <h2>Deposit Options</h2>
                    <div className="tips">
                        <button onClick={() => handleBuy(5)} className="tip">$5</button>
                        <button onClick={() => handleBuy(1000)} className="tip">$1000</button>
                        <button onClick={() => handleBuy(5000)} className="tip">$5000</button>
                        <button onClick={() => handleBuy(10000)} className="tip">$10.000</button>
                        <button onClick={() => handleBuy(25000)} className="tip">$25.000</button>
                        {preferenceId && <Wallet initialization={{ preferenceId }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};
