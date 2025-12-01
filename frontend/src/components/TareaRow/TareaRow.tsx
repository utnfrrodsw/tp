import React from 'react';

type Tarea = {
  id: number;
  descripcion: string;
  tipoServicioId: number;
  seleccionada: boolean;
  precio: number;
  duracion?: number;
};

type TipoServicioData = {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

type TareaRowProps = {
  tarea: Tarea;
  tipoServicio: TipoServicioData | undefined;
  onTareaChange: (
    id: number,
    field: 'seleccionada' | 'precio',
    value: boolean | number
  ) => void;
  onActivateDeactivate: (id: number, activate: boolean) => void;
  onPriceUpdate: (id: number, precio: number) => void;
};

const TareaRow: React.FC<TareaRowProps> = ({
  tarea,
  tipoServicio,
  onTareaChange,
  onActivateDeactivate,
  onPriceUpdate,
}) => {
  return (
    <tr
      key={tarea.id}
      className={`transition-all duration-200 ${
        tarea.seleccionada ? 'bg-orange-50' : 'hover:bg-gray-50'
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onActivateDeactivate(tarea.id, !tarea.seleccionada)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tarea.seleccionada
              ? 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
              : 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
          }`}
        >
          {tarea.seleccionada ? 'Desactivar' : 'Activar'}
        </button>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="text-sm font-medium text-gray-900 text-left">
          {tarea.descripcion}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <div className="text-sm font-medium text-gray-900 text-left">
          {tipoServicio?.nombre}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="100"
            value={tarea.precio}
            placeholder={
              tarea.seleccionada ? 'Presiona Enter para actualizar' : 'Precio'
            }
            onChange={(e) => {
              onTareaChange(tarea.id, 'precio', parseInt(e.target.value) || 0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tarea.seleccionada) {
                // Si la tarea está activa y presiona Enter, actualizar el precio
                onPriceUpdate(tarea.id, tarea.precio);
              }
            }}
            className={`w-24 px-2 py-1 text-sm border border-gray-300 bg-white text-gray-900 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-300 transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              tarea.seleccionada
                ? 'placeholder:text-xs placeholder:text-blue-400'
                : 'placeholder:text-gray-400'
            }`}
          />
        </div>
      </td>
    </tr>
  );
};

export default TareaRow;
export type { Tarea, TipoServicioData, TareaRowProps };
