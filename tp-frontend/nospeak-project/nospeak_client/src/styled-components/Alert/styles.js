import styled from 'styled-components';

export const AlertContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${(props) =>
    props.type === 'success' ? '#1DB954' : '#D32F2F'};
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  font-size: 14px;

  @media (min-width: 768px) {
    bottom: 11px;
    left: 20px;
    width: auto;
    font-size: 16px;
  }
`;

export const CloseButton = styled.div`
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  line-height: 1;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }
`;
