import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home.tsx'
import { Header } from './components/Header/Header.tsx'
import { Footer } from './components/Footer/Footer.tsx'
import { Dice } from './components/Games/Dice/Dice.tsx'
import { Slot } from './components/Games/Slots/Slot.tsx'
import { Wheel } from './components/Games/Wheel/Wheel.tsx'
import { RouletteLive } from './pages/RouletteLive/RouletteLive.tsx'
import { ErrorPage } from './pages/ErrorPage/ErrorPage.tsx'
import { Listado } from './components/Axios/Listado/Listado.tsx'
import { PostUser } from './components/Axios/PostUser/PostUser.tsx'
import { GetOne } from './components/Axios/GetOne/getone.tsx'
import { User } from './components/Axios/User/User.tsx'

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
                </Routes>
            <Footer/>
        </>
    )
}