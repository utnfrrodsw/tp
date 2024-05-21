import { useEffect } from "react";
import './Tragamonedas.css';

export function Tragamonedas() {

    useEffect(() => {
        window.scrollTo(0, 0)}, []
    )
    
    // Columnas correspondientes a la tragamonedas
    const Reels = ["Siete", "Banana", "Sandia", "Limon", "BAR", "Campana", "Naranja", "Fruta Violeta", "Fresa"];
    const iconHeight = 79

    // Generador de un numero aleatorio mediante parametros, tiene un ERROR que necesita ser corregido y es que la generacion no incluye el minimo pero si el maximo
    function getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const Spin = () => {
        const Reel = document.querySelector("#reel1") as HTMLElement
        Reel.style.transition = `background-position-y 2500ms cubic-bezier(.41,-0.01,.63,1.09)`;
        const ReelStyle = getComputedStyle(Reel)
        var numeroSorteo0 = getRandomInt(1,8)
        var bgPos0 = parseInt(ReelStyle.backgroundPositionY)  
        Reel.style.backgroundPositionY = `${(3*(-iconHeight*numeroSorteo0) + bgPos0)}px`;
        var posicion0 = (-(3*(-iconHeight*numeroSorteo0) + bgPos0) % 9) + 1
        console.log("0: ", Reels[posicion0])
        setTimeout(SpinY, 500)
    }

    const SpinY = () => {
        const Reel = document.querySelector("#reel2") as HTMLElement
        Reel.style.transition = `background-position-y 2500ms cubic-bezier(.41,-0.01,.63,1.09)`;
        const ReelStyle = getComputedStyle(Reel)
        var numeroSorteo1 = getRandomInt(1,8)
        var bgPos1 = parseInt(ReelStyle.backgroundPositionY)  
        Reel.style.backgroundPositionY = `${(3*(-iconHeight*numeroSorteo1) + bgPos1)}px`;
        var posicion1 = (-(3*(-iconHeight*numeroSorteo1) + bgPos1) % 9) + 1
        console.log("1: ", Reels[posicion1])
        setTimeout(SpinZ, 500)
    }

    const SpinZ = () => {
        const Reel = document.querySelector("#reel3") as HTMLElement
        Reel.style.transition = `background-position-y 2500ms cubic-bezier(.41,-0.01,.63,1.09)`;
        const ReelStyle = getComputedStyle(Reel)
        var numeroSorteo2 = getRandomInt(1,8)
        var bgPos2 = parseInt(ReelStyle.backgroundPositionY)  
        Reel.style.backgroundPositionY = `${(3*(-iconHeight*numeroSorteo2) + bgPos2)}px`;
        var posicion2 = (-(3*(-iconHeight*numeroSorteo2) + bgPos2) % 9) + 1
        console.log("2: ", Reels[posicion2])
        console.log("--------")
    }

    return(

        <div className="tragamonedas">
            <h1 className="textoTragamonedas">Simulador de maquina tragamonedas</h1>
            <p className="textoTragamonedas">Numeros:</p>

            <div className="slots">
                <div className="reel" id="reel1"></div>
                <div className="reel" id="reel2"></div>
                <div className="reel" id="reel3"></div>
            </div>

            <button className="buttonTragamonedas" onClick={Spin}>Click para jugar</button>

        </div>
    

    )

}
