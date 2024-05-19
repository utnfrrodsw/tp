import { useState, useEffect } from "react";
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
        const Reel = document.querySelector(".reel") as HTMLElement
        Reel.style.transition = `background-position-y 2500ms cubic-bezier(.41,-0.01,.63,1.09)`;
        const ReelStyle = getComputedStyle(Reel)
        var numeroSorteo = getRandomInt(1,8)
        var bgPos = parseInt(ReelStyle.backgroundPositionY)  
        Reel.style.backgroundPositionY = `${(3*(-iconHeight*numeroSorteo) + bgPos)}px`;
        var posicion = (-(3*(-iconHeight*numeroSorteo) + bgPos) / iconHeight) + 1
        console.log(posicion)
      }

    return(

        <div className="tragamonedas">
            <h1 className="textoTragamonedas">Simulador de maquina tragamonedas</h1>
            <p className="textoTragamonedas">Numeros:</p>

            <div className="reel"></div>

            <button className="buttonTragamonedas" onClick={Spin}>Click para jugar</button>

        </div>
    

    )

}
