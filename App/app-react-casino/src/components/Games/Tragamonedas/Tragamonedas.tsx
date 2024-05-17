import { useState, useEffect } from "react";
import './Tragamonedas.css';

export function Tragamonedas() {

    useEffect(() => {
        window.scrollTo(0, 0)}, []
    )
    
    // Columnas correspondientes a la tragamonedas
    const Reels = [0,1,2,3];
    var max = Reels.length - 1

    // Premios en linea
    const PremiosLinea = [100, 200, 300, 400];

    // Premios en diagonal
    const PremiosDiagonal = [50, 100, 150, 200]

    // Los 3 numeros de cada columna
    
    // x,y,z COLUMNAS
    // 0,1,2 FILAS

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

    function sortear() {

        let pos;

        // Sorteo de la primera columna
        pos = 0;
        let x_0 = x0
        let x_1 = x1
        let x_2 = x2
        for (let i = 0; i < getRandomInt(5,100); i++) {
            pos = pos + 1
            x_0 = pos
            if(pos == max) {
                x_1 = Reels[0]
                x_2 = Reels[1]
            } else if (pos == max-1) { 
                x_1 = Reels[pos + 1]
                x_2 = Reels[0]
            } else {
                x_1 = Reels[pos + 1]
                x_2 = Reels[pos + 2]
            }
            if (pos == max) {
                pos = 0;
            }
        }

        setx0(x_0)
        setx1(x_1)
        setx2(x_2)

        // Sorteo de la segunda columna
        pos = 0;
        let y_0 = y0
        let y_1 = y1
        let y_2 = y2
        for (let i = 0; i < getRandomInt(5,100); i++) {
            pos = pos + 1
            y_0 = pos
            if(pos == max) {
                y_1 = Reels[0]
                y_2 = Reels[1]
            } else if (pos == max-1) {
                y_1 = Reels[pos + 1]
                y_2 = Reels[0]
            } else {
                y_1 = Reels[pos + 1]
                y_2 = Reels[pos + 2]
            }
            if (pos == max) {
                pos = 0;
            }
        }

        sety0(y_0)
        sety1(y_1)
        sety2(y_2)

        // Sorteo de la tercera columna
        pos = 0;
        let z_0 = z0
        let z_1 = z1
        let z_2 = z2
        for (let i = 0; i < getRandomInt(5,100); i++) {
            pos = pos + 1
            z_0 = pos
            if(pos == max) {
                z_1 = Reels[0]
                z_2 = Reels[1]
            } else if (pos == max-1) {
                z_1 = Reels[pos + 1]
                z_2 = Reels[0]
            } else {
                z_1 = Reels[pos + 1]
                z_2 = Reels[pos + 2]
            }
            if (pos == max) {
                pos = 0;
            }
        }

        setz0(z_0)
        setz1(z_1)
        setz2(z_2)

        console.log("-------------")
        console.log(x_0,y_0,z_0)
        console.log(x_1,y_1,z_1)
        console.log(x_2,y_2,z_2)

        if((x_1 == y_1) && (y_1 == z_1)) {
            console.log("Felicidades! ganaste: ", PremiosLinea[x1], " monedas", x_1, y_1, z_1, " 1 ")
            alert("Felicidades! ganaste: " + PremiosLinea[x1] + " monedas")
        } else if ((x_0 == y_1) && (y_1 == z_2) && (z_2 == x_0)) {
            console.log("Felicidades! ganaste: ", PremiosDiagonal[x0], " monedas", x_0, y_1, z_2, " 2 ")
            alert("Felicidades! ganaste: " + PremiosDiagonal[x0] + " monedas")
        } else if ((x_2 == y_1) && (y_1 == z_0) && (z_0 == x_2)) {
            console.log("Felicidades! ganaste: ", PremiosDiagonal[x0], " monedas", x_0, y_1, z_2, " 3 ")
            alert("Felicidades! ganaste: " + PremiosDiagonal[x0] + " monedas")
        }

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

            <button className="buttonTragamonedas" onClick={sortear}>Click para jugar</button>
        </div>

    )

}
