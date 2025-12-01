import React from 'react';

type ItemTurnoProps = {
  turno: {
    cliente: string;
    fecha: string;
    hora: string;
    estado: string;
    tarea: string;
    avatar: string;
    monto?: number;
  };
  idx: number;
  selected: boolean;
  onSelect: (idx: number) => void;
};

const ItemTurno: React.FC<ItemTurnoProps> = ({
  turno,
  idx,
  selected,
  onSelect,
}) => {
  const handleRowClick = () => {
    onSelect(idx);
  };

  return (
    <tr
      className="border-b hover:bg-gray-50 h-12 sm:h-16 cursor-pointer transition-colors duration-150"
      onClick={handleRowClick}
    >
      {' '}
      {/* Altura responsive + cursor pointer + hover */}
      <td
        className="py-2 sm:py-3 px-2 sm:px-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="relative flex items-center justify-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(idx)}
            className="peer h-4 w-4 sm:h-5 sm:w-5 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500"
          />
          <span className="absolute pointer-events-none inset-0 flex items-center justify-center">
            {selected && (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 20 20"
                fill="none"
                style={{ display: 'block' }}
              >
                <path
                  d="M5 10.5L9 14.5L15 7.5"
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </span>
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-left">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          {' '}
          {/* min-w-0 para permitir truncamiento */}
          <img
            src={turno.avatar}
            alt={turno.cliente}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
          />
          <span
            className="font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] text-xs sm:text-sm"
            title={turno.cliente}
          >
            {turno.cliente}
          </span>
        </div>
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 font-medium text-left hidden sm:table-cell">
        <div
          className="truncate max-w-[100px] text-xs sm:text-sm"
          title={turno.fecha}
        >
          {turno.fecha}
        </div>
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 font-medium text-left whitespace-nowrap hidden sm:table-cell text-xs sm:text-sm">
        {turno.hora}
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 font-medium text-left">
        <div
          className="truncate max-w-[100px] sm:max-w-[200px] text-xs sm:text-sm"
          title={turno.tarea}
        >
          {turno.tarea}
        </div>
        {/* Mostrar fecha y hora en mobile */}
        <div className="sm:hidden text-xs text-gray-500 mt-1">
          {turno.fecha} • {turno.hora}
        </div>
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 font-medium text-left whitespace-nowrap text-xs sm:text-sm">
        {turno.monto ? `$${(turno.monto / 100 / 1.05).toFixed(2)}` : '-'}
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-left">
        <span
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold
            ${
              turno.estado.toLowerCase() === 'pendiente'
                ? 'bg-yellow-100 text-yellow-800'
                : turno.estado.toLowerCase() === 'confirmado'
                ? 'bg-blue-100 text-blue-800'
                : turno.estado.toLowerCase() === 'cancelado'
                ? 'bg-red-100 text-red-800'
                : turno.estado.toLowerCase() === 'completado'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-700'
            }
          `}
        >
          {turno.estado}
        </span>
      </td>
    </tr>
  );
};

export default ItemTurno;
