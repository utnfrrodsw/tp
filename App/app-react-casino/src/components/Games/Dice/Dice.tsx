import { useState, useEffect } from "react";
import './Dice.css';
export function Dice() {
    
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    const [data, setData] = useState(0.0);
    const [monto, setMonto] = useState(0.0);
    const [multi, setMulti] = useState(0.0);
    const [recibeAlGanar, setRecibeAlGanar] = useState(0.0);
    const [mayorMenor, setMayorMenor] = useState(true);

    const calcularMulti = (data:number)=>{
        if(textoBoton == "Menor"){
            const multi = ((1/(data))*100).toFixed(2);
            setMulti(multi)
        }else{
            const multi = ((1/(100-data))*100).toFixed(2);
            setMulti(multi)
        }
    }

    const calcularRecibeAlGanar = (data:number, monto:number) => {
        const recibeAlGanar = (multi * monto).toFixed(2);
        setRecibeAlGanar(recibeAlGanar);
    }

    const montoApuesta = (event) => {
        const monto = parseFloat(event.target.value);
        setMonto(monto);
        calcularRecibeAlGanar(data, monto);
    }
    
    const sliderData = (event) => {
        if(textoBoton == "Menor"){
            const data = parseInt(event.target.value);
            setData(data);
        }else{
            const data = 100 - parseInt(event.target.value);
            setData(data);
        }
        calcularRecibeAlGanar(data, monto);
        calcularMulti(data);
        setSliderColor();
    }

    const setSliderColor = () => {
        const slider = document.querySelector('.slider');
        const thumb = document.querySelector('.slider-thumb');
        const percent = data;
        if(textoBoton == "Menor"){
            const color = `linear-gradient(90deg, var(--rojo) ${percent}%, var(--blanco) ${percent}%)`;
            slider.style.background = color;
            thumb.style.left = `calc(${percent}% - 12px)`;
        }else{
            const color = `linear-gradient(90deg, var(--blanco) ${percent}%, var(--rojo) ${percent}%)`;
            slider.style.background = color;
            thumb.style.right = `calc(${100-percent}% - 12px)`;
        }
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
    }

    const cambiarTexto = () => {
        setMayorMenor(!mayorMenor);
    }
    const textoBoton = mayorMenor ? "Menor" : "Mayor";
    return (
        <>
            <section className="place-items-center border-[color:var(--violeta)] border-[20px] rounded-[30px] mx-[200px] mt-[150px] mb-[50px] h-[500px] gap-0 grid grid-cols-3 grid-rows-2 max-lg:mx-[20px] max-lg:grid-cols-1">
                <div className="col-span-1 row-span-2 bg-[color:var(--violeta)] w-full h-full p-2 flex flex-col justify-center items-center">
                    <label className="">Monto de Apuesta</label>
                    <input step="0.01" className="bg-[color:var(--blanco)] text-black rounded-[20px] p-2 w-[80%] mb-2" min="0" value={monto} onChange={montoApuesta}/>
                    <label className="">Recibe al Ganar</label>
                    <input className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" value={recibeAlGanar} disabled/>
                    <button onClick={generarNumero} className="bg-[color:var(--amarillo)] hover:bg-yellow-600 text-[color:var(--negro)] py-3 w-[80%] mt-[20px] text-bold max-lg:mb-[20px]">APOSTAR</button>
                </div>
                <div className="col-span-2 text-center w-full mt-20">
                    <input className="w-[90%] slider" type="range" min="2" max="98" value={data} step="1" onChange={sliderData}/>
                    <h1 className="text-[30px] font-bold" id="demo">{data}</h1>
                </div>
                <div className="col-span-2 flex justify-center gap-10 flex-row w-[90%] bg-[color:var(--violeta)] p-5 max-lg:block max-lg:justify-center max-lg:w-full max-lg:flex-col max-lg:justify-center max-lg:items-center ">
                    <div>
                        <label><h1>Multiplicador</h1></label>
                        <input className="bg-[color:var(--negro)] bg-[color:var(--negro)] text-[color:var(--blanco)] rounded-[20px] p-2 w-[80%]" type="number" step="0.01" min="1.0102" max="9990" value={multi} onChange={calcularMulti}/>
                    </div>
                    <div>
                        <div className="flex">
                            <label><h1>{textoBoton}</h1></label>
                            <svg className="w-6 hover:cursor-pointer ml-2 hover:rotate-90 transition" onClick={cambiarTexto} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fabc01" d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>
                        </div>
                        <input className="bg-[color:var(--negro)] text-[color:var(--blanco)] rounded-[20px] p-2 w-[80%]" type="number" min="1.0102" max="9990" value={data} />
                    </div>
                    <div>
                        <label><h1>Probabilidad</h1></label>
                        <input className="bg-[color:var(--negro)] text-[color:var(--blanco)] rounded-[20px] p-2 w-[80%]" type="number" min="1.0102" max="9990" value={data} />
                    </div>
                </div>
            </section>
        </>
    )
}
