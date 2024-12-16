import axios from '../../../libs/axios.tsx'
import { useEffect, useState } from 'react';
import { useContext } from "react";
import { userContext } from "../../../App.tsx";
import './BettingHistory.css';
import { NavLink as Link } from 'react-router-dom';
import '../Profile.css';
import { useDefaultScroll } from "../../../libs/globalFunctions.tsx";

interface UserType {
    id_user: number;
    username: string;
    bet: number;
    winning: number;
    createdAt: string;
    name: string;
}


export function BettingHistory() {
    const contextData = useContext(userContext);
    const role = contextData.role
    useDefaultScroll()

    const [user, setUser] = useState<UserType[]>([]);

    const token = localStorage.getItem('jwt-token');

    const GetUser = () => {
        axios.get(`/userGames/history/${contextData.id_user}`, {params: {token, role}}).then((response) =>
            setUser(response.data)
        );
    };

    useEffect(() => {
        GetUser();
    }, []);


    
    const profile = '/profile/'+ contextData.username

    return (
        <>
        <div className="bh-list-main">
            <div className='title'>
                <h2 className='title-user font-bold '>Betting History</h2>
                <div className="new-user-main">
                    <Link to={profile} className="change-button backButton">VOLVER</Link>
                </div>
            </div>
            <div className="header-name3">
                <div className="header-column">Total bet</div>
                <div className="header-column">Winning</div>
                <div className="header-column">Game</div>
                <div className="header-column">Date</div>
            </div>
            <ul className="list">
                {user.map((item) => (
                    <li className='items3' key={item.id_user}>
                        <div className="user-info">
                            <div className="column">{item.bet}</div>
                            <div className="column">{item.winning}</div>
                            <div className="column">{item.name}</div>
                            <div className="column">{item.createdAt.slice(0,10) + " " +  item.createdAt.slice(11,19)}</div>
                        </div>
                    </li>
                ))}
            </ul>
            <link rel="stylesheet" href="" />
        </div>
        </>
    );
}