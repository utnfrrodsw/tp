import { useState, ChangeEvent, useEffect } from 'react';
import './Wheel.css';
import { GamesSideBar } from '../../GamesSideBar';
import WheelImage from '../../../assets/images/wheel.png';
import WheelPointer from '../../../assets/images/wheelPointer.png';
import axios from '../../Axios/axios';
import wheelSpinSound from "../../../assets/sounds/wheelSpin.mp3";
import wheelWinSound from "../../../assets/sounds/wheelWin.mp3";
import wheelLoseSound from "../../../assets/sounds/wheelLose.mp3";
import mutedIcon from "../../../assets/images/mutedIcon.png";

const colors = [
  'verde', 'gris', 'verde', 'gris', 'amarillo', 'gris', 'verde', 'gris',
  'amarillo', 'gris', 'amarillo', 'gris', 'verde', 'gris', 'violeta', 'gris',
  'verde', 'gris', 'amarillo', 'gris', 'amarillo', 'gris', 'blanco', 'gris',
  'naranja', 'gris', 'verde', 'gris', 'amarillo', 'gris'
];

let rotation: number = 0;
let index: number = 0;

interface User{
  id: string
  balance: number
  onMoney: React.Dispatch<React.SetStateAction<number>>;
}

export function Wheel(user:User) {
  const [monto, setMonto] = useState(0);
  const [ganarVerde, setRecibeGanar] = useState(0);
  const [ganarBlanco, setRecibeGanarB] = useState(0);
  const [ganarAmarillo, setRecibeGanarA] = useState(0);
  const [ganarVioleta, setRecibeGanarV] = useState(0);
  const [ganarNaranja, setRecibeGanarN] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false)

  const handleToggle = () => {
    setIsMuted(!isMuted)
}

  const anglePerSection = 360 / 30;

  const wheelSpin = new Audio(wheelSpinSound);
  const wheelWin = new Audio(wheelWinSound);
  const wheelLose = new Audio(wheelLoseSound);

  function patchUser(newMoney:number) {
    axios.put(`http://localhost:3000/api/v1/users/${user.id}`, {
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
        id_game: 3,
        id_user: user.id,
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const playSound = (sound) => {
    sound.currentTime = 0;
    if (isMuted == false) {
      sound.play();
  }
  }

  const winning = (colour:string) => {
    if (colour === "verde") {
      user.onMoney(user.balance + ganarVerde - monto);
      patchUser(user.balance + ganarVerde - monto);
      postGame(monto, ganarVerde);
      playSound(wheelWin);
    } else if (colour === "blanco") {
      user.onMoney(user.balance + ganarBlanco - monto);
      patchUser(user.balance + ganarBlanco - monto);
      postGame(monto, ganarBlanco);
      playSound(wheelWin);
    } else if (colour === "amarillo") {
      user.onMoney(user.balance + ganarAmarillo - monto);
      patchUser(user.balance + ganarAmarillo - monto);
      postGame(monto, ganarAmarillo);
      playSound(wheelWin);
    } else if (colour === "violeta") {
      user.onMoney(user.balance + ganarVioleta - monto);
      patchUser(user.balance + ganarVioleta - monto);
      postGame(monto, ganarVioleta);
      playSound(wheelWin);
    } else if (colour === "naranja") {
      user.onMoney(user.balance + ganarNaranja - monto);
      patchUser(user.balance + ganarNaranja - monto);
      postGame(monto, ganarNaranja);
      playSound(wheelWin);
    } else if (colour === "gris") {
      postGame(monto, 0);
      playSound(wheelLose);
    } else {
      postGame(monto, 0);
    }
  }

  const startSpin = () => {
    if (user.balance <= 0) {
      setError("Insufficient Balance");
      return;
    }
    if (monto <= 0 || monto > user.balance) {
      setError("Invalid amount");
      return;
    }else{
      setError("")
    }
  
    if (isSpinning) return;

    setIsSpinning(true);
    user.onMoney(user.balance - monto);
    patchUser(user.balance - monto);
    
    const wheelStyle = document.querySelector(".wheel") as HTMLElement;
    const randomIndex = Math.floor(Math.random() * 30);
    const selectedColor = colors[randomIndex];
    rotation += 3 * 360 + anglePerSection * (index - randomIndex);
    wheelStyle.style.transform = `rotate(${rotation}deg)`;
    index = randomIndex;
    
    playSound(wheelSpin);

    setTimeout(() => {
      winning(selectedColor);
      setIsSpinning(false);
    }, 6000);
  }

  const montoApuesta = (event: ChangeEvent<HTMLInputElement>) => {
    const monto = parseFloat(event.target.value);
    const inputValue = event.target.value;
    if (isNaN(monto) || inputValue === "") {
      setMonto(0);
    } else {
    setMonto(monto);
    calcularVerde(monto);
    calcularBlanco(monto);
    calcularAmarillo(monto);
    calcularVioleta(monto);
    calcularNaranja(monto);
  }
}

  const calcularVerde = (monto: number) => {
    const ganarVerde = parseFloat((1.5 * monto).toFixed(2));
    setRecibeGanar(ganarVerde);
  }
  
  const calcularBlanco = (monto: number) => {
    const ganarBlancoB = parseFloat((1.7 * monto).toFixed(2));
    setRecibeGanarB(ganarBlancoB);
  }
  
  const calcularAmarillo = (monto: number) => {
    const ganarAmarillo = parseFloat((2 * monto).toFixed(2));
    setRecibeGanarA(ganarAmarillo);
  }
  
  const calcularVioleta = (monto: number) => {
    const ganarVioleta = parseFloat((3 * monto).toFixed(2));
    setRecibeGanarV(ganarVioleta);
  }
  
  const calcularNaranja = (monto: number) => {
    const ganarNaranja = parseFloat((4 * monto).toFixed(2));
    setRecibeGanarN(ganarNaranja);
  }

  return (
    <>
    <div className="place-items-center border-[color:var(--violeta)] border-[20px] rounded-[30px] mx-[100px] mt-[150px] mb-[50px] h-auto grid grid-cols-3 grid-rows-1 gap-0 max-lg:mx-[20px] max-lg:grid-cols-1">
      <GamesSideBar/>
      <div className="col-span-1 row-span-2 bg-[color:var(--violeta)] w-full h-full p-2 flex flex-col justify-center items-center">
    <button className={isMuted ? "mutedButton mutedEnabled" : "mutedButton"} onClick={handleToggle}><img src={mutedIcon} alt="mutedIcon"/></button>
    <label>Stake amount</label>
    <input step="0.01" className="bg-[color:var(--blanco)] text-black rounded-[20px] p-2 w-full max-w-[80%] mb-2" min="0" value={monto} onChange={montoApuesta} inputMode='numeric'/>
    <label>Gray <span className='font-bold'>x0.00</span></label>
    <input className="text-black rounded-[20px] p-2 w-full max-w-[80%]" type="number" inputMode="decimal" disabled/>
        <label className="">Green <span className='font-bold'>x1.50</span></label>
        <input className="text-black rounded-[20px] p-2 w-[80%]" value={ganarVerde} type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <label className="">White <span className='font-bold'>x1.70</span></label>
        <input value={ganarBlanco} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <label className="">Yellow <span className='font-bold'>x2.00</span></label>
        <input value={ganarAmarillo} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <label className="">Purple <span className='font-bold'>x3.00</span></label>
        <input value={ganarVioleta} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <label className="">Orange <span className='font-bold'>x4.00</span></label>
        <input value={ganarNaranja} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <button 
          className="button bg-[color:var(--amarillo)] hover:bg-yellow-600 text-[color:var(--negro)] py-3 w-[80%] mt-[20px] text-bold max-lg:mb-[20px]" onClick={startSpin} disabled={isSpinning}>BET</button>
        <p className='py-5'>{error}</p>
      </div>
      <div className='relative col-span-2 flex justify-center items-start pt-[30px]'>
        <img className='absolute z-20 top-400 left-1/2 -translate-x-1/2' src={WheelPointer} alt="" />
        <img src={WheelImage} alt="Wheel" className='wheel'/>
      </div>
      </div>
            <div className="gameInstructions">
            <h2 className="gameInstructionTitle">Game Instructions</h2>
            <p className="gameInstructionText"> - You have to enter a bet amount</p>
            <p className="gameInstructionText"> - Certain colors pay more, and others don't pay</p>
            <p className="gameInstructionText"> - Enjoy the game and good luck!</p>
      </div>
      </>
  );
}
