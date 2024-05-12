import { Routes, Route } from 'react-router-dom'
import { Principal } from './pages/Principal/Principal.tsx'
import { Header } from './components/Header/Header.tsx'
import { Footer } from './components/Footer/Footer.tsx'
import './App.css'
import { LogIn } from './components/LogIn/LogIn.tsx'

export function App() {
    return(
        <>
            <Header/>
            <LogIn/>
                <Routes>
                    <Route path="/" element={<Principal />} />
                </Routes>
            <Footer/>
        </>
    )
}