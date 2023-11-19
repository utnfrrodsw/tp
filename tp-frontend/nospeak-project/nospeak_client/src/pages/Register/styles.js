import styled from 'styled-components';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';

const StyledRadio = styled(Radio)`
  &:hover,
  :checked:after {
    color: #ffa130;
  }
`;

const StyledSelect = styled.select`
  appearance: none;
  background-image: none;
  border: 0px;
  display: inline-flex;
  font-size: 1rem;
  font-weight: 400;
  font-family: var(
    --font-family,
    CircularSp,
    CircularSp-Arab,
    CircularSp-Hebr,
    CircularSp-Cyrl,
    CircularSp-Grek,
    CircularSp-Deva,
    var(--fallback-fonts, sans-serif)
  );
  transition: box-shadow 0.1s ease-in-out 0s, color 0.1s ease-in-out 0s;
  inline-size: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  margin: 5px 20px 30px 20px;
  border-radius: var(--border-radius-md, 4px);
  padding-inline: 14px;
  padding-block-start: var(--spacer--2, 8px);
  padding-block-end: var(--spacer--2, 8px);
  min-block-size: var(--control-size-md, 48px);
  background-color: var(--background-base, #000);
  box-shadow: inset 0 0 0 1px var(--essential-subdued, #878787);
  color: white;
  width: 40%;
  height: 20px;

  &:hover {
    outline: white solid;
  }
`;

const DateInput = styled.input`
  appearance: none;
  background-image: none;
  border: 0px;
  display: inline-flex;
  font-size: 1rem;
  font-weight: 400;
  font-family: var(
    --font-family,
    CircularSp,
    CircularSp-Arab,
    CircularSp-Hebr,
    CircularSp-Cyrl,
    CircularSp-Grek,
    CircularSp-Deva,
    var(--fallback-fonts, sans-serif)
  );
  transition: box-shadow 0.1s ease-in-out 0s, color 0.1s ease-in-out 0s;
  inline-size: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  margin: 5px 20px 30px 20px;
  border-radius: var(--border-radius-md, 4px);
  padding-inline: 14px;
  padding-block-start: var(--spacer--2, 8px);
  padding-block-end: var(--spacer--2, 8px);
  background-color: var(--background-base, #000);
  box-shadow: inset 0 0 0 1px var(--essential-subdued, #878787);
  color: white;
  width: 20%;
  height: 48px;
  &:hover {
    outline: white solid;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.9rem;
  margin-top: -10px;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const LoginContainer = styled.div`
  /* Estilos para el contenedor de login */
  display: flex;
  flex-direction: column;

  @media (min-width: 500px) {
    flex-direction: row;
    gap: 10px;
  }
`;

export {
  StyledRadio,
  StyledSelect,
  DateInput,
  ErrorMessage,
  SuccessMessage,
  LoginContainer,
};
