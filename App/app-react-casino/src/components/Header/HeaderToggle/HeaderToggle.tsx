import { IoIosArrowBack } from "react-icons/io";
import './HeaderToggle.css'

const HeaderToggle = ({toggle, open}) => {
    return(
        <div onClick={toggle} className={`headerToggle ${open ? "headerToggle-open" : null}`}>
            Profile
            <IoIosArrowBack className={`icon ${open ? "icon-open" : null}`} />
        </div>
        
    )
}

export default HeaderToggle