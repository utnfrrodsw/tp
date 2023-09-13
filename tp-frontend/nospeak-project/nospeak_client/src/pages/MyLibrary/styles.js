import styled from 'styled-components';

export const PlaylistBox = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  margin: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: inline-block;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const PlaylistName = styled.h3`
  margin: 10px 0 5px;
  color: #fff; /* Text color */
`;

export const PlaylistDescription = styled.p`
  color: #ddd; /* Text color */
  margin: 0;
`;

export const PlaylistImage = styled.img`
  max-width: 100%;
  height: 200px;
  width: 200px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

export const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const NavItem = styled.div`
  padding: 8px 15px;
  margin-right: 10px;
  cursor: pointer;
  background-color: transparent;
  color: #fff; /* White text color */
  border-radius: 4px;
  position: relative;
  transition: transform 0.3s ease; /* Add smooth transition */

  &:hover {
    transform: translateY(-3px) scale(1.05); /* Move up and slightly grow on hover */
  }

  &::after {
    content: '';
    display: ${({ active }) => (active ? 'block' : 'none')};
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ffa130;
  }
`;

export const ArtistGrid = styled(PlaylistGrid)`
  grid-template-columns: repeat(
    auto-fill,
    minmax(150px, 1fr)
  ); // Adjust column width as needed
  gap: 30px;
`;

export const ArtistBox = styled.div`
  display: flex; /* Usamos flexbox para centrar verticalmente la imagen */
  flex-direction: column; /* Alinear elementos verticalmente */
  align-items: center; /* Centrar horizontalmente la imagen */
  text-align: center;
  height: 250px; /* Establece la altura fija que desees */
`;

export const ArtistImage = styled.img`
  max-width: 100%;
  max-height: 120px; /* Establece la altura máxima que desees */
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const ArtistName = styled.p`
  color: #fff;
  margin-top: 5px;
`;

export const ComboBoxContainer = styled.div`
  position: relative;
  display: inline-block;
  color: #000;
  width: 125px;
`;

export const ComboBoxOptions = styled.div`
  position: absolute;
  top: calc(-105px);
  left: 0;
  width: 100%; /* Asegura que el ancho sea igual al del ComboBoxContainer */
  background-color: rgba(0, 0, 0, 0.3);
  /* border: 1px solid #ddd; */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

export const ComboBoxOption = styled.div`
  padding: 10px 20px 10px 10px; /* Agrega padding izquierdo */
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  width: calc(100%); /* Ajusta el ancho restando el padding */
  transition: background-color 0.2s, color 0.2s;
  box-sizing: border-box; /* Evita que el padding afecte el ancho total */

  &:hover {
    background-color: #f5f5f5;
    color: #222;
  }
`;

export const TableContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 70%;
  width: 98%;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 10px;
`;
