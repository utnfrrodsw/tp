import { useState } from 'react';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  Name: string;
  options: Option[];
  setOptions: (value: string) => void;
  setPage?: (page: number) => void;
  value?: string;
};

// haciendo una funcion en la cual le paso la funcion para desp poder saber el valor que eligio en la variable y ademas pasar las opciones.
function CustomSelect({ Name, options, setOptions, setPage, value }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValueOrder, setSelectedValueOrder] = useState<string>(
    value || ''
  );

  const handleSelect = (value: string) => {
    if (value !== '') {
      setOptions(value);
      setSelectedValueOrder(value);
      if (setPage) setPage(1);
      setIsOpen(false);
    }
  };

  // Buscar el valor selecionado para poner en el boton sino va el predefinido
  const getDisplayText = () => {
    const selected = options.find(
      (opt: Option) => opt.value === selectedValueOrder
    );
    return selected ? selected.label : Name;
  };

  return (
    <div className="relative inline-block w-full">
      {/* Select personalizado que simula el original */}
      <button
        type="button"
        className="border border-orange-500 bg-white text-orange-500 hover:shadow-2xl rounded-3xl px-4 py-2 text-left min-w-40 flex justify-between items-center w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getDisplayText()}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown con fondo personalizable */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            {options.map((option: Option, index: number) => (
              <button
                key={index}
                type="button"
                disabled={option.disabled}
                className={`
                  w-full text-left px-4 py-3 transition-all duration-200 text-sm lg:text-1xl
                  ${
                    option.disabled
                      ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 hover:text-orange-600'
                  }
                  ${
                    selectedValueOrder === option.value
                      ? 'bg-orange-100 text-orange-600 font-medium'
                      : ''
                  }
                  ${index === 0 ? 'border-b border-gray-100' : ''}
                `}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* cerrar al hacer click fuera */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default CustomSelect;
