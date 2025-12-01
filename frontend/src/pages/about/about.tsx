import styles from './about.module.css';
import Navbar from '../../components/Navbar/Navbar.tsx';
import AboutContainer from '../../components/AboutContainer/index';
const text1 =
  'Somos una empresa dedicada a facilitar el proceso de búsqueda y contratación de profesionales, brindando una plataforma segura y confiable para ambas partes.';
const text2 =
  'Porque creemos en el poder de la tecnología para conectar a las personas y crear oportunidades. Queremos ser el puente que une a los profesionales con las empresas, facilitando el crecimiento y el éxito mutuo.';
const text3 =
  'Nuestros valores se centran en la confianza, la transparencia y la innovación. Nos esforzamos por ofrecer un servicio de calidad, promoviendo relaciones laborales justas y equitativas.';
function About() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.navBarContainer}>
          <Navbar />
        </div>
        <div className={styles.aboutCollections}>
          <AboutContainer
            isAlignedRight
            imageUrl="images/imagen-gente-trabajando.jpg"
            title="¿Quiénes somos?"
            text={text1}
          ></AboutContainer>
          <AboutContainer
            isAlignedRight={false}
            imageUrl="images/imagen-gente-martillo.jpg"
            title="¿Por qué elegimos este camino?"
            text={text2}
          ></AboutContainer>
          <AboutContainer
            isAlignedRight
            imageUrl="images/imagen-manos.jpg"
            title="Nuestros valores"
            text={text3}
          ></AboutContainer>
        </div>
      </div>
    </>
  );
}
export default About;
