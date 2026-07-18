import styles from "./Footer.module.css";
import robotFooter from "./../../assets/ROBOT_Foot_DdS.png";
import LinkFooter from "./LinkFooter/LinkFoter";



const Footer = () =>{
    return(
    <div className={styles.footerContainer}>
        <div className={styles.footerCaja1}>
            <img src={robotFooter} alt=" logo_Robot" />
        </div>
        <div className={styles.footerCaja2}>
            <div className={styles.linkContainer}>
                <LinkFooter
                    titulo="Inicio"
                    link="home" />
                <LinkFooter
                    titulo="Gestion"
                    link="gestion" />
                <LinkFooter
                    titulo="Perfil"
                    link="perfil"/>
            </div>
        </div>
        <div className={styles.footerCaja3}>
            <div className={styles.contactContainer}>

            </div>
        </div>
    </div>
    )
}
export default Footer;