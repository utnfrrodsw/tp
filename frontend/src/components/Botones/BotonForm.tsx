type Props = {
  texto: string;
  accion?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tipo: 'submit' | 'reset' | 'button';
};
export default function BotonForm({ texto, accion, tipo }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (accion) accion(event);
  };
  return (
    <button
      onClick={handleClick}
      className={
        'bg-naranja-1 border-2 border-naranja-1 text-white text-center py-1 px-4 rounded-md hover:bg-white ' +
        'hover:border-naranja-1 hover:border-2 hover:text-naranja-1 hover:text-primary transition-duration-300 ' +
        'box-border'
      }
      type={tipo}
    >
      {texto}
    </button>
  );
}
