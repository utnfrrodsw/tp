import { useEffect, useState, useRef } from "react";
import './Slots.css';
import { useContext } from "react";
import { userContext } from "../../../App.tsx";
import { GamesSideBar } from '../SideBar/GamesSideBar.tsx';
import slotSpinSound from "../../../assets/sounds/slotSsound.mp3"
import slotSpinStart from "../../../assets/sounds/slotStart.mp3"
import slotWinSound from "../../../assets/sounds/SlotWin.mp3"
import clickSound from "../../../assets/sounds/click.mp3"
import mutedIcon from "../../../assets/images/mutedIcon.png"
import axios from '../../../libs/axios.tsx'
import { defaultScroll } from "../../../libs/globalFunctions.tsx";

interface User{
    balance: number
    setMoney: React.Dispatch<React.SetStateAction<number>>;
}

export function Slots(user:User) {
    defaultScroll()
    
    const token = localStorage.getItem('jwt-token');
    const contextData = useContext(userContext);
    const role = contextData.role

    const gameNumber = 2
    const slotSpin = new Audio(slotSpinSound)
    const slotStart = new Audio(slotSpinStart)
    const slotWin = new Audio(slotWinSound)
    const clickStop = new Audio(clickSound)
    const instructionRef = useRef<HTMLDivElement>(null);

    function patchUser(newMoney:number) {
        axios.put(`/users/${contextData.id_user}`, {
            token,
            role,
            balance: `${newMoney}`,
        })
    }

    function postGame(bet:number, win:number) {
        axios.post(`/usergames`, {
            token,
            role,
            id_game: gameNumber,
            id_user: contextData.id_user,
            bet: bet,
            winning: win
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0)}, []
    )
    
    // Columnas correspondientes a la tragamonedas
    const Reels = ["Seven", "Banana", "Watermelon", "Lemon", "BAR", "Bell", "Orange", "Blueberry", "Strawberry"];
    const iconHeight = 79
    const [isActive, setIsActive] = useState(true)
    const [isMuted, setIsMuted] = useState(false)
    const handleToggle = () => {
        setIsMuted(!isMuted)
    }
    const [Win, setWin] = useState("");
    const [error, setError] = useState("");
    const scrollToDiv = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            window.scrollTo(0, ref.current.offsetTop);
        }
    };
    const isScroll = () => scrollToDiv(instructionRef);
    var bet = 50
    var x0:number;
    var z0:number;
    var x1:number;
    var y1:number;
    var z1:number;
    var x2:number;
    var z2:number;


    // Generador de un numero aleatorio mediante parametros, tiene un ERROR que necesita ser corregido y es que la generacion no incluye el minimo pero si el maximo
    function getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const play = (amount:number) => {
        setIsActive(false)
        setWin("")
        bet = amount
        if(user.balance < bet) {
            setError("Insufficient Balance")
            setIsActive(true)
        } else {
            user.setMoney(user.balance - bet)
            patchUser(user.balance - bet)
            if (isMuted == false) {
                slotStart.play()
            }
            SpinX()
        }
    }

    const SpinX = () => {
        setError("")
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
        y1 = (-(3*(-iconHeight*numeroSorteo1) + bgPos1) % 9) + 1
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
        if(isMuted == false) {
            clickStop.play()
        }
        slotSpin.pause()
        slotSpin.currentTime = 0
        if((Reels[x1] == Reels[y1]) && (Reels[z1] == Reels[x1]) && (Reels[z1] == Reels[y1])) {
            setWin(`You win ${bet * 4} credits!`)
            if(isMuted == false) {
                slotWin.play() 
            }
            postGame(bet, bet*4)
            user.setMoney(user.balance + (bet * 4))
            patchUser(user.balance + (bet * 4))
        } else if ((Reels[x2] == Reels[y1]) && (Reels[z0] == Reels[y1]) && (Reels[x2] == Reels[z0])) {
            setWin(`You win ${bet * 2} credits!`)
            if(isMuted == false) {
                slotWin.play() 
            }
            postGame(bet, bet*2)
            user.setMoney(user.balance + (bet * 2))
            patchUser(user.balance + (bet * 2))
        } else if ((Reels[x0] == Reels[y1]) && (Reels[z2] == Reels[y1]) && (Reels[x0] == Reels[z2])) {
            setWin(`You win ${bet * 2} credits!`)
            if(isMuted == false) {
                slotWin.play()
            }
            postGame(bet, bet*2)
            user.setMoney(user.balance + (bet * 2))
            patchUser(user.balance + (bet * 2))
        } else {
            postGame(bet, 0)
        }
        setIsActive(true)
    }

    return(

        <>
            <div className="tragamonedas">
                <GamesSideBar/>
                <button className={isMuted ? "mutedButton mutedEnabled" : "mutedButton"} onClick={handleToggle}><img src={mutedIcon} alt="mutedIcon"/></button>
                <button className="instructionsButtonRef" onClick={isScroll}>Game Instructions</button>

                <div className="slotsBG">
                    <h1 className="textoTragamonedas">SLOT MACHINE</h1>
                    <div className="slots">
                        <div className="reel" id="reel1"></div>
                        <div className="reel" id="reel2"></div>
                        <div className="reel" id="reel3"></div>
                    </div>
                    <div className="buttonsBet">
                        <button className={isActive ? "buttonTragamonedas" : "buttonTragamonedas buttonDisabled"} onClick={() => play(50)} id="boton">Bet 50 Credits</button>
                        <button className={isActive ? "buttonTragamonedas" : "buttonTragamonedas buttonDisabled"} onClick={() => play(150)} id="boton">Bet 150 Credits</button>
                        <button className={isActive ? "buttonTragamonedas" : "buttonTragamonedas buttonDisabled"} onClick={() => play(300)} id="boton">Bet 300 Credits</button>
                    </div>
                    <div className="slotsMessages" ref={instructionRef}>
                        <p className="message">{Win}</p>
                        <p className="message">{error}</p>
                    </div>
                </div>
            </div>
            <div className="gameInstructions">
                <h2 className="gameInstructionTitle">Game Instructions</h2>
                <p className="gameInstructionText"> - You have to choose between 3 different betting options: 50, 150, 300 credits</p>
                <p className="gameInstructionText"> - The only way to win is to get the same figures in LINE or DIAGONALLY.</p>
                <p className="gameInstructionText"> - If the figures are IN LINE, the award is your bet multiplied by four</p>
                <p className="gameInstructionText"> - If the figures are IN DIAGONALLY, the award is your bet multiplied by two</p>
                <p className="gameInstructionText"> - Enjoy the game and good luck!</p>
            </div>
        </>
    

    )

}
