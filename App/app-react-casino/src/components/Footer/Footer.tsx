
import { NavLink as Link } from 'react-router-dom';

import "./Footer.css";

import ig_logo from "../../assets/images/ig-logo.png";


export function Footer(){
  return(
    <>
      <div className='pt-3'>
      <div className='hidden md:block bg-[#d81536]'>
        <p className='p-3 text-sm text-justify'>If you or someone you know is suffering from a gambling problem, help is a phone call or text away. Call or text the National Problem Gambling Helpline at <strong>1-800-GAMBLER</strong> to connect with support at any time. Attentive, knowledgeable counselors are ready and waiting to provide confidential care and assistance, answer questions, and connect you with local support groups and treatment options.</p>
      </div>

      <div className='block md:hidden bg-[#d81536] pt-3 pb-3'>
        <p className='text-sm text-center'> GAMBLE WITH RESPONSABILITY </p>
        <p className='text-sm text-center'> <strong> 1-800-GAMBLER </strong></p>
      </div>

      <div className='p-4 md:flex-nowrap md:flex gap-0 md:flex-row'>
        <div className='flex flex-grow flex-col md:grid md:grid-cols-2'>
          <div className='mb-1'>
            <div className='flex mb-2 text-lg font-bold text-[#FABC01]'> <p> Policies </p></div>
            <div className='m-0 gap-2 flex flex-col' > 
              <div className='hover:text-[#FABC01]'> <Link to='/terms-and-conditions'> Terms And Conditions </Link> </div>
              <div className='hover:text-[#FABC01]'> <Link to='/privacy-policy'> Privacy Policy </Link> </div>
              <div className='hover:text-[#FABC01]'> <Link to='/fair'> Fair </Link> </div>
              <div className='hover:text-[#FABC01]'> <Link to='/game-policy'> Game Policy </Link></div>
            </div>
          </div>
        </div>

        <div className='flex flex-grow flex-col md:grid md:grid-cols-2'>
          <div className='mb-1'>
            <div className='flex mb-2 text-lg font-bold text-[#FABC01]'> <p> Support </p></div>
            <div className='m-0 gap-2 flex flex-col' > 
              <Link to='/about-us' className=' hover:text-[#FABC01]'> About Us </Link> 
              <div className='hover:text-[#FABC01]'> <Link to='/help'> Help Center </Link> </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col md:grid md:grid-cols-2'>
          <div className='mb-1'>
            <div className='flex mb-2 text-lg font-bold text-[#FABC01]'> <p> Community </p></div>
            <div className='gap-6 flex md:grid md:grid-rows-2 md:grid-cols-2' > 
              <a href='https://www.instagram.com/starboyagus/' className='social' target='_blank' >      
              <img src={ig_logo} alt="Instagram Logo"/>
              </a>
              
              <a href='https://www.instagram.com/niciade_/' className='social' target='_blank' >      
              <img src={ig_logo} alt="Instagram Logo"/>
              </a>

              <a href='https://www.instagram.com/lucasmaggi03/' className='social' target='_blank' >      
              <img src={ig_logo} alt="Instagram Logo"/>
              </a>

              <a href='https://www.instagram.com/_maw911/' className='social' target='_blank' >      
              <img src={ig_logo} alt="Instagram Logo"/>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='pt-5'><hr className='border-none h-[2px] bg-[#38305F] mr-6 ml-6' /></div>

      <div className='p-4'> 
        <div className='flex mb-2 text-lg font-bold text-[#FABC01]'> <p> Accepted Currencies </p></div>
        <div className='mt-4 flex flex-wrap gap-3'> 
          <div className=' flex items-center p-3  border border-[#181529] bg-[#181529] rounded-lg '> 
            <img src='./src/assets/images/BTC.svg' className=' size-5' />
            <p className=' text-[#F0F0D8] p-2 font-semibold'> Bitcoin (BTC) </p>
          </div>

          <div className=' flex items-center p-3  border border-[#181529] bg-[#181529] rounded-lg '> 
            <img src='./src/assets/images/DOGE.svg' className=' size-5' />
            <p className=' text-[#F0F0D8] p-2 font-semibold'> Dogecoin (DOGE) </p>
          </div>

          <div className=' flex items-center p-3 border border-[#181529] bg-[#181529] rounded-lg '> 
            <img src='./src/assets/images/ETH.svg' className=' size-5' />
            <p className=' text-[#F0F0D8] p-2 font-semibold'> Ethereum (ETH) </p>
          </div>
        </div>
      </div>

      <div className='pt-5'><hr className=' border-none h-[2px] bg-[#38305F] mr-6 ml-6' /></div>

      <div className='p-4'> 
        <div className='flex mb-2 text-lg font-bold text-[#FABC01]'> <p> Sponsors </p></div>
        <div className='flex gap-5 flex-col md:flex-row md:flex-wrap mt-4 '>
          <div className=' bg-[#181529] pl-8 pr-8 p-5 rounded-lg md:content-center'>
            <img src='./src/assets/images/afa-logo.png' className='w-16 h-auto m-auto' />
          </div>
          
          <div className=' bg-[#181529] pl-8 pr-8 p-5 rounded-lg md:content-center'>
            <img src='./src/assets/images/porsche-logo.png' className='w-14 h-auto m-auto' />
          </div>

          <div className=' bg-[#181529] pl-8 pr-8 p-5  rounded-lg md:content-center'>
            <img src='./src/assets/images/rolex-logo.png' className='w-24 h-auto m-auto' />
          </div>

          <div className=' bg-[#181529] pl-8 pr-8 p-5  rounded-lg md:content-center'>
            <img src='./src/assets/images/premier-logo.png' className='w-16 h-auto m-auto' />
          </div>
        </div>
      </div>

      </div>
    </>
  )
}