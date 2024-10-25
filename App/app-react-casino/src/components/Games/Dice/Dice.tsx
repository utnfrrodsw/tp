import { useState, useEffect, ChangeEvent } from "react";
import { GamesSideBar } from "../../GamesSideBar";
import axios from 'axios';
import mutedIcon from "../../../assets/images/mutedIcon.png";
import diceSound from "../../../assets/sounds/dice.mp3";
import './Dice.css';

interface User{
    id: string
    balance: number
    onMoney: React.Dispatch<React.SetStateAction<number>>;
}

export function Dice(user:User) {
    
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    var id = user.id
    const [data, setData] = useState<number>(2);
    const [monto, setMonto] = useState(0);
    const [multi, setMulti] = useState(0);
    const [recibeAlGanar, setRecibeAlGanar] = useState(0);
    const [mayorMenor, setMayorMenor] = useState(true);
    const [playMessage, setPlayMessage] = useState("")
    const [isMuted, setIsMuted] = useState(false)

    const dice = new Audio(diceSound);

    const handleToggle = () => {
      setIsMuted(!isMuted)
    }

    function patchUser(newMoney:number) {
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

    function postGame(bet:number, win:number) {
        axios.post(`http://localhost:3000/api/v1/usergames`, {
            id_game: 1,
            id_user: id,
            bet: bet,
            winning: win
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    const textoBoton = mayorMenor ? "Less" : "More";

    useEffect(() => {
        calcularMulti();
    }, [data, mayorMenor])

    useEffect(() => {
        calcularRecibeAlGanar(monto);
    }, [multi, monto])

    const calcularMulti = ()=>{
        let multi: number
        if(textoBoton == "Less"){
            multi = parseFloat(((100/(data))).toFixed(3));
            
        }else{
            multi = parseFloat(((100/(100-data))).toFixed(3));
        }
        setMulti(multi)
    }

    const calcularRecibeAlGanar = (monto:number) => {
        const recibeAlGanar = parseFloat((multi * monto).toFixed(2));
        setRecibeAlGanar(recibeAlGanar);
    }

    const montoApuesta = (event: ChangeEvent<HTMLInputElement>) => {
        const monto = parseFloat(event.target.value);
        setMonto(monto);
        calcularRecibeAlGanar(monto);
    }
    
    const sliderData = (event: ChangeEvent<HTMLInputElement>) => {
        const nuevaData = parseInt(event.target.value);
        if(textoBoton === "More"){
            setData(100-nuevaData);
        }
        setData(nuevaData)
        setSliderColor(nuevaData);
    }

    const setSliderColor = (percent: number) => {
        const slider = document.querySelector('.slider') as HTMLElement;
        const thumb = document.querySelector('.slider-thumb') as HTMLElement;
        if (textoBoton === "Less") {
            const color = `linear-gradient(90deg, var(--red) ${percent}%, var(--white) ${percent}%)`;
            slider.style.background = color;
            thumb.style.left = `calc(${percent}% - 12px)`;
        }else{
            const color = `linear-gradient(90deg, var(--white) ${percent}%, var(--red) ${percent}%)`;
            slider.style.background = color;
            thumb.style.left = `calc(% - 12px)`;  
        }
    }

    const playSound = (sound) => {
        sound.currentTime = 0;
        if (isMuted == false) {
          sound.play();
      }
    }

    const generarNumero = () => {
        const min = 2;
        const max = 98;
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (user.balance > monto && monto != 0) {
            playSound(dice)
            if (textoBoton == "Less" && random <= data){
                setPlayMessage(`The number is: ${random}, You Win ${recibeAlGanar}`)
                patchUser(user.balance - monto + Math.round(recibeAlGanar))
                user.onMoney(user.balance - monto + Math.round(recibeAlGanar))
                postGame(monto, Math.round(recibeAlGanar))
            }if(textoBoton == "Less" && random >= data){
                setPlayMessage(`The number is: ${random}, You Lose ${monto}`)
                patchUser(user.balance - monto)
                user.onMoney(user.balance - monto)
                postGame(monto, 0)
            }
            if(textoBoton == "More" && random >= data) {
                setPlayMessage(`The number is: ${random}, You Win ${recibeAlGanar}`)
                patchUser(user.balance - monto + Math.round(recibeAlGanar))
                user.onMoney(user.balance - monto + Math.round(recibeAlGanar))
                postGame(monto, Math.round(recibeAlGanar))
            }if(textoBoton == "More" && random <= data){
                setPlayMessage(`The number is: ${random}, You Lose ${monto}`)
                patchUser(user.balance - monto)
                user.onMoney(user.balance - monto)
                postGame(monto, 0)

                
            }
        } else {
            setPlayMessage(`Fail bet.`)
        }
    }

    const cambiarTexto = () => {
        setMayorMenor(!mayorMenor);
    }
    return (
        <>
            <GamesSideBar/>
            <section className="place-items-center border-[color:var(--purple)] border-[20px] rounded-[30px] mx-[200px] mt-[150px] mb-[50px] h-[500px] gap-0 grid grid-cols-3 grid-rows-2 max-lg:mx-[20px] max-lg:grid-cols-1 max-lg:mx-[10px] max-lg:h-auto">
                <div className="col-span-1 row-span-2 bg-[color:var(--purple)] w-full h-full p-2 flex flex-col justify-center items-center">
                    <label className="">Bet amount</label>
                    <input step="0.01" className="bg-[color:var(--white)] text-black rounded-[20px] p-2 w-[80%] mb-2" min="0" value={monto} onChange={montoApuesta}/>
                    <label className="">Win amount</label>
                    <input className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" value={recibeAlGanar} disabled/>
                    <button onClick={generarNumero} className="bg-[color:var(--yellow)] hover:bg-yellow-600 text-[color:var(--black)] py-3 w-[80%] mt-[20px] text-bold max-lg:mb-[20px]">PLAY</button>
                    <p className="winningMessage">{playMessage}</p>
                    <button className={isMuted ? "mutedButton mutedEnabled" : "mutedButton"} onClick={handleToggle}><img src={mutedIcon} alt="mutedIcon"/></button>
                </div>
                <div className="col-span-2 text-center w-full mt-20 max-lg:mb-10">
                    <input className="w-[90%] slider" type="range" min="2" max="98" value={data} step="1" onChange={sliderData}/>
                    <h1 className="text-[30px] font-bold" id="demo">{data}</h1>
                </div>
                <div className="col-span-2 flex justify-center gap-10 flex-row w-[90%] bg-[color:var(--purple)] p-5 max-lg:block max-lg:justify-center max-lg:w-full max-lg:flex-col max-lg:justify-center max-lg:items-center ">
                    <div>
                        <label><h1>Multiplier</h1></label>
                        <input className="bg-[color:var(--black)] bg-[color:var(--black)] text-[color:var(--white)] rounded-[20px] p-2 w-[80%]" type="number" step="0.01" min="1.0102" max="9990" value={multi} onChange={calcularMulti}/>
                    </div>
                    <div>
                        <div className="flex">
                            <label><h1>{textoBoton}</h1></label>
                            <svg className="w-6 hover:cursor-pointer ml-2 hover:rotate-90 transition" onClick={cambiarTexto} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fabc01" d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>
                        </div>
                        <input className="bg-[color:var(--black)] text-[color:var(--white)] rounded-[20px] p-2 w-[80%]" type="number" min="1.0102" max="9990" value={data} />
                    </div>
                    <div>
                        <label><h1>Probability</h1></label>
                        <input className="bg-[color:var(--black)] text-[color:var(--white)] rounded-[20px] p-2 w-[80%]" type="number" min="1.0102" max="9990" value={data} />
                    </div>
                </div>
            </section>
            <div className="gameInstructions">
                <h2 className="gameInstructionTitle">Game Instructions</h2>
                <p className="gameInstructionText"> - You have to enter a bet amount</p>
                <p className="gameInstructionText"> - You need to choose which side of the "Less or More" dice and what percentage you want to play with</p>
                <p className="gameInstructionText"> - The RED side is your betting side</p>
                <p className="gameInstructionText"> - With low percentage the reward will be bigger.</p>
                <p className="gameInstructionText"> - Enjoy the game and good luck!</p>
            </div>
        </>
    )
}
