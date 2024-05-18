import { useState } from 'react';
import './Wheel.css';
import WheelImage from '../../../assets/images/wheel.png';

const colors = [
  'verde', 'gris', 'verde', 'gris', 'amarillo', 'gris', 'verde', 'gris',
  'amarillo', 'gris', 'amarillo', 'gris', 'verde', 'gris', 'violeta', 'gris',
  'verde', 'gris', 'amarillo', 'gris', 'amarillo', 'gris', 'blanco', 'gris',
  'naranja', 'gris', 'verde', 'gris', 'amarillo', 'gris'
];

let rotation: number = 0;
let index: number = 0;

export function Wheel() {
  const [selectedColor, setSelectedColor] = useState<string>("");

  const anglePerSection = 360 / 30;

  const startSpin = () => {
    const wheelStyle = document.querySelector(".wheel") as HTMLElement
    const randomIndex = Math.floor(Math.random() * 30);
    const selectedColor = colors[randomIndex];
    setSelectedColor(selectedColor);
    rotation += 3 * 360 + anglePerSection * (index - randomIndex);
    wheelStyle.style.transform = `rotate(${rotation}deg)`;
    index = randomIndex;
  }

  return (
    <div className="wheel-container pt-[70px]">
      <div className="absolute pt-5 z-10">|||</div>
      <img
        src={WheelImage}
        alt="Wheel"
        className='wheel'
      />
        <button onClick={startSpin}>Girar</button>
        <p className='py-5'>El color seleccionado es: {selectedColor}</p>
    </div>
  );
}