import axios from 'axios';
import { useEffect, useState } from 'react';
import './BettingHistory.css';

interface UserType {
    id_user: number;
    username: string;
    bet: number;
    winning: number;
    game: string;
}

export function BettingHistory() {
    const [user, setUser] = useState<UserType[]>([]);
    const [isRotated, setIsRotated] = useState(false);
    const [isAscending, setIsAscending] = useState(false);
    const [search, setSearch] = useState('');
    
    console.log(search);
    const GetUser = () => {
        axios.get(`http://localhost:3000/api/v1/usergames`).then((response) =>
            setUser(response.data)
        );
    };


    useEffect(() => {
        GetUser();
    }, []);

    const sortedUsers = user.sort((a, b) => {
        return isAscending ? a.winning - b.winning : b.winning - a.winning;
    });

    const handleRotate = () => {
        setIsRotated(!isRotated);
        setIsAscending(!isAscending);
    };

    return (
        <div className="list-main">
            <div className='title'>
                <h2 className='title-user font-bold '>Betting History</h2>
                <div className="new-user-main">
                    <div className="filter-balance">
                        <p>Filter by profit: </p>
                        <button className='filter-btn' onClick={handleRotate}>Profit<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRotated ? 'rotate-180' : ''}> <g id="SVGRepo_bgCarrier" strokeWidth="0"></g> <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g> <g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="#ffffff"></path></g></svg></button>
                    </div>
                </div>
            </div>
            <div className="header-name3">
                <div className="header-column">Total bet</div>
                <div className="header-column">Winning</div>
                <div className="header-column">Game</div>
            </div>
            <ul className="list">
                {sortedUsers.map((item) => (
                    <li className='items3' key={item.id_user}>
                        <div className="user-info">
                            <div className="column">{item.bet}</div>
                            <div className="column">{item.winning}</div>
                            <div className="column">{item.game}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}