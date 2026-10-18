import styles from "./Footer.module.css";
import LinkFooter from "./LinkFooter/LinkFoter";

// Logo de TechFix (icono con fondo transparente, subido a Cloudinary)
const LOGO_URL = "https://res.cloudinary.com/dll6qurcd/image/upload/v1783738139/teckfixFvicon_qt61a7.png";

const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerTop}>
                {/* Marca: logo + nombre */}
                <div className={styles.brandBlock}>
                    <img src={LOGO_URL} alt="Logo TechFix" className={styles.footerLogo} />
                    <div className={styles.brandText}>
                        <p className={styles.footerBrand}>TechFix</p>
                        <p className={styles.footerTagline}>Reparamos lo que te conecta</p>
                    </div>
                </div>

                {/* Links de navegacion, acostados (en fila) */}
                <nav className={styles.linkContainer}>
                    <LinkFooter titulo="Inicio" link="home" />
                    <LinkFooter titulo="Gestión" link="gestion" />
                    <LinkFooter titulo="Perfil" link="perfil" />
                </nav>
            </div>

            {/* Linea inferior: copyright */}
            <div className={styles.footerBottom}>
                <p className={styles.footerCopy}>© 2026 TechFix. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
