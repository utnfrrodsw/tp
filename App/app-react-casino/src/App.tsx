import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home.tsx'

import { Header } from './components/Header/Header.tsx'
import { Footer } from './components/Footer/Footer.tsx'

import { Dice } from './components/Games/Dice/Dice.tsx'
import { Slot } from './components/Games/Slots/Slot.tsx'
import { Wheel } from './components/Games/Wheel/Wheel.tsx'

import { Listado } from './components/Axios/Listado/Listado.tsx'
import { PostUser } from './components/Axios/PostUser/PostUser.tsx'
import { GetOne } from './components/Axios/GetOne/getone.tsx'
import { User } from './components/Axios/User/User.tsx'
import { Details } from './components/Axios/Details/Details.tsx'
import { EditUser } from './components/Axios/EditUser/EditUser.tsx'

import { Terms } from './pages/Terms/Terms.tsx'
import { AboutUs } from './pages/AboutUs/AboutUs.tsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy/privacyPolicy.tsx'
import { Help } from './pages/Help/help.tsx'
import { Fair } from './pages/Fair/fair.tsx'
import { GamePolicy } from './pages/GamePolicy/gamePolicy.tsx'
import { RouletteLive } from './pages/RouletteLive/RouletteLive.tsx'
import { ErrorPage } from './pages/ErrorPage/ErrorPage.tsx'

import { Toaster } from 'sonner'

export function App() {
    return(
        <>
        
            <Header/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dice" element={<Dice />} />
                    <Route path="/slot" element={<Slot />} />
                    <Route path="/wheel" element={<Wheel />} />
                    <Route path="/live_roulette" element={<RouletteLive />} />
                    <Route path="*" element={<ErrorPage />} />
                    <Route path="/listado" element={<Listado/>} />
                    <Route path="/postuser" element={<PostUser />} />
                    <Route path="/getone" element={<GetOne />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/details" element={<Details />} />
                    <Route path="/edituser" element={<EditUser />} />
                    <Route path="/terms-and-conditions" element={<Terms />} />
                    <Route path='/about-us' element={<AboutUs />} />
                    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                    <Route path='/help' element={<Help />} />
                    <Route path='/fair' element={<Fair />} />
                    <Route path='/game-policy' element={<GamePolicy />} />
                </Routes>
            <Footer/>
            <Toaster richColors position='top-right' closeButton/>
        </>
        
    )
}