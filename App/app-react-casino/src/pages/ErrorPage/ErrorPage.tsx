import { useEffect } from "react"

export function ErrorPage(){

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])


    return(
        <>
        <div className=" mt-[150px]">
        <p> error </p>
        <p> error </p>
        <p> error </p>
        <p> error </p>
        <p> error </p>
        <p> error </p>
        <p> error </p>
        <p> error </p>
        <p> error </p>
        </div>
        </>
    )
}