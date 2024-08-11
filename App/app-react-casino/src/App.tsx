import { Routes, Route } from 'react-router-dom'
import { Principal } from './pages/Principal/Principal.tsx'
import { Header } from './components/Header/Header.tsx'
import { Footer } from './components/Footer/Footer.tsx'
import { Dice } from './components/Games/Dice/Dice.tsx'
import { Tragamonedas } from './components/Games/Tragamonedas/Tragamonedas.tsx'
import { Wheel } from './components/Games/Wheel/Wheel.tsx'
import { RouletteLive } from './pages/RouletteLive/RouletteLive.tsx'
import { ErrorPage } from './pages/ErrorPage/ErrorPage.tsx'
import './App.css'
import { Listado } from './components/Axios/Listado/Listado.tsx'
import { PostUser } from './components/Axios/PostUser/PostUser.tsx'
import { GetOne } from './components/Axios/GetOne/getone.tsx'
import { Usuario } from './components/Axios/Usuarios/Usuario.tsx'
import { Terms } from './pages/Terms/Terms.tsx'
import { AboutUs } from './pages/AboutUs/AboutUs.tsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy/privacyPolicy.tsx'
import { Help } from './pages/Help/help.tsx'

export function App() {
    return(
        <>
            <Header/>
                <Routes>
                    <Route path="/" element={<Principal />} />
                    <Route path="/dice" element={<Dice />} />
                    <Route path="/tragamonedas" element={<Tragamonedas />} />
                    <Route path="/wheel" element={<Wheel />} />
                    <Route path="/live_roulette" element={<RouletteLive />} />
                    <Route path="*" element={<ErrorPage />} />
                    <Route path="/listado" element={<Listado/>} />
                    <Route path="/postuser" element={<PostUser />} />
                    <Route path="/getone" element={<GetOne />} />
                    <Route path="/usuario" element={<Usuario />} />
                    <Route path="/terms-and-conditions" element={<Terms />} />
                    <Route path='/about-us' element={<AboutUs />} />
                    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                    <Route path='/help' element={<Help />} />

                </Routes>
            <Footer/>
        </>
    )
}