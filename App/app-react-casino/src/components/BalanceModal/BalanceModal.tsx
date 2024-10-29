import './BalanceModal.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { useState, useEffect } from 'react';

interface BalanceModalProps {
    onClose: () => void;
    onMoney: React.Dispatch<React.SetStateAction<number>>;
    idUser: String;
    balance: number;
}

export const BalanceModal: React.FC<BalanceModalProps> = ({ onClose, onMoney, idUser, balance }) => {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);

    useEffect(() => {
        initMercadoPago('APP_USR-03fdd897-d911-496d-8c09-61802b128fa3', {
            locale: "es-AR",
        });
    }, []);

    const [mensajeCarga, setMensajeCarga] = useState("")

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
        onMoney(balance + 1000);
        patchUser(balance + 1000);
        setMensajeCarga("Se cargaron 1000 pesos con exito!")
    }

    function addMoney2000() {
        onMoney(balance + 2000);
        patchUser(balance + 2000);
        setMensajeCarga("Se cargaron 2000 pesos con exito!")
    }

    function addMoney5000() {
        onMoney(balance + 5000);
        patchUser(balance + 5000);
        setMensajeCarga("Se cargaron 5000 pesos con exito!")
    }

    function addMoney10000() {
        onMoney(balance + 10000);
        patchUser(balance + 10000);
        setMensajeCarga("Se cargaron 10000 pesos con exito!")
    }

    function addMoney25000() {
        onMoney(balance + 25000);
        patchUser(balance + 25000);
        setMensajeCarga("Se cargaron 25000 pesos con exito!")
    }

    function patchUser(newMoney:number) {
        axios.put(`http://localhost:3000/api/v1/users/${idUser}`, {
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
