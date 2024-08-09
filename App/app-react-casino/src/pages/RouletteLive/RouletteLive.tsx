import { Roulette, Rotar } from "../../components/Games/RouletteGame/Roulette"
import { BetBoard } from "../../components/Games/RouletteGame/BetBoard"
import "./RouletteLive.css"

export function RouletteLive() {
    return (
        <>
            <div className="p-20"> </div>
            <Roulette></Roulette>
            <BetBoard></BetBoard>
            <button onClick={Rotar} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Girar</button>
        </>
    )
}