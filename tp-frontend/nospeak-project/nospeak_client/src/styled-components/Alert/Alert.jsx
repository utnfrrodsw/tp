import React, { useState, useEffect } from 'react';
import { AlertContainer, CloseButton } from './styles'; // Importa los estilos de styled-components

const Alert = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return visible ? (
    <AlertContainer type={type}>
      <span>{message}</span>
      <CloseButton onClick={onClose}>×</CloseButton> {/* Utiliza la cruz mejorada */}
    </AlertContainer>
  ) : null;
};

export default Alert;
