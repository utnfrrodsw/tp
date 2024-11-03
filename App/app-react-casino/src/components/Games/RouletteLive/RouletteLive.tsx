import { Roulette, Rotar } from "../../components/Games/RouletteGame/Roulette.ts"
import { BetBoard } from "../../components/Games/RouletteGame/BetBoard.ts"
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