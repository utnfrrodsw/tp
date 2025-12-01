import { useNavigate } from 'react-router-dom';
type cardProps = {
  texto: string;
  redirije: string;
  icon: React.ReactNode; // Nueva prop para el SVG
};
export function HomePageCard({ texto, redirije, icon }: cardProps) {
  const navigate = useNavigate();
  const handleClick = (servicio: string) => {
    navigate(
      `/servicios?tipoServicio=${servicio}&zona=Todas&orderBy=calificacion`
    );
  };

  return (
    <div
      className={
        'flex flex-col cursor-pointer items-center flex-1 max-w-80 min-w-72 min-h-80 h-auto rounded-3xl bg-[#fff5f2] shadow-[0_0_40px_0_rgba(0,0,0,0.58)] p-5 box-border justify-between ' +
        'hover:scale-102 transition duration-300 ease-in-out hover:bg-orange-200'
      }
      onClick={() => handleClick(redirije)}
    >
      <div className="w-[105px] h-[104px] flex items-center justify-center mt-0 shrink-0">
        {icon}
      </div>
      <h3 className="w-full text-2xl font-bold text-gray-800 text-center my-4 shrink-0">
        {texto}
      </h3>
      <p className="w-9/10 text-base text-gray-600 text-center grow flex items-center justify-center mb-2 leading-relaxed">
        Contratá servicios de {redirije} cerca de tu zona.
      </p>
    </div>
  );
}
