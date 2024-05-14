import { useState } from "react"

export function Dice(){
    const[data,setData]=useState(0)
    return(
        <>
            <section className="border-[#181529] border-[20px] rounded-[30px] m-40 h-[500px] gap-20 flex flex-row items-center justify-center">
                <div>
                    <input type="text" />
                </div>
                <div className="items-center justify-items-center	">
                    <input type="range" min="0" max="100" value={data} step="1" onChange={(e)=>setData(e.target.value)}/>
                    <h1 id="demo">{data}</h1>
                </div>
            </section>
        </>
    )
}
