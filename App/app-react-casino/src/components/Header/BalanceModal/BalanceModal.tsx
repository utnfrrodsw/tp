import './BalanceModal.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { useState, useEffect } from 'react';

interface BalanceModalProps {
    onClose: () => void;
    setMoney: React.Dispatch<React.SetStateAction<number>>;
    idUser: String;
    balance: number;
    role: string;
}

export const BalanceModal: React.FC<BalanceModalProps> = ({ onClose, setMoney, idUser, balance, role }) => {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);

    const token = localStorage.getItem('jwt-token');

    useEffect(() => {
        initMercadoPago('APP_USR-03fdd897-d911-496d-8c09-61802b128fa3', {
            locale: "es-AR",
        });
    }, []);

    const [mensajeCarga, setMensajeCarga] = useState("")
    
    /* Mercado pago
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
    /*
    const handleBuy = async () => {
        const id = await createPreference();
        if (id) {
            setPreferenceId(id);
        }
    };
    */

    function addMoney1000() {
        setMoney(balance + 1000);
        patchUser(balance + 1000);
        setMensajeCarga("1000 coins recharge!")
    }

    function addMoney2000() {
        setMoney(balance + 2000);
        patchUser(balance + 2000);
        setMensajeCarga("2000 coins recharge!")
    }

    function addMoney5000() {
        setMoney(balance + 5000);
        patchUser(balance + 5000);
        setMensajeCarga("5000 coins recharge!")
    }

    function addMoney10000() {
        setMoney(balance + 10000);
        patchUser(balance + 10000);
        setMensajeCarga("10000 coins recharge!")
    }

    function addMoney25000() {
        setMoney(balance + 25000);
        patchUser(balance + 25000);
        setMensajeCarga("25000 coins recharge!")
    }

    function patchUser(newMoney:number) {
        axios.put(`http://localhost:3000/api/v1/users/${idUser}`, {
            token,
            role,
            balance: `${newMoney}`,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="modal-body">
                    <h2>Deposit Options</h2>
                    <div className="tips">
                        <button onClick={addMoney1000} className="tip">$1000</button>
                        <button onClick={addMoney2000} className="tip">$2000</button>
                        <button onClick={addMoney5000} className="tip">$5000</button>
                        <button onClick={addMoney10000} className="tip">$10.000</button>
                        <button onClick={addMoney25000} className="tip">$25.000</button>
                        {preferenceId && <Wallet initialization={{ preferenceId }} />}
                        <p className='tipAdvertise'>{mensajeCarga}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
