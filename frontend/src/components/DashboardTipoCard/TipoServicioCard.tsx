// Definición de tipos
export type TipoServicioData = {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

type TipoServicioCardProps = {
  tipoServicio: TipoServicioData;
  onToggle: (id: number) => void;
};

function TipoServicioCard({ tipoServicio, onToggle }: TipoServicioCardProps) {
  return (
    <div
      className="flex-grow min-w-fit border rounded-lg px-4 py-3 cursor-pointer transition-all duration-200"
      style={{ 
        backgroundColor: tipoServicio.activo ? 'rgb(255 247 237)' : 'white',
        borderColor: tipoServicio.activo ? 'rgb(249 115 22)' : 'rgb(209 213 219)',
        boxShadow: tipoServicio.activo ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none'
      }}
      onClick={() => onToggle(tipoServicio.id)}
      onMouseEnter={(e) => {
        if (!tipoServicio.activo) {
          (e.target as HTMLElement).style.borderColor = 'rgb(156 163 175)';
        }
      }}
      onMouseLeave={(e) => {
        if (!tipoServicio.activo) {
          (e.target as HTMLElement).style.borderColor = 'rgb(209 213 219)';
        }
      }}
    >
      <div className="flex items-center space-x-3 whitespace-nowrap">
        <div className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center ${
          tipoServicio.activo ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
        }`}>
          {tipoServicio.activo && (
            <svg className="w-3 h-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h4 className="font-medium text-gray-900">{tipoServicio.nombre}</h4>
      </div>
    </div>
  );
}

export default TipoServicioCard;
