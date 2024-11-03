import { Roulette, Rotar } from "../../components/Games/RouletteGame/Roulette"
import { BetBoard } from "../../components/Games/RouletteGame/BetBoard"
import { GamesSideBar } from '../SideBar/GamesSideBar.tsx';


export function RouletteLive() {
    return (
        // ESTO NO ESTA IMPLEMENTADO
        <> 
            <div> </div>
            <GamesSideBar/>
            <Roulette></Roulette> 
            <BetBoard></BetBoard> 
            <button onClick={Rotar}>Girar</button>
        </> 
        // ESTO NO ESTA IMPLEMENTADO
    )
}