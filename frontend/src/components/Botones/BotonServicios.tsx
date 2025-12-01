type Props = {
  texto: string;
  contactar?: () => void;
  estilosExtras?: string;
};
export default function BotonServicios({
  texto,
  contactar,
  estilosExtras,
}: Props) {
  const handeClick = () => {
    if (contactar) contactar();
    else alert('Botón presionado');
  };
  return (
    <button
      onClick={handeClick}
      className={
        'bg-naranja-1 text-white text-center  py-3 px-5 rounded-md hover:bg-white text-xl font-semibold ' +
        'border-naranja-1 border-2 hover:text-naranja-1 hover:text-primary transition duration-300 ' +
        estilosExtras
      }
    >
      {texto}
    </button>
  );
}
