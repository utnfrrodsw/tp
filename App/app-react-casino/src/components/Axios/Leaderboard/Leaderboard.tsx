import axios from 'axios';
import { useEffect, useState } from 'react';
import './Leaderboard.css';

interface UserType {
    id_user: number;
    username: string;
    bet: number;
    winning: number;
    game: string;
}

export function Leaderboard({role}) {
    const [users, setLeaderboard] = useState<UserType[]>([]);
    const [isRotated, setIsRotated] = useState(false);
    const [isAscending, setIsAscending] = useState(false);
    const [search, setSearch] = useState('');

    const token = localStorage.getItem('jwt-token');

    const GetLeaderboard = () => {
        axios.get("http://localhost:3000/api/v1/usergames/leaderboard", { params: { token, role }}).then((response) =>
            setLeaderboard(response.data)
        );
    };

    useEffect(() => {
        GetLeaderboard();
    }, []);

    const sortedUsers = users.sort((a, b) => {
        return isAscending ? a.winning - b.winning : b.winning - a.winning;
    });

    const handleRotate = () => {
        setIsRotated(!isRotated);
        setIsAscending(!isAscending);
    };

    return (
        <div className="list-main">
            <div className="title">
                <h2 className="title-user">Leaderboards</h2>
                <div className="new-user-main">
                    <div className="filter-balance">
                        <p>Filter by balance: </p>
                        <button className="filter-btn" onClick={handleRotate}>
                            Balance
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRotated ? 'rotate-180' : ''}>
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="#ffffff"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="search-box">
                        <p>Search by username: </p>
                        <input
                            type="text"
                            placeholder="Enter a Username"
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        />
                    </div>
                </div>
            </div>
            <div className="header-name2">
                <div className="header-column">ID</div>
                <div className="header-column">Username</div>
                <div className="header-column">Total Bet</div>
                <div className="header-column">Winning</div>
                <div className="header-column">Game</div>
            </div>
            <ul className="list">
                {sortedUsers
                    .filter((item) => {
                        if (search === '') {
                            return true;
                        } else {
                            return item.username.toLowerCase().includes(search);
                        }
                    })
                    .map((item) => (
                        <li className="items2" key={item.id_user}>
                            <div className="user-info">
                                <div className="column">{item.id_user}</div>
                                <div className="column">{item.username}</div>
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
