import "./LinkFooter.css";
import { useNavigate } from "react-router-dom";

type LinkFooterProps = {
    titulo: string;
    link: string;
};

const LinkFooter = ({ titulo, link }: LinkFooterProps) => {
    const navigate = useNavigate();
    return (
        <button className="link-footer" onClick={() => navigate(`/${link}`)}>
            <span className="link-footer__text">{titulo}</span>
            <span className="link-footer__underline" />
        </button>
    );
};

export default LinkFooter;