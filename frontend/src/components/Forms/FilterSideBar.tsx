import { useState } from 'react';
import {
  ServiciosForm,
  ServiciosFormProps,
  Filtros,
} from './FormServicios.tsx';
import { SlidersHorizontal } from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface FilterSideBarProps {
  menuItems?: MenuItem;
  tipoServicios: ServiciosFormProps['tipoServicios'];
  zonas: ServiciosFormProps['zonas'];
  filtrosForm?: Filtros;
  onSubmit: (values: {
    servicio: string;
    tarea?: string;
    zona: string;
    ordenarPor: string;
  }) => void;
}

function FilterSideBar({
  tipoServicios,
  zonas,
  filtrosForm,
  onSubmit,
}: FilterSideBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? ' w-full lg:w-20' : 'w-full lg:w-64'
      } flex flex-col lg:min-h-screen`}
    >
      <div className="p-4 border-b border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={
                'bg-white text-naranja-1 text-center py-2 px-4 rounded-md hover:bg-naranja-1 text-xl font-semibold ' +
                'border-naranja-1 border-2 hover:text-white hover:border-naranja-1 transition duration-300  flex flex-row ' +
                'active:bg-white active:text-naranja-1 mx-auto mb-1'
              }
              style={{ outline: 'none' }}
            >
              <SlidersHorizontal className="mr-2" />
              Filtros
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={
                'bg-naranja-1 text-white text-center py-3 px-5 rounded-md hover:bg-white text-xl font-semibold ' +
                'border-naranja-1 border-2 hover:text-naranja-1 hover:border-naranja-1 transition duration-300  flex flex-row ' +
                'active:bg-white active:text-naranja-1 mx-auto'
              }
              style={{ outline: 'none' }}
            >
              <SlidersHorizontal />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 pt-10">
        {!isCollapsed && (
          <ServiciosForm
            tipoServicios={tipoServicios}
            zonas={zonas}
            onSubmit={onSubmit}
            filtrosForm={filtrosForm}
          />
        )}
      </nav>
    </div>
  );
}

export default FilterSideBar;
