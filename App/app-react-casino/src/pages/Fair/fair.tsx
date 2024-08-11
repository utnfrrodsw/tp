import { useEffect } from "react"

export function Fair(){
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return(
        <>
        <div className="mt-[100px] p-5 flex flex-col gap-5">
        <h1 className="text-2xl font-bold"> How UTimbaN is Provably Fair </h1>
            <div className="bg-[#23222F] p-5 rounded-[10px]"> 
                <p> UTimbaN prides itself on being an honest casino, so it seems fitting that we have taken measures to ensure our games are provably fair. <br/>
                Provably fair means you do not need to “trust” us to be fair; it means you can prove our fairness. <br/>
                Each bet made on UTimbaN can be verified so that you know with certainty the house could have in no way “chosen” the outcome. <br/>
                You will see several tabs above each named after a game we offer. By clicking them you will be able to see how we generate our bet results. <br/> <br/>
                <strong> Thank you for using UTimbaN! </strong> </p>
            </div>
        </div>
        </>
    )
}