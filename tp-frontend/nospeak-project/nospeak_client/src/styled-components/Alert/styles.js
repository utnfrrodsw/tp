import styled from 'styled-components';

export const AlertContainer = styled.div`
  position: fixed;
  top: 11px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
  background-color: ${(props) =>
    props.type === 'success' ? '#43A047' : '#D32F2F'};
  color: white;
  border-radius: 8px; /* Redondea los bordes */
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const CloseButton = styled.div`
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  line-height: 1;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2); /* Agranda la cruz al pasar el ratón */
  }
`;
