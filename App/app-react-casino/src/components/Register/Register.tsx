import React, { useState } from "react";
import { NavLink as Link, useNavigate} from 'react-router-dom';
import axios from '../../libs/axios.tsx'
import './Register.css';
import { toast } from 'sonner';
import { defaultScroll } from "../../libs/globalFunctions.tsx";

export function Register(){
    defaultScroll()

      const[username, setUsername] = useState('');
      const[first_name, setFirstName] = useState('');
      const[last_name, setLastName] = useState('');
      const[birthday, setBirthday] = useState('');
      const[phone, setPhone] = useState('');
      const[email, setEmail] = useState('');
      const[password, setPassword] = useState('');
      const[confirmpass, setConfirmPassword] = useState('');
      const[id_country, setCountry] = useState(1);

      const navigate = useNavigate()

      const handleSubmit = async () => {
        if (password === confirmpass){
        try{
            const response = 
                await axios.post('/register',
                    {username, first_name, last_name, birthday, phone, email, password, id_country});
            toast.success(response.data, {
                description: 'Redirecting to home page',
            });
            setTimeout(() => {
                navigate("/")
            }, 1000);
        } catch (error) {
            toast.error(error.response.data);
        }
    } else {
        toast.error('Passwords are incorrect')
    } }

    function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setCountry(e.currentTarget.value);
    }

    return(
        <div className="mt-[88px] lg:relative">
            <div className="imgpreview">
            <img src="../../src/assets/images/Porsche.png" className="hidden lg:block lg:ms-auto "></img>
            </div>

            <div className="lg:absolute lg:top-0 lg:w-full">
            <h1 className="ps-2 text-[#F6EDED] font-bold text-2xl mt-[30px]"> Create an account </h1>
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:w-[50%] p-2">
                
                <input type="text" className="focus:outline-none focus:ring-2 focus:ring-[#fa2d49] border border-[#c32a3f] bg-[#0D0B16] placeholder-[#c32a3f] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                
                <input type="text" className="focus:outline-none focus:ring-2 focus:ring-[#fa2d49] border border-[#c32a3f] bg-[#0D0B16] placeholder-[#c32a3f] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-1 mr-2" placeholder="First name" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" name="lastname" className="focus:outline-none focus:ring-2 focus:ring-[#fa2d49] border border-[#c32a3f] bg-[#0D0B16] placeholder-[#c32a3f] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-1" placeholder="Last name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                
                <input type="date" name="birthday" className="focus:outline-none focus:ring-2 focus:ring-[#fa2d49] border border-[#c32a3f] bg-[#0D0B16] text-[#c32a3f] p-2 mb-2 rounded-xl col-span-2" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                <input type="email" name="email" className="focus:outline-none focus:ring-2 focus:ring-[#fa2d49] border border-[#c32a3f] bg-[#0D0B16] placeholder-[#c32a3f] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" name="phone" className="focus:outline-none focus:ring-2 focus:ring-[#fa2d49] border border-[#c32a3f] bg-[#0D0B16] placeholder-[#c32a3f] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

                <p className="font-medium lg:col-span-2 mb-1 text-[#F6EDED]"> Select your country: </p>
                <select name="country" className="border border-[#c32a3f] bg-[#0D0B16] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" value={id_country} onChange={handleCountryChange}>
                    <option value='1' className="text-[#F6EDED]"> Argentina </option>
                    <option value='2' className="text-[#F6EDED]"> Colombia </option>
                    <option value='3' className="text-[#F6EDED]"> Chile </option>
                    <option value='4' className="text-[#F6EDED]"> Brasil </option>
                    <option value='5' className="text-[#F6EDED]"> Uruguay </option>
                </select>

                <input type="password" name="password" className="focus:outline-none focus:ring-2 focus:ring-[#fa2d49] border border-[#c32a3f] bg-[#0D0B16] placeholder-[#c32a3f] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" name="confirmpass" className="focus:outline-none focus:ring-2 focus:ring-[#fa2d49] border border-[#c32a3f] bg-[#0D0B16] placeholder-[#c32a3f] text-[#F6EDED] p-2 mb-2 rounded-xl col-span-2" placeholder="Confirm Password" value={confirmpass} onChange={(e) => setConfirmPassword(e.target.value)} />

                <div className="flex col-span-2 text-[#F6EDED]">
                    <p className="font-bold mr-1">*</p>
                    <p>you must be 18 years or older </p>
                </div>

                <div className="flex-inline col-span-2 text-[#F6EDED]">
                <input type="checkbox" className="mr-1" required />
                <label> i have read the </label>
                <Link to="/terms-and-conditions" className="underline hover:text-[#fa2d49] duration-100 ease-in-out">Terms and conditions</Link>
                <label> and all associated policies </label>
                </div>

                <button className="col-span-2 me-2 p-2 mt-2 focus:outline-none text-[#0D0B16] bg-[#FABC01] hover:bg-[#bd8e00] focus:ring-4 focus:ring-[#c32a3f] font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer duration-75 ease-in-out" onClick={handleSubmit}>Submit</button>

            </div>
            </div>
        </div>
    )
};