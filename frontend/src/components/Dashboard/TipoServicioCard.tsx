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
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 flex-shrink-0 ${
        tipoServicio.activo 
          ? 'border-orange-500 bg-orange-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      style={{ flexBasis: 'auto', width: 'fit-content' }}
      onClick={() => onToggle(tipoServicio.id)}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
          tipoServicio.activo ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
        }`}>
          {tipoServicio.activo && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{tipoServicio.nombre}</h4>
          <p className="text-sm text-gray-500 mt-1">{tipoServicio.descripcion}</p>
        </div>
      </div>
    </div>
  );
}

export default TipoServicioCard;
