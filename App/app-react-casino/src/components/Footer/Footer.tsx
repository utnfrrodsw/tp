
import { NavLink as Link } from 'react-router-dom'

export function Footer(){
  return(
    <>
      <div className='pt-3'>
      <div className='hidden md:block bg-[#d81536]'>
        <p className='p-3 text-sm text-justify text-[#F0F0D8]'>If you or someone you know is suffering from a gambling problem, help is a phone call or text away. Call or text the National Problem Gambling Helpline at <strong>1-800-GAMBLER</strong> to connect with support at any time. Attentive, knowledgeable counselors are ready and waiting to provide confidential care and assistance, answer questions, and connect you with local support groups and treatment options.</p>
      </div>

      <div className='block md:hidden bg-[#d81536] pt-3 pb-3'>
        <p className='text-sm text-center text-[#F0F0D8]'> GAMBLE WITH RESPONSABILITY </p>
        <p className='text-sm text-center text-[#F0F0D8]'> <strong> 1-800-GAMBLER </strong></p>
      </div>

      <div className='p-4 md:flex-nowrap md:flex gap-0 md:flex-row'>
        <div className='flex flex-grow flex-col md:grid md:grid-cols-2'>
          <div className='mb-1'>
            <div className='flex mb-2 text-lg font-bold text-[#FABC01]'> <p> Policies </p></div>
            <div className='m-0 gap-2 flex flex-col text-[#F0F0D8] ' > 
              <div className='hover:text-[#FABC01]'> <Link to='/terms-and-conditions'> Terms And Conditions </Link> </div>
              <div className='hover:text-[#FABC01]'> <Link to='/privacy-policy'> Privacy Policy </Link> </div>
              <div className='hover:text-[#FABC01]'> <Link to='/promotions'> Bonus and Promotions </Link> </div>
            </div>
          </div>
        </div>

        <div className='flex flex-grow flex-col md:grid md:grid-cols-2'>
          <div className='mb-1'>
            <div className='flex mb-2 text-lg font-bold text-[#FABC01]'> <p> Support </p></div>
            <div className='m-0 gap-2 flex flex-col text-[#F0F0D8] ' > 
              <Link to='/about-us' className=' hover:text-[#FABC01]'> About Us </Link> 
              <div className='hover:text-[#FABC01]'> <Link to='/help'> Help Center </Link> </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col md:grid md:grid-cols-2'>
          <div className='mb-1'>
            <div className='flex mb-2 text-lg font-bold text-[#FABC01]'> <p> Community </p></div>
            <div className='gap-6 flex md:grid md:grid-rows-2 md:grid-cols-2' > 
              <a href='https://www.twitter.com/starboyagus' className='fill-[#F0F0D8] hover:fill-[#FABC01]' target='_blank' >      
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M24 4.37a9.6 9.6 0 0 1-2.83.8 5.04 5.04 0 0 0 2.17-2.8c-.95.58-2 1-3.13 1.22A4.86 4.86 0 0 0 16.61 2a4.99 4.99 0 0 0-4.79 6.2A13.87 13.87 0 0 1 1.67 2.92 5.12 5.12 0 0 0 3.2 9.67a4.82 4.82 0 0 1-2.23-.64v.07c0 2.44 1.7 4.48 3.95 4.95a4.84 4.84 0 0 1-2.22.08c.63 2.01 2.45 3.47 4.6 3.51A9.72 9.72 0 0 1 0 19.74 13.68 13.68 0 0 0 7.55 22c9.06 0 14-7.7 14-14.37v-.65c.96-.71 1.79-1.6 2.45-2.61z'/></svg>
              </a>

              <a href='https://www.instagram.com/niciade_/' className='fill-[#F0F0D8] hover:fill-[#FABC01]' target='_blank' >      
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' ><path d='M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z'/></svg>
              </a>

              <a href='https://www.instagram.com/lucasmaggi03/' className='fill-[#F0F0D8] hover:fill-[#FABC01]' target='_blank' >      
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' ><path d='M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z'/></svg>              
              </a>
              <a href='https://www.instagram.com/_maw911/' className='fill-[#F0F0D8] hover:fill-[#FABC01]' target='_blank' >      
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' ><path d='M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z'/></svg>
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