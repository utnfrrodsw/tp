import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Estilos por defecto
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
          },
          // Success
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#ffffff',
              border: '1px solid #059669',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#10b981',
            },
          },
          // Error
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#ffffff',
              border: '1px solid #dc2626',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#ef4444',
            },
          },
          // Loading
          loading: {
            style: {
              background: '#3b82f6',
              color: '#ffffff',
              border: '1px solid #2563eb',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#3b82f6',
            },
          },
          // Custom (info/warning)
          blank: {
            style: {
              background: '#f59e0b',
              color: '#ffffff',
              border: '1px solid #d97706',
            },
          },
        }}
      />
    </>
  );
};

// Utilidad para usar toasts en cualquier lugar
export { toast } from 'react-hot-toast';
