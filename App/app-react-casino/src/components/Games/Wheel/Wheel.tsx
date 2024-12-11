import { useState, ChangeEvent } from 'react';
import axios from '../../../libs/axios.tsx'
import { useContext } from "react";
import { userContext } from "../../../App.tsx";
import { defaultScroll } from "../../../libs/globalFunctions.tsx";

import './Wheel.css';
import { GamesSideBar } from '../SideBar/GamesSideBar.tsx';
import WheelImage from '../../../assets/images/wheel.png';
import WheelPointer from '../../../assets/images/wheelPointer.png';

import wheelSpinSound from "../../../assets/sounds/wheelSpin.mp3";
import wheelWinSound from "../../../assets/sounds/wheelWin.mp3";
import wheelLoseSound from "../../../assets/sounds/wheelLose.mp3";
import mutedIcon from "../../../assets/images/mutedIcon.png";


const colors = [
  'green', 'gray', 'green', 'gray', 'yellow', 'gray', 'green', 'gray',
  'yellow', 'gray', 'yellow', 'gray', 'green', 'gray', 'purple', 'gray',
  'green', 'gray', 'yellow', 'gray', 'yellow', 'gray', 'white', 'gray',
  'orange', 'gray', 'green', 'gray', 'yellow', 'gray'
];

let rotation: number = 0;
let index: number = 0;

interface User{
  balance: number
  setMoney: React.Dispatch<React.SetStateAction<number>>;
}

export function Wheel(user:User) {
  defaultScroll()

  const contextData = useContext(userContext);
  const token = localStorage.getItem('jwt-token');
  const role = contextData.role

  const gameNumber = 3
  const [amount, setAmount] = useState(0);
  const [winAmountGreen, setWinAmountGreen] = useState(0);
  const [winAmountWhite, setWinAmountWhite] = useState(0);
  const [winAmountYellow, setWinAmountYellow] = useState(0);
  const [winAmountPurple, setWinAmountPurple] = useState(0);
  const [winAmountOrange, setWinAmountOrange] = useState(0);
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

  const playSound = (sound: HTMLAudioElement) => {
    sound.currentTime = 0;
    if (!isMuted) {
        sound.play();
    }
}

  const winning = (colour:string) => {
    if (colour === "green") {
      user.setMoney(user.balance + winAmountGreen - amount);
      patchUser(user.balance + winAmountGreen - amount);
      postGame(amount, winAmountGreen);
      playSound(wheelWin);
    } else if (colour === "white") {
      user.setMoney(user.balance + winAmountWhite - amount);
      patchUser(user.balance + winAmountWhite - amount);
      postGame(amount, winAmountWhite);
      playSound(wheelWin);
    } else if (colour === "yellow") {
      user.setMoney(user.balance + winAmountYellow - amount);
      patchUser(user.balance + winAmountYellow - amount);
      postGame(amount, winAmountYellow);
      playSound(wheelWin);
    } else if (colour === "purple") {
      user.setMoney(user.balance + winAmountPurple - amount);
      patchUser(user.balance + winAmountPurple - amount);
      postGame(amount, winAmountPurple);
      playSound(wheelWin);
    } else if (colour === "orange") {
      user.setMoney(user.balance + winAmountOrange - amount);
      patchUser(user.balance + winAmountOrange - amount);
      postGame(amount, winAmountOrange);
      playSound(wheelWin);
    } else if (colour === "gray") {
      postGame(amount, 0);
      playSound(wheelLose);
    } else {
      postGame(amount, 0);
    }
  }

  const startSpin = () => {
    if (user.balance <= 0) {
      setError("Insufficient Balance");
      return;
    }
    if (amount <= 0 || amount > user.balance) {
      setError("Invalid amount");
      return;
    }else{
      setError("")
    }
  
    if (isSpinning) return;

    setIsSpinning(true);
    user.setMoney(user.balance - amount);
    patchUser(user.balance - amount);
    
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

  const amountApuesta = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);
    const inputValue = event.target.value;
    if (isNaN(amount) || inputValue === "") {
      setAmount(0);
    } else {
    setAmount(amount);
    calculateGreenAmount(amount);
    calculateWhiteAmount(amount);
    calculateYellowAmount(amount);
    calculatePurpleAmount(amount);
    calculateOrangeAmount(amount);
  }
}

  const calculateGreenAmount = (amount: number) => {
    const winAmountGreen = parseFloat((1.5 * amount).toFixed(2));
    setWinAmountGreen(winAmountGreen);
  }
  
  const calculateWhiteAmount = (amount: number) => {
    const winAmountWhiteB = parseFloat((1.7 * amount).toFixed(2));
    setWinAmountWhite(winAmountWhiteB);
  }
  
  const calculateYellowAmount = (amount: number) => {
    const winAmountYellow = parseFloat((2 * amount).toFixed(2));
    setWinAmountYellow(winAmountYellow);
  }
  
  const calculatePurpleAmount = (amount: number) => {
    const winAmountPurple = parseFloat((3 * amount).toFixed(2));
    setWinAmountPurple(winAmountPurple);
  }
  
  const calculateOrangeAmount = (amount: number) => {
    const winAmountOrange = parseFloat((4 * amount).toFixed(2));
    setWinAmountOrange(winAmountOrange);
  }

  return (
    <>
    <div className="place-items-center border-[color:var(--purple)] border-[20px] rounded-[30px] mx-[100px] mt-[150px] mb-[50px] h-auto grid grid-cols-3 grid-rows-1 gap-0 max-lg:mx-[20px] max-lg:grid-cols-1">
      <GamesSideBar/>
      <div className="col-span-1 row-span-2 bg-[color:var(--purple)] w-full h-full p-2 flex flex-col justify-center items-center">
    <button className={isMuted ? "mutedButton mutedEnabled" : "mutedButton"} onClick={handleToggle}><img src={mutedIcon} alt="mutedIcon"/></button>
    <label>Stake amount</label>
    <input step="0.01" className="bg-[color:var(--white)] text-black rounded-[20px] p-2 w-full max-w-[80%] mb-2" min="0" value={amount} onChange={amountApuesta} inputMode='numeric'/>
    <label>Gray <span className='font-bold'>x0.00</span></label>
    <input className="text-black rounded-[20px] p-2 w-full max-w-[80%]" type="number" inputMode="decimal" disabled/>
        <label className="">Green <span className='font-bold'>x1.50</span></label>
        <input className="text-black rounded-[20px] p-2 w-[80%]" value={winAmountGreen} type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <label className="">White <span className='font-bold'>x1.70</span></label>
        <input value={winAmountWhite} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <label className="">Yellow <span className='font-bold'>x2.00</span></label>
        <input value={winAmountYellow} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <label className="">Purple <span className='font-bold'>x3.00</span></label>
        <input value={winAmountPurple} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <label className="">Orange <span className='font-bold'>x4.00</span></label>
        <input value={winAmountOrange} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
        <button 
          className="button bg-[color:var(--yellow)] hover:bg-yellow-600 text-[color:var(--black)] py-3 w-[80%] mt-[20px] text-bold max-lg:mb-[20px]" onClick={startSpin} disabled={isSpinning}>BET</button>
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
