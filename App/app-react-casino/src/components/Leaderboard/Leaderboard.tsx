import axios from '../../libs/axios'
import { useContext } from "react";
import { userContext } from '../../App';
import { useEffect, useState } from 'react';
import './Leaderboard.css';
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom';

interface UserType {
    number: number;
    id_user: number;
    username: string;
    bet: number;
    winning: number;
    game: string;
    role: string;
}


export function Leaderboard() {
    const contextData = useContext(userContext);
    const role = contextData.role
    const [user, setUser] = useState<UserType[]>([]);
    const [isRotated, setIsRotated] = useState(false);
    const [isAscending, setIsAscending] = useState(false);
    const [search, setSearch] = useState('');

    const navigate = useNavigate()
    const token = localStorage.getItem('jwt-token');

    const GetUser = async () => {
        try{
            const response = 
            await axios.get('/userGames/leaderboards', { params: { token, role } } )
            setUser(response.data)
        } catch(error) {
            toast.error(error.response.data, {
                description: 'Redirecting...'
            })
            setTimeout(() => {
                navigate("/register")
            }, 1000);
        }
        }

    useEffect(() => {
        window.scrollTo(0, 0);
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
        <div className="leaderboard-list-main">
            <div className='title'>
                <h2 className='title-user'>Leaderboard</h2>
                <div className="new-user-main">
                    <div className="filter-balance">
                        <p>Filter by winning: </p>
                        <button className='filter-btn' onClick={handleRotate}>Winning<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRotated ? 'rotate-180' : ''}> <g id="SVGRepo_bgCarrier" strokeWidth="0"></g> <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g> <g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="#ffffff"></path></g></svg></button>
                    </div>
                    <div className="search-box">
                        <p>Search by username: </p>
                        <input type="text" placeholder='Enter an Username' onChange={(e) => setSearch(e.target.value.toLowerCase())}/>
                    </div>
                </div>
            </div>
            <div className="header-name2">
                <div className="header-column">Username</div>
                <div className="header-column">Total Bet</div>
                <div className="header-column">Winning</div>
                <div className="header-column">Game</div>
            </div>
            <ul className="list">
            {sortedUsers.filter((item) => {
                    if (search === '') {
                        return true;
                    } else {
                    return item.username.toLowerCase().includes(search);
                    }
                })
                    .map((item) => (
                        <li className="items2" key={item.number}>
                            <div className="user-info">
                                <p className="column">{item.username}</p>
                                <p className="column">{item.bet}</p>
                                <p className="column">{item.winning}</p>
                                <p className="column">{item.game}</p>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
