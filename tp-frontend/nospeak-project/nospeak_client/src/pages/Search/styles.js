import React from 'react';
import styled from 'styled-components';

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CategoryBox = styled.div`
  width: 200px;
  height: 200px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 1px solid #ddd;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 25px;

  &:hover {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CategoryName = styled.h3`
  position: absolute;
  top: 10px;
  left: 10px;
  color: #000;
  font-size: 1.6rem;
`;

export { CategoryContainer, CategoryBox, CategoryImage, CategoryName };
