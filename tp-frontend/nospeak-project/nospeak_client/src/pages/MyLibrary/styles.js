import styled from 'styled-components';

export const PlaylistBox = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  margin: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: inline-block;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px); 
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
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
    background-color: #1db954; /* Spotify green */
  }
`;
