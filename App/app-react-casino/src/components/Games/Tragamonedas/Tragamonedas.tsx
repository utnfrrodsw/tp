import { useEffect, useState } from "react";
import './Tragamonedas.css';
import { GamesSideBar } from "../../GamesSideBar";

export function Tragamonedas() {

    useEffect(() => {
        window.scrollTo(0, 0)}, []
    )
    
    // Columnas correspondientes a la tragamonedas
    const Reels = ["Siete", "Banana", "Sandia", "Limon", "BAR", "Campana", "Naranja", "Fruta Violeta", "Fresa"];
    const iconHeight = 79
    const [Win, setWin] = useState(false);
    var x0:number;
    var y0:number;
    var z0:number;
    var x1:number;
    var y1:number;
    var z1:number;
    var x2:number;
    var y2:number;
    var z2:number;


    // Generador de un numero aleatorio mediante parametros, tiene un ERROR que necesita ser corregido y es que la generacion no incluye el minimo pero si el maximo
    function getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const Spin = () => {
        setWin(false)
        const Reel = document.querySelector("#reel1") as HTMLElement
        Reel.style.transition = `background-position-y 2500ms cubic-bezier(.41,-0.01,.63,1.09)`;
        const ReelStyle = getComputedStyle(Reel)
        var numeroSorteo0 = getRandomInt(1,8)
        var bgPos0 = parseInt(ReelStyle.backgroundPositionY)  
        Reel.style.backgroundPositionY = `${(3*(-iconHeight*numeroSorteo0) + bgPos0)}px`;
        x0 = (-(3*(-iconHeight*numeroSorteo0) + bgPos0) % 9)
        x1 = (-(3*(-iconHeight*numeroSorteo0) + bgPos0) % 9) + 1
        x2 = (-(3*(-iconHeight*numeroSorteo0) + bgPos0 + 79) % 9)
        setTimeout(SpinY, 500)
    }

    const SpinY = () => {
        const Reel = document.querySelector("#reel2") as HTMLElement
        Reel.style.transition = `background-position-y 2500ms cubic-bezier(.41,-0.01,.63,1.09)`;
        const ReelStyle = getComputedStyle(Reel)
        var numeroSorteo1 = getRandomInt(1,8)
        var bgPos1 = parseInt(ReelStyle.backgroundPositionY)  
        Reel.style.backgroundPositionY = `${(3*(-iconHeight*numeroSorteo1) + bgPos1)}px`;
        y0 = (-(3*(-iconHeight*numeroSorteo1) + bgPos1) % 9)
        y1 = (-(3*(-iconHeight*numeroSorteo1) + bgPos1) % 9) + 1
        y2 = (-(3*(-iconHeight*numeroSorteo1) + bgPos1 + 79) % 9)
        setTimeout(SpinZ, 500)
    }

    const SpinZ = () => {
        const Reel = document.querySelector("#reel3") as HTMLElement
        Reel.style.transition = `background-position-y 2500ms cubic-bezier(.41,-0.01,.63,1.09)`;
        const ReelStyle = getComputedStyle(Reel)
        var numeroSorteo2 = getRandomInt(1,8)
        var bgPos2 = parseInt(ReelStyle.backgroundPositionY)  
        Reel.style.backgroundPositionY = `${(3*(-iconHeight*numeroSorteo2) + bgPos2)}px`;
        z0 = (-(3*(-iconHeight*numeroSorteo2) + bgPos2) % 9)
        z1 = (-(3*(-iconHeight*numeroSorteo2) + bgPos2) % 9) + 1
        z2 = (-(3*(-iconHeight*numeroSorteo2) + bgPos2 + 79) % 9)
        setTimeout(Ganador, 2500)
    }

    const Ganador = () => {
        
        console.log("Los sorteados son: ")
        console.log(Reels[x0],Reels[y0],Reels[z0])
        console.log(Reels[x1],Reels[y1],Reels[z1])
        console.log(Reels[x2],Reels[y2],Reels[z2])
        console.log("---------")

    }

    return(

        <div className="tragamonedas">
            <GamesSideBar/>
            <h1 className="textoTragamonedas">Simulador de maquina tragamonedas</h1>
            <p className="textoTragamonedas">Numeros:</p>

            <div className="slots">
                <div className="reel" id="reel1"></div>
                <div className="reel" id="reel2"></div>
                <div className="reel" id="reel3"></div>
            </div>

            {Win && (
                <p>Ganaste!</p>
            )}
            
            <button className="buttonTragamonedas" onClick={Spin}>Click para jugar</button>

        </div>
    

    )

}
