import styled from "styled-components";
import { LoginInput} from '../Login/styles';
import { DateInput, StyledSelect } from '../Register/styles';

const AccountContainer = styled.div`
    display: flex;
    background-color: #000;
    border-radius: 10px;
    margin: 10px 10px 0px 10px;
    height: 100%;
    align-items: center;
    color: white;
    padding: 10px;

    @media (max-width: 991px) {
        flex-direction: column;
        width: 80%;
        align-self: center;
    }
`;

const StyledH1 = styled.h1`
    padding: 30px;
    font-size: 40px;
    margin: 0px;
    text-align: center;
    @media (max-width: 991px) {
        font-size: 32px;
    }
`;

const AccountInput = styled(LoginInput)`
    display: block;
    margin-block: 0px;
    width: 100%;

    @media (max-width: 991px) {
        width: auto;
    }
`;

const AccountDateInput = styled(DateInput)`
    width: 80px;
    margin-left: 0px;

    @media (max-width: 991px) {
        width: auto;
    }
`;

const AccountStyledSelect = styled(StyledSelect)`
    width: 120px;

    @media (max-width: 991px) {
        width: auto;
    }
`;


const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 65%;
    align-items: center;

    @media (max-width: 991px) {
        width: 100%;
    }
`;

const AccountContainerLeft = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #101010;
    border-radius: 10px;
    height: 100%;
    width: 60%;
    align-items: center;
    justify-content: top;
    color: white;
    padding: 0px;
    margin-right: 10px;

    @media (max-width: 991px) {
        width: 100%;
        margin-right: 0;
        margin-bottom: 10px; 
    }
`;

const AccountContainerRight = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #101010;
    border-radius: 10px;
    height: 100%;
    color: white;
    padding: 0px;
    width: 40%;
    margin: 0 auto;

    @media (max-width: 991px) {
        width: 100%;
    }
`;

export {
    AccountContainer,
    StyledH1,
    AccountInput,
    AccountDateInput,
    AccountStyledSelect,
    AccountContainerLeft,
    AccountContainerRight,
    FormContainer
};
