import '../../index.css';
import { Link } from 'react-router-dom';


function LogoName(){

    return(
        <>
            <Link to="/">
                <div className="flex items-center justify-center space-x-2 bg-neutral-50 ">
                    <div className="min-w-10 w-14  " >
                        <img src="/images/logo.png" alt="Logo" className=" " />
                    </div>
                    <b className="text-(--color-naranja-1) text-3xl font-semibold">
                        Reformix
                    </b>
                    
                </div>
            </Link>
        </>
    )

}

export default LogoName