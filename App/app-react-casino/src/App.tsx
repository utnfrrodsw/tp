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
                </Routes>
            <Footer/>
        </>
    )
}