import React, { useState } from "react";
import './Dice.css';

export function Dice() {
    const [data, setData] = useState(0);
    const [monto, setMonto] = useState(0);
    const [multi, setMulti] = useState(0);
    const [recibeAlGanar, setRecibeAlGanar] = useState(0);

    const calcularMulti = (data)=>{
        const multi = ((1/data)*100).toFixed(2);
        setMulti(multi)
    }

    const calcularRecibeAlGanar = (data, monto) => {
        const recibeAlGanar = (((1 / data) * 100) * monto).toFixed(2);
        setRecibeAlGanar(recibeAlGanar);
    }

    const montoApuesta = (event) => {
        const monto = parseFloat(event.target.value);
        setMonto(monto);
        calcularRecibeAlGanar(data, monto);
    }
    
    const sliderData = (event) => {
        const data = parseInt(event.target.value);
        setData(data);
        calcularRecibeAlGanar(data, monto);
        calcularMulti(data);
    
    }

    const generarNumero = () => {
        const min = 2;
        const max = 98;
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (random <= data){
            alert("SALIO: " + random + ", GANASTE FLACO SEGUI APOSTANDO QUE HACE BIEN AL CORAZON")
        }else {
            alert("SALIO: " + random + ", NO FLACO PERDISTE LA HERENCIA DE LA NONA")
        }

    return (
        <>
            <section className="place-items-center border-[color:var(--violeta)] border-[20px] rounded-[30px] mx-[200px] my-[100px] h-[500px] gap-0 grid grid-cols-3 grid-rows-2">
                <div className="col-span-1 row-span-2 bg-[color:var(--violeta)] w-full h-full p-2">
                    <div className="pb-5">
                        <label className="">Monto de Apuesta</label>
                        <input step="0.01" className="bg-[color:var(--blanco)] text-black rounded-[20px] p-2 w-[80%]" min="0" value={monto} onChange={montoApuesta}/>
                    </div>
                    <label className="">Recibe al Ganar</label>
                    <input className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" value={recibeAlGanar} disabled/>
                    <button onClick={generarNumero} className="bg-[color:var(--amarillo)] text-[color:var(--negro)] py-3 w-[80%] mt-[20px] text-bold">APOSTAR</button>
                </div>
                <div className="col-span-2 text-center w-full">
                    <input className="w-[90%] slider" type="range" min="2" max="98" value={data} step="1" onChange={sliderData}/>
                    <h1 id="demo">{data}</h1>
                </div>
                <div className="col-span-2 flex justify-between w-[90%] bg-[color:var(--violeta)] p-5">
                    <div>
                        <label><h1>Multiplicador</h1></label>
                        <input className="bg-[color:var(--negro)]" type="number" step="0.01" min="1.0102" max="9990" value={multi} />
                    </div>
                    <div>
                        <label><h1>Menor</h1></label>
                        <input className="bg-[color:var(--negro)]" type="number" min="1.0102" max="9990" value={data} />
                    </div>
                    <div>
                        <label><h1>Probabilidad</h1></label>
                        <input className="bg-[color:var(--negro)]" type="number" min="1.0102" max="9990" value={data} />
                    </div>
                </div>
            </section>
        </>
    );
}