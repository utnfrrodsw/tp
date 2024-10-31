import axios from 'axios';
import './EditUser.css';
import { NavLink as Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

interface UserType {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    balance: string;
}
export function EditUser({role}) {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    const {id} = useParams<{ id: string }>();;
    const [user, setUser] = useState<UserType | null>(null);
    const form = useRef<HTMLFormElement | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState("");
    console.log(id)

    const token = localStorage.getItem('jwt-token');

    const GetData = () => {
        axios.get(`http://localhost:3000/api/v1/users/${id}`, { params: { token, role } }).then((response) => {
            const fetchedUser: UserType = response.data;
            setUser(fetchedUser);
            setFirstName(fetchedUser.first_name);
            setLastName(fetchedUser.last_name);
            setPhone(fetchedUser.phone);
            setEmail(fetchedUser.email);
            setBalance(fetchedUser.balance);
        });
    };

    useEffect(() => {
        GetData();
    }, [id]);

    function patchUser() {
        if (!form.current) return; 
        axios.put(`http://localhost:3000/api/v1/users/${id}`, {
            token,
            role,
            first_name: form.current.firstname.value,
            last_name: form.current.lastname.value,
            phone: form.current.phone.value,
            email: form.current.email.value,
            balance: form.current.balance.value,
        })
        .then((response) => {
            console.log(response);
            location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function defaultValues() {
        if (!user) return; 
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setPhone(user.phone);
        setEmail(user.email);
        setBalance(user.balance);

        const inputs = ["firstname", "lastname", "phone", "email", "balance"];
        inputs.forEach(id => {
            const input = document.querySelector(`#${id}`);
            input?.classList.remove("modified");
        });
    }

    function checkField(field: keyof UserType) {
        if (!form.current || !user) return; 
        const input = form.current[field].value;
        const inputElement = document.querySelector(`#${field}`);
        if (input !== user[field]) {
            inputElement?.classList.add("modified");
        } else {
            inputElement?.classList.remove("modified");
        }
    }

    return (
        <div className='edituser'>
            <form className='formEdit' ref={form}>
                <label>First Name</label>
                <input type="text" id='firstname' className='formInput' value={firstName} onChange={e => setFirstName(e.target.value)} onInput={() => checkField("first_name")} name='firstname' />
                <label>Last Name</label>
                <input type="text" id='lastname' className='formInput' value={lastName} onChange={e => setLastName(e.target.value)} onInput={() => checkField("last_name")} name='lastname' />
                <label>Phone Number</label>
                <input type="text" id='phone' className='formInput' value={phone} onChange={e => setPhone(e.target.value)} onInput={() => checkField("phone")} name='phone' />
                <label>Email</label>
                <input type="text" id='email' className='formInput' value={email} onChange={e => setEmail(e.target.value)} onInput={() => checkField("email")} name='email' />
                <label>Balance</label>
                <input type="text" id='balance' className='formInput' value={balance} onChange={e => setBalance(e.target.value)} onInput={() => checkField("balance")} name='balance' />
            </form>
            <div className='formButtons'>
                <button type='button' className='formSubmit' onClick={patchUser}>Update</button>
                <button type='button' onClick={defaultValues} className='formSubmit'>Default Values</button>
                <Link to="/user" className="back">Back</Link>
            </div>
        </div>
    );
}
