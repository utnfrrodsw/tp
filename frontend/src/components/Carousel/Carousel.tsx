import { useState, useEffect } from 'react';

type Props = {
  fotos: string[];
  titulo: string | undefined;
};

function Carousel({ fotos, titulo }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex < fotos.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [fotos.length]);

  return (
    <div className="relative flex items-center justify-center w-full h-[80vh] m-0">
      <img
        className="w-full h-full object-cover z-0 brightness-50"
        src={fotos[index]}
        alt="Foto Trabajador"
      />
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white  text-center z-10 font-bold  text-4xl md:text-6xl lg:text-7xl">
        {titulo}
      </h1>
    </div>
  );
}

export default Carousel;
