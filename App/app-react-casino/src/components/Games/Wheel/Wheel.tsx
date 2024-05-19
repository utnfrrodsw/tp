import { useState, ChangeEvent} from 'react';
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
  const [monto, setMonto] = useState(0);
  const [ganarVerde, setRecibeGanar] = useState(0);
  const [ganarBlanco, setRecibeGanarB] = useState(0);
  const [ganarAmarillo, setRecibeGanarA] = useState(0);
  const [ganarVioleta, setRecibeGanarV] = useState(0);
  const [ganarNaranja, setRecibeGanarN] = useState(0);

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

  const montoApuesta = (event: ChangeEvent<HTMLInputElement>) => {
    const monto = parseFloat(event.target.value);
    setMonto(monto);
    calcularVerde(monto);
    calcularBlanco(monto);
    calcularAmarillo(monto);
    calcularVioleta(monto);
    calcularNaranja(monto);
}

const calcularVerde = (monto:number) => {
  const ganarVerde = parseFloat((1.5 * monto).toFixed(2));
  setRecibeGanar(ganarVerde)
}
const calcularBlanco = (monto:number) => {
  const ganarBlancoB = parseFloat((1.7 * monto).toFixed(2));
  setRecibeGanarB(ganarBlancoB)
}
const calcularAmarillo = (monto:number) => {
  const ganarAmarillo = parseFloat((2 * monto).toFixed(2));
  setRecibeGanarA(ganarAmarillo)
}
const calcularVioleta = (monto:number) => {
  const ganarVioleta = parseFloat((3 * monto).toFixed(2));
  setRecibeGanarV(ganarVioleta)
}
const calcularNaranja = (monto:number) => {
  const ganarNaranja = parseFloat((4 * monto).toFixed(2));
  setRecibeGanarN(ganarNaranja)
}

  return (
    <div className="place-items-center border-[color:var(--violeta)] border-[20px] rounded-[30px] mx-[100px] mt-[150px] mb-[50px] h-[700px] gap-0 grid grid-cols-3 grid-rows-2 max-lg:mx-[20px] max-lg:grid-cols-1">
      <div className="col-span-1 row-span-2 bg-[color:var(--violeta)] w-full h-full p-2 flex flex-col justify-center items-center">
          <label className="">Monto de Apuesta</label>
          <input step="0.01" className="bg-[color:var(--blanco)] text-black rounded-[20px] p-2 w-[80%] mb-2" min="0" value={monto} onChange={montoApuesta}/>
          <label className="">Gris <span className='font-bold'>x0.00</span></label>
          <input className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
          <label className="">Verde <span className='font-bold'>x1.50</span></label>
          <input className="text-black rounded-[20px] p-2 w-[80%]" value={ganarVerde} type="number" inputMode="decimal" placeholder="0.00" disabled/>
          <label className="">Blanco <span className='font-bold'>x1.70</span></label>
          <input value={ganarBlanco} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
          <label className="">Amarillo <span className='font-bold'>x2.00</span></label>
          <input value={ganarAmarillo} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
          <label className="">Violeta <span className='font-bold'>x3.00</span></label>
          <input value={ganarVioleta} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
          <label className="">Naranja <span className='font-bold'>x4.00</span></label>
          <input value={ganarNaranja} className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled/>
          <button className="bg-[color:var(--amarillo)] hover:bg-yellow-600 text-[color:var(--negro)] py-3 w-[80%] mt-[20px] text-bold max-lg:mb-[20px] " onClick={startSpin}>APOSTAR</button>
          <p className='py-5'>El color seleccionado es: {selectedColor}</p>
      </div>
      <div className='col-span-2 pt-[300px] text-center'>
        <p className='relative'>|||</p>
        <img src={WheelImage} alt="Wheel" className='wheel'/>
      </div>
    </div>
  );
}