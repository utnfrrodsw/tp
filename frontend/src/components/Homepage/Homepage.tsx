import Navbar from '../Navbar/Navbar.tsx';
import Carousel from '../Carousel/Carousel.tsx';
import Comments from '../Comments/Comments.tsx';
import Footer from '../Footer/Footer';
import { HomePageCard } from './HomePageCards.js';
import { useProtectRoute } from '../../cookie/useProtectRoute.tsx';
function Homepage() {
  const CommentOne = 1;
  const CommentTwo = 2;
  useProtectRoute(['notprestador']);
  // Íconos específicos para cada servicio
  const PlomeroIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 16 16"
    >
      <path
        fill="#fe692a"
        fill-rule="evenodd"
        d="M0 1.75A.75.75 0 0 1 .75 1h6a.75.75 0 0 1 0 1.5H6.5v2.25a.5.5 0 0 0 .5.5h2.25A5.75 5.75 0 0 1 15 11v2.5h.25a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5h.25v-2.25a.5.5 0 0 0-.5-.5H6.75A5.75 5.75 0 0 1 1 5V2.5H.75A.75.75 0 0 1 0 1.75M11 13.5h2.5V11a4.25 4.25 0 0 0-4.25-4.25h-.5v2.5H9a2 2 0 0 1 2 2zm-8.5-11H5v2.25a2 2 0 0 0 2 2h.25v2.5h-.5A4.25 4.25 0 0 1 2.5 5z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const ElectricistaIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 20 20"
    >
      <path
        fill="#fe692a"
        stroke="#fe692a"
        strokeWidth="0.5"
        fill-rule="evenodd"
        d="M15 8.5h-3.813l2.273-5.303A.5.5 0 0 0 13 2.5H8a.5.5 0 0 0-.46.303l-3 7A.5.5 0 0 0 5 10.5h2.474l-2.938 7.314c-.2.497.417.918.807.55l5.024-4.743l4.958-4.241A.5.5 0 0 0 15 8.5Zm-4.571 1h3.217l-3.948 3.378l-3.385 3.195l2.365-5.887a.5.5 0 0 0-.464-.686H5.758l2.572-6h3.912L9.969 8.803a.5.5 0 0 0 .46.697Z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const CarpinteroIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
    >
      <path
        fill="#fe692a"
        d="M15.475 21.3q-.275.275-.637.425t-.763.15q-.4 0-.775-.15t-.65-.425l-1.4-1.4q-.275-.275-.412-.612t-.163-.688q-.025-.35.088-.7t.337-.65l.15-.2L3.1 5.4L7 1.5l12.725 12.725q.275.275.425.638t.15.762q0 .4-.15.775t-.425.65l-4.25 4.25Zm-2.8-5.675l2.825-2.8l-8.5-8.5l-1.3 1.3l6.975 10Zm1.4 4.25L18.3 15.65l-1.4-1.425l-4.25 4.25l1.425 1.4Zm-1.4-4.25l2.825-2.8l-2.825 2.8Z"
      />
    </svg>
  );

  const PintorIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
    >
      <path
        fill="#fe692a"
        d="M11.92 23.494L.794 12.368L10.3 2.86l2.833 2.833l3.274-3.275L21.87 7.88l-3.274 3.275l2.832 2.832l-9.507 9.508Zm3.074-5.903L6.697 9.293l-3.075 3.075l8.298 8.297l3.074-3.074ZM8.111 7.879l8.297 8.298l2.191-2.19l-2.833-2.833l3.275-3.275l-2.633-2.632l-3.274 3.274l-2.833-2.832l-2.19 2.19Z"
      />
    </svg>
  );

  const AlbanilIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="#fe692a"
    >
      <g
        fill="none"
        stroke="#fe692a"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.7"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M12 9v6m4 0v6m0-18v6M3 15h18M3 9h18M8 15v6M8 3v6" />
      </g>
    </svg>
  );

  const CerrajeroIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="55"
      viewBox="0 0 16 16"
      fill="#fe692a"
    >
      <g fill="#fe692a">
        <path d="M9 10a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0z" />
        <path d="M7 0a3 3 0 0 0-3 3v2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h2a3 3 0 0 0-3-3zM4 14V7h8v7z" />
      </g>
    </svg>
  );

  const JardineroIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 20 20"
      fill="#fe692a"
    >
      <g fill="#fe692a">
        <path
          fill-rule="evenodd"
          d="m12.588 2.366l-.071.078a18.36 18.36 0 0 1-.28.3a106.06 106.06 0 0 1-.148-.195c-.308-.4-.568-.694-.847-.929c-.382-.323-.78-.518-1.242-.518c-.25 0-.487.061-.71.17c-.488.236-.85.631-1.333 1.306a26.93 26.93 0 0 0-.12.17c-.092-.09-.197-.198-.32-.327l-.067-.07c-.554-.582-.701-.73-.949-.932c-.234-.191-.445-.32-.705-.384a1.132 1.132 0 0 0-1.357.726A7.405 7.405 0 0 0 4 4.288C4 8.228 6.212 11 10 11s6-2.771 6-6.712a7.38 7.38 0 0 0-.44-2.527a1.128 1.128 0 0 0-1.36-.724c-.262.067-.47.199-.7.395c-.24.202-.375.346-.912.934ZM10 9C7.428 9 6 7.21 6 4.288c0-.18.009-.357.025-.533l.047.048c.408.428.66.672.92.872c.648.496 1.304.689 1.904.003c.108-.123.214-.262.356-.463l.075-.108l.257-.365c.175-.246.322-.427.429-.54a4.9 4.9 0 0 1 .493.569c-.045-.058.55.737.7.907c.602.689 1.266.49 1.899-.01c.25-.2.492-.443.874-.86c.014.159.021.319.021.48C14 7.211 12.572 9 10 9Z"
          clip-rule="evenodd"
        />
        <path d="M9 11a1 1 0 1 1 2 0v6.5a1 1 0 1 1-2 0V11Z" />
        <path
          fill-rule="evenodd"
          d="M11.767 13.015c-2.185 1.834-3.622 4.165-2.438 5.576c1.166 1.39 4.38.628 6.295-.98c1.868-1.567 2.72-3.835 1.556-5.222c-1.164-1.387-3.545-.942-5.413.626Zm-.847 4.328a.184.184 0 0 1-.036-.018l.018.03c.008.006.013.004.018-.012Zm3.418-1.264c-1.107.93-3.014 1.422-3.418 1.264a.32.32 0 0 0 .007-.03c.038-.189.156-.457.348-.769c.404-.656 1.077-1.409 1.778-1.997c1.134-.952 2.339-1.177 2.595-.872c.256.305-.175 1.452-1.31 2.404Z"
          clip-rule="evenodd"
        />
        <path
          fill-rule="evenodd"
          d="M7.932 13.015c2.186 1.834 3.622 4.165 2.438 5.576c-1.166 1.39-4.379.628-6.294-.98c-1.869-1.567-2.72-3.835-1.556-5.222c1.164-1.387 3.544-.942 5.412.626Zm.848 4.328a.183.183 0 0 0 .035-.018l-.018.03c-.008.006-.013.004-.017-.012ZM5.36 16.08c1.108.93 3.015 1.422 3.419 1.264a.307.307 0 0 1-.007-.03c-.038-.189-.156-.457-.348-.769c-.405-.656-1.077-1.409-1.778-1.997c-1.135-.952-2.34-1.177-2.595-.872c-.256.305.175 1.452 1.31 2.404Z"
          clip-rule="evenodd"
        />
      </g>
    </svg>
  );

  const LimpiadorIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="#fe692a"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.7"
        color="currentColor"
      >
        <path d="m21 3l-8 8.5m-3.554-.415c-2.48.952-4.463.789-6.446.003c.5 6.443 3.504 8.92 7.509 9.912c0 0 3.017-2.134 3.452-7.193c.047-.548.07-.821-.043-1.13c-.114-.309-.338-.53-.785-.973c-.736-.728-1.103-1.092-1.54-1.184c-.437-.09-1.007.128-2.147.565" />
        <path d="M4.5 16.446S7 16.93 9.5 15m-1-7.75a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M11 4v.1" />
      </g>
    </svg>
  );

  const ControlPlagasIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
    >
      <path
        fill="#fe692a"
        d="M19 14h2a1 1 0 0 0 0-2h-2v-1a5.15 5.15 0 0 0-.21-1.36A5 5 0 0 0 22 5a1 1 0 0 0-2 0a3 3 0 0 1-2.14 2.87A5 5 0 0 0 16 6.4a2.58 2.58 0 0 0 0-.4a4 4 0 0 0-8 0a2.58 2.58 0 0 0 0 .4a5 5 0 0 0-1.9 1.47A3 3 0 0 1 4 5a1 1 0 0 0-2 0a5 5 0 0 0 3.21 4.64A5.15 5.15 0 0 0 5 11v1H3a1 1 0 0 0 0 2h2v1a7 7 0 0 0 .14 1.38A5 5 0 0 0 2 21a1 1 0 0 0 2 0a3 3 0 0 1 1.81-2.74a7 7 0 0 0 12.38 0A3 3 0 0 1 20 21a1 1 0 0 0 2 0a5 5 0 0 0-3.14-4.62A7 7 0 0 0 19 15Zm-8 5.9A5 5 0 0 1 7 15v-4a3 3 0 0 1 3-3h1ZM10 6a2 2 0 0 1 4 0Zm7 9a5 5 0 0 1-4 4.9V8h1a3 3 0 0 1 3 3Z"
      />
    </svg>
  );

  const serviciosData = [
    { texto: 'Plomero', redirije: 'Plomería', icon: PlomeroIcon },
    { texto: 'Electricista', redirije: 'Electricidad', icon: ElectricistaIcon },
    { texto: 'Carpintero', redirije: 'Carpintería', icon: CarpinteroIcon },
    { texto: 'Pintor', redirije: 'Pintura', icon: PintorIcon },
    { texto: 'Albañil', redirije: 'Construcción', icon: AlbanilIcon },
    { texto: 'Cerrajero', redirije: 'Cerrajería', icon: CerrajeroIcon },
    { texto: 'Jardinero', redirije: 'Jardinería', icon: JardineroIcon },
    {
      texto: 'Limpiador',
      redirije: 'Limpieza Residencial',
      icon: LimpiadorIcon,
    },
    {
      texto: 'Control de Plagas',
      redirije: 'Control de Plagas',
      icon: ControlPlagasIcon,
    },
  ];

  const cards = serviciosData.map((servicio, index) => (
    <HomePageCard
      key={index}
      texto={servicio.texto}
      redirije={servicio.redirije}
      icon={servicio.icon}
    />
  ));

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur ">
          <Navbar />
        </div>

        <div className="w-full">
          <Carousel
            fotos={[
              '/images/carousel1.jpg',
              '/images/carousel2.jpg',
              '/images/carousel.jpg',
            ]}
            titulo="Reformix"
          />
        </div>
      </div>

      <div className="flex flex-col items-center content-center align-center p-11 bg-gradient-white w-full m-0 h-96">
        <h2 className="text-5xl  font-bold text-[#333] m-0 mt-3">
          La solucion de tus <span className="text-naranja-1">problemas</span>
          , <br /> al alcance de un
          <span className="text-naranja-1"> click</span>.
        </h2>
        <img
          className="max-w-2/12 max-h-2/12 mt-auto"
          src="/images/down-arrow.png"
          alt="Flecha para abajo"
        />
      </div>

      <div className="bg-[#4d4d4d] flex flex-col pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mx-8 mt-8 justify-items-center">
          {cards}
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#4d4d4d] to-orange-800">
        <h1 className="mt-0 pt-12 text-[white]} mb-20 text-4xl lg:text-6xl m-17">
          No nos escuches a nosotros, escucha a nuestros{' '}
          <span className="text-naranja-1">clientes.</span>
        </h1>
        <div className="flex flex-col w-full ">
          <div className="self-end  lg:w-5/12 w-10/12 max-h-40 mb-9 mr-7">
            <Comments id={CommentOne} />
          </div>
          <div className="self-start lg:w-5/12 w-10/12 ml-9 max-h-40 mb-5">
            <Comments id={CommentTwo} />
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Homepage;
