import { Routes, Route } from 'react-router-dom'
import { Principal } from './pages/Principal/Principal.tsx'
import { Header } from './components/Header/Header.tsx'
import { Footer } from './components/Footer/Footer.tsx'
import './App.css'
import { LogIn } from './pages/LogIn/LogIn.tsx'

export function App() {
    return(
        <>
            <Header />
                <Routes>
                    <Route path="/" element={<Principal />} />
                    <Route path="/login" element= {<LogIn />} />
                </Routes>
            <Footer />
        </>
    )
}