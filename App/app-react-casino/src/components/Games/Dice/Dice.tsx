import { useState } from "react"

export function Dice(){
    const[data,setData]=useState(0)
    return(
        <>
            <section className="place-items-center border-[color:var(--violeta)] border-[20px] rounded-[30px] mx-[200px] my-[100px] h-[500px] gap-0 grid grid-cols-3 grid-rows-2">
                <div className="col-span-1 row-span-2 bg-[color:var(--violeta)] w-full h-full p-2">
                    <div className="pb-5">
                        <label className="">Monto de Apuesta</label>
                        <input className="text-black rounded-[20px] p-2 w-[80%]" inputMode="decimal" placeholder="0.00" type="number"  min="0" />
                    </div>
                        <label className="">Recibe al Ganar</label>
                        <input className="text-black rounded-[20px] p-2 w-[80%]" type="number" inputMode="decimal" placeholder="0.00" disabled />
                    <button className="bg-[color:var(--amarillo)] text-[color:var(--negro)] py-3 w-[80%] mt-[20px] text-bold">APOSTAR</button>
                </div>
                <div className="col-span-2 text-center w-full">
                        <input className="w-[90%] " type="range" min="2" max="98" value={data} step="1" onChange={(e)=>setData(e.target.value)}/>
                        <h1 id="demo">{data}</h1>
                </div>
                <div className="col-span-2 flex justify-between w-[90%] bg-[color:var(--violeta)] p-5">
                    <div>
                        <label>Multiplicador</label>
                        <input className="bg-[color:var(--negro)]" type="number" step="0.01" min="1.0102" max="9990" value={(1/data)*100}/>
                    </div>
                    <div>
                        <label>Menor</label>
                        <input className="bg-[color:var(--negro)]" type="number" min="1.0102" max="9990" value={data} />
                    </div>
                    <div>
                        <label>Probabilidad</label>
                        <input className="bg-[color:var(--negro)]" type="number" min="1.0102" max="9990" value={data} />
                    </div>
                </div>
            </section>
        </>
    )
}
