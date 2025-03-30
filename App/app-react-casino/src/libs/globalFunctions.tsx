import { useEffect } from "react";


export function useDefaultScroll() { 
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
};