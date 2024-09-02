import './BalanceModal.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { useState, useEffect } from 'react';

interface BalanceModalProps {
    onClose: () => void;
}

export const BalanceModal: React.FC<BalanceModalProps> = ({ onClose }) => {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);

    useEffect(() => {
        initMercadoPago('APP_USR-03fdd897-d911-496d-8c09-61802b128fa3', {
            locale: "es-AR",
        });
    }, []);

    const createPreference = async () => {
        try {
            const response = await axios.post("http://localhost:3000/create_preference", {
                title: "Tip",
                quantity: 1,
                price: 100,
            });

            const { id } = response.data;
            return id;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async () => {
        const id = await createPreference();
        if (id) {
            setPreferenceId(id);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="modal-body">
                    <h2>Opciones de depósito</h2>
                    <div className="tips">
                        <div onClick={handleBuy} className="tip">$1000</div>
                        <div onClick={handleBuy} className="tip">$2000</div>
                        <div onClick={handleBuy} className="tip">$5000</div>
                        <div onClick={handleBuy} className="tip">$10.000</div>
                        <button onClick={handleBuy} className="tip">$25.000</button>
                        {preferenceId && <Wallet initialization={{ preferenceId }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};
