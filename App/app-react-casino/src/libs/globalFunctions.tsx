import { useEffect } from "react";


export function defaultScroll() { 
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
}
