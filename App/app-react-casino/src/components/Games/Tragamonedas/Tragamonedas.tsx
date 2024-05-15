import { useState, useEffect } from "react";
import './Tragamonedas.css';

export function Tragamonedas() {

    useEffect(() => {
        window.scrollTo(0, 0)}, []
    )
    
    // Columnas correspondientes a la tragamonedas
    const Reels= [0,1,2,3,4,5,6,7,8,9];

    // Los 3 numeros de cada columna
    // Columna 1
    const [x0, setx0] = useState(Reels[0]);
    const [x1, setx1] = useState(Reels[1]);
    const [x2, setx2] = useState(Reels[2]);

    // Columna 2
    const [y0, sety0] = useState(Reels[0]);
    const [y1, sety1] = useState(Reels[1]);
    const [y2, sety2] = useState(Reels[2]);

    // Columna 3
    const [z0, setz0] = useState(Reels[0]);
    const [z1, setz1] = useState(Reels[1]);
    const [z2, setz2] = useState(Reels[2]);


    // Generador de un numero aleatorio mediante parametros, tiene un ERROR que necesita ser corregido y es que la generacion no incluye el minimo pero si el maximo
    function getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Sorteo de los 3 primeros numeros correspondientes a la primera columna
    function sorteoColumna1() {
        let pos = 0
        for (let i = 0; i < getRandomInt(5,100); i++) {
            pos = pos + 1
            setx0(pos)
            if(pos == 9) {
                setx1(Reels[0])
                setx2(Reels[1])
            } else if (pos == 8) {
                setx1(Reels[pos + 1])
                setx2(Reels[0])
            } else {
                setx1(Reels[pos + 1])
                setx2(Reels[pos + 2])
            }
            if (pos == 9) {
                pos = 0;
            }
        }
    }

    //Sorteo de los 3 primeros numeros correspondientes a la segunda columna
    function sorteoColumna2() {
        let pos = 0
        for (let i = 0; i < getRandomInt(5,100); i++) {
            pos = pos + 1
            sety0(pos)
            if(pos == 9) {
                sety1(Reels[0])
                sety2(Reels[1])
            } else if (pos == 8) {
                sety1(Reels[pos + 1])
                sety2(Reels[0])
            } else {
                sety1(Reels[pos + 1])
                sety2(Reels[pos + 2])
            }
            if (pos == 9) {
                pos = 0;
            }
        }
    }

    //Sorteo de los 3 primeros numeros correspondientes a la tercera columna
    function sorteoColumna3() {
        let pos = 0
        for (let i = 0; i < getRandomInt(5,100); i++) {
            pos = pos + 1
            setz0(pos)
            if(pos == 9) {
                setz1(Reels[0])
                setz2(Reels[1])
            } else if (pos == 8) {
                setz1(Reels[pos + 1])
                setz2(Reels[0])
            } else {
                setz1(Reels[pos + 1])
                setz2(Reels[pos + 2])
            }
            if (pos == 9) {
                pos = 0;
            }
        }
    }

    function play() {
        sorteoColumna1()
        sorteoColumna2()
        sorteoColumna3()
    }

    return(

        <div className="tragamonedas">
            <h1 className="textoTragamonedas">Simulador de maquina tragamonedas</h1>
            <p className="textoTragamonedas">Numeros:</p>

            <div className="tragamonedasNumeros">
                <div className="columna">
                    <p>{x0}</p>
                    <p>{x1}</p>
                    <p>{x2}</p>
                </div>
                <div className="columna">
                    <p>{y0}</p>
                    <p>{y1}</p>
                    <p>{y2}</p>
                </div>
                <div className="columna">
                    <p>{z0}</p>
                    <p>{z1}</p>
                    <p>{z2}</p>
                </div>
            </div>

            <button className="buttonTragamonedas" onClick={play}>Click para jugar</button>
        </div>

    )

}
