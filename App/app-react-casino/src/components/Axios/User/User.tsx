import axios from 'axios';
import { useEffect, useState } from 'react';
import './User.css';
import { NavLink as Link } from 'react-router-dom'

export function User() {
    const [user, setUser] = useState([]);
    const [isRotated, setIsRotated] = useState(false);
    const [isAscending, setIsAscending] = useState(false);
    const [search, setSearch] = useState('')
    console.log(search);
    const GetUser = () => {
        axios.get("http://localhost:3000/api/v1/users").then((response) =>
            setUser(response.data)
        );
    };

    useEffect(() => {
        GetUser();
    }, []);

    const sortedUsers = user.sort((a, b) => {
        return isAscending ? a.balance - b.balance : b.balance - a.balance;
    });

    const handleRotate = () => {
        setIsRotated(!isRotated);
        setIsAscending(!isAscending);
    };

    return (
        <div className="list-main">
            <div className='title'>
                <h2 className='title-user'>User management</h2>
                <div className="new-user-main">
                    <div className="new-user">
                        <p className='subtitle-user'>Add new user</p>
                        <button className='add-btn'>+ new user</button>
                    </div>
                    <div className="filter-balance">
                        <p>Filter by balance: </p>
                        <button className='filter-btn' onClick={handleRotate}>Balance<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRotated ? 'rotate-180' : ''}> <g id="SVGRepo_bgCarrier" strokeWidth="0"></g> <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g> <g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="#ffffff"></path></g></svg></button>
                    </div>
                    <div className="search-box">
                        <p>Search by username: </p>
                        <input type="text" placeholder='Enter an Username' onChange={(e) => setSearch(e.target.value.toLowerCase())}/>
                    </div>
                </div>
            </div>
            <div className="header-name">
                <div className="header-column">ID</div>
                <div className="header-column">Username</div>
                <div className="header-column">Role</div>
                <div className="header-column">Email</div>
                <div className="header-column">Balance</div>
                <div className="header-column">Actions</div>
            </div>
            <ul className='list'>
                {sortedUsers.filter((item) => {
                    if (search === '') {
                        return true;
                    } else {
                    return item.username.toLowerCase().includes(search);
                    }
                })
                .map((item) => (
                    <li className='items' key={item.id_user}>
                        <div className="user-info">
                            <div className="column">{item.id_user}</div>
                            <div className="column">{item.username}</div>
                            <div className="column">{item.role}</div>
                            <div className="column">{item.email}</div>
                            <div className="column">{item.balance}</div>
                        </div>
                        <div className="actions">
                            <button className="edit-btn">Edit</button>
                            <button className="delete-btn">Delete</button>
                            <Link to="/details" className="read-btn">Read</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}