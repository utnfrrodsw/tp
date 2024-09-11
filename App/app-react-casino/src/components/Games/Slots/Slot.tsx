import { useEffect, useState } from "react";
import './Slot.css';
import { GamesSideBar } from "../../GamesSideBar";
import slotSpinSound from "../../../assets/sounds/slotSound.mp3"
import slotSpinStart from "../../../assets/sounds/slotStart.mp3"
import slotWinSound from "../../../assets/sounds/SlotWin.mp3"
import mutedIcon from "../../../assets/images/mutedIcon.png"
import axios from 'axios';

export function Slot(usuario) {

    var id = usuario.id
    const slotSpin = new Audio(slotSpinSound)
    const slotStart = new Audio(slotSpinStart)
    const slotWin = new Audio(slotWinSound)

    console.log(usuario)

    function patchUser(newMoney) {
        axios.put(`http://localhost:3000/api/v1/users/${id}`, {
            balance: `${newMoney}`,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        window.scrollTo(0, 0)}, []
    )
    
    // Columnas correspondientes a la tragamonedas
    const Reels = ["Siete", "Banana", "Sandia", "Limon", "BAR", "Campana", "Naranja", "Arandano", "Fresa"];
    const iconHeight = 79
    const [isActive, setIsActive] = useState(true)
    const [isMuted, setIsMuted] = useState(false)
    const handleToggle = () => {
        setIsMuted(!isMuted)
    }
    const [Win, setWin] = useState("");
    const [error, setError] = useState("");
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
    
    const Play = () => {
        setIsActive(false)
        setWin("")
        if(usuario.balance < 50) {
            setError("Saldo insuficiente")
            setIsActive(true)
        } else {
            usuario.onMoney(usuario.balance - 50)
            patchUser(usuario.balance - 50)
            if (isMuted == false) {
                slotStart.play()
            }
            SpinX()
        }
    }

    const SpinX = () => {
        if (isMuted == false) {
            slotSpin.play()
        }
        const Reel = document.querySelector("#reel1") as HTMLElement
        Reel.style.transition = `background-position-y 2500ms cubic-bezier(.41,-0.01,.63,1.09)`;
        const ReelStyle = getComputedStyle(Reel)
        var numeroSorteo0 = getRandomInt(4,7)
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
        var numeroSorteo1 = getRandomInt(4,7)
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
        var numeroSorteo2 = getRandomInt(4,7)
        var bgPos2 = parseInt(ReelStyle.backgroundPositionY)  
        Reel.style.backgroundPositionY = `${(3*(-iconHeight*numeroSorteo2) + bgPos2)}px`;
        z0 = (-(3*(-iconHeight*numeroSorteo2) + bgPos2) % 9)
        z1 = (-(3*(-iconHeight*numeroSorteo2) + bgPos2) % 9) + 1
        z2 = (-(3*(-iconHeight*numeroSorteo2) + bgPos2 + 79) % 9)
        setTimeout(Ganador, 2500)
    }

    const Ganador = () => {
        slotSpin.pause()
        slotSpin.currentTime = 0
        console.log("Los sorteados son: ")
        console.log(Reels[x0],Reels[y0],Reels[z0])
        console.log(Reels[x1],Reels[y1],Reels[z1])
        console.log(Reels[x2],Reels[y2],Reels[z2])
        console.log("---------")
        if((Reels[x1] == Reels[y1]) && (Reels[z1] == Reels[x1]) && (Reels[z1] == Reels[y1])) {
            setWin("Ganaste 500 monedas!")
            if(isMuted == false) {
                slotWin.play() 
            }
            usuario.onMoney(usuario.balance + 500)
            patchUser(usuario.balance + 500)
        } else if ((Reels[x2] == Reels[y1]) && (Reels[z0] == Reels[y1]) && (Reels[x2] == Reels[z0])) {
            setWin("Ganaste 250 monedas!")
            if(isMuted == false) {
                slotWin.play() 
            }
            usuario.onMoney(usuario.balance + 250)
            patchUser(usuario.balance + 250)
        } else if ((Reels[x0] == Reels[y1]) && (Reels[z2] == Reels[y1]) && (Reels[x0] == Reels[z2])) {
            setWin("Ganaste 250 monedas!")
            if(isMuted == false) {
                slotWin.play() 
            }
            usuario.onMoney(usuario.balance + 250)
            patchUser(usuario.balance + 250)
        }
        setIsActive(true)
    }

    return(

        <div className="tragamonedas">
            <GamesSideBar/>
            <button className={isMuted ? "mutedButton mutedEnabled" : "mutedButton"} onClick={handleToggle}><img src={mutedIcon} alt="mutedIcon"/></button>

            <div className="slotsBG">
                <h1 className="textoTragamonedas">SLOT MACHINE</h1>
                <div className="slots">
                    <div className="reel" id="reel1"></div>
                    <div className="reel" id="reel2"></div>
                    <div className="reel" id="reel3"></div>
                </div>
                <button className={isActive ? "buttonTragamonedas" : "buttonTragamonedas buttonDisabled"} onClick={Play} id="boton">Click para jugar</button>
                <div className="slotsMessages">
                    <p className="message">{Win}</p>
                    <p className="message">{error}</p>
                </div>
            </div>


        </div>
    

    )

}
