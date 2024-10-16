import React, { useState, useEffect } from "react";
import axios from 'axios';

export function RegisterAgus(){
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

      const[username, setUsername] = useState('');
      const[first_name, setFirstName] = useState('');
      const[last_name, setLastName] = useState('');
      const[birthday, setBirthday] = useState('');
      const[street, setStreet] = useState('');
      const[phone, setPhone] = useState('');
      const[email, setEmail] = useState('');
      const[password, setPassword] = useState('');
      const[confirmpass, setConfirmPassword] = useState('');
      const[message, setMessage] = useState('');
      const[id_country, setCountry] = useState(1);




      const handleSubmit = async () => {
        try{
            const response = 
                await axios.post('http://localhost:3000/api/v1/register',
                    {username, first_name, last_name, birthday, street, phone, email, password, id_country});
            setMessage(response.message);
            console.log(response.data)
        } catch (error) {
            setMessage(error.response.data)
            console.error(error)
        }
    };


    function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setCountry(e.currentTarget.value);
    }

    return(
        <div className="mt-[100px]">
            <h1> Create an account </h1>
            <div className="flex flex-col lg:grid-cols-2 lg:w-[50%] p-2">
                <input type="text" className="border border-[#41376D] bg-[#0D0B16] placeholder-[#41376D] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                
                <input type="text" className="border border-[#41376D] bg-[#0D0B16] placeholder-[#41376D] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-1" placeholder="First name" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" name="lastname" className="border border-[#41376D] bg-[#0D0B16] placeholder-[#41376D] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-1" placeholder="Last name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                
                <input type="date" name="birthday" className="border border-[#41376D] bg-[#0D0B16] text-[#41376D] p-2 mb-2 rounded-xl col-span-2" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                <input type="email" name="email" className="border border-[#41376D] bg-[#0D0B16] placeholder-[#41376D] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" name="phone" className="border border-[#41376D] bg-[#0D0B16] placeholder-[#41376D] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input type="text" name="street" className="border border-[#41376D] bg-[#0D0B16] placeholder-[#41376D] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />

                <p className="font-medium lg:col-span-2 mb-1 text-[#F6EDED]"> Select your country: </p>
                <select name="country" className="border border-[#41376D] bg-[#0D0B16] text-[#41376D] p-2 mb-2 rounded-xl col-span-2" value={id_country} onChange={handleCountryChange}>
                    <option value='1' className="text-[#F6EDED]"> Argentina </option>
                    <option value='2' className="text-[#F6EDED]"> Colombia </option>
                    <option value='3' className="text-[#F6EDED]"> Chile </option>
                    <option value='4' className="text-[#F6EDED]"> Brasil </option>
                    <option value='5' className="text-[#F6EDED]"> Uruguay </option>
                </select>


                <input type="password" name="password" className="border border-[#41376D] bg-[#0D0B16] placeholder-[#41376D] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" name="confirmpass" className="border border-[#41376D] bg-[#0D0B16] placeholder-[#41376D] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Confirm Password" value={confirmpass} onChange={(e) => setConfirmPassword(e.target.value)} />

                <p className="col-span-2"> * you must be 18 years or older </p>

                <div className="col-span-2">
                <input type="checkbox" required />
                <label> i agree bro </label>
                </div>




                <button className="me-2 items-center p-2 mt-2 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}