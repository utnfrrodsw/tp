import React from 'react';

type LogoutButtonProps = {
  onLogout: () => void;
  isCollapsed?: boolean;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, isCollapsed }) => (
  <button
    onClick={onLogout}
    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer`}
  >
    <svg 
      className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-200`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ transform: isCollapsed ? 'scale(2.6)' : 'scale(1)' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
    {!isCollapsed && (
      <span>Cerrar Sesión</span>
    )}
  </button>
);

export default LogoutButton;