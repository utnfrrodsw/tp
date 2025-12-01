type SelectionBarProps = {
  selectedCount: number;
  onDeselectAll: () => void;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  fadeOut: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onShowDetails?: () => void;
  children?: React.ReactNode;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  onDeselectAll,
  showMenu,
  setShowMenu,
  fadeOut,
  onConfirm,
  onCancel,
  onComplete,
  onShowDetails,
  children,
}) => (
  <div className={`fixed left-1/2 bottom-8 transform -translate-x-1/2 z-50 flex items-center justify-center ${fadeOut ? 'fade-out' : 'fade-in'}`}>
    <div className="text-white rounded-lg shadow-2xl px-6 py-2 flex items-center gap-4 min-w-[320px] max-w-md" style={{
      background: 'linear-gradient(to right, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0.8))'
    }}>
      <span className="font-semibold whitespace-nowrap">Seleccionados: {selectedCount}</span>
      <div className="w-px h-6 bg-gray-600"></div>
      <div className="relative">
        <button
          className="bg-transparent text-white py-2 rounded transition font-medium hover:underline flex items-center gap-1 whitespace-nowrap cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          Actualizar
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M6 12L10 8L14 12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {showMenu && (
          <div className="absolute bottom-full left-0 mb-2 border border-gray-700 rounded shadow-lg py-2 w-40 z-50" style={{
            background: 'linear-gradient(to right, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0.8))'
          }}>
            <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800" onClick={() => { if (onConfirm) { onConfirm(); } setShowMenu(false); }}>Confirmar</button>
            <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800" onClick={() => { if (onCancel) { onCancel(); } setShowMenu(false); }}>Cancelar</button>
            <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800" onClick={() => { if (onComplete) { onComplete(); } setShowMenu(false); }}>Completar</button>
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          className="text-gray-300 hover:text-white cursor-pointer transition-colors"
          fill="currentColor"
          onClick={onShowDetails}
        >
          <path d="M2 8a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H3Z"/>
        </svg>
        <button
          className="text-gray-300 hover:text-white text-xl font-bold px-2 cursor-pointer transition-colors"
          onClick={onDeselectAll}
          title="Deseleccionar todo"
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default SelectionBar;
