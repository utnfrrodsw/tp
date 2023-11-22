import React, { useEffect } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../Home/styles.js'
import {AccountContainer, AccountContainerLeft, AccountContainerRight, StyledH1} from './styles'
import { AccountInput, FormContainer} from './styles';
import { Avatar } from '@mui/material';
import {Navigate} from "react-router-dom";
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import {
  Overlay,
  AlertContainer,
  AlertTitle,
  AlertText,
  ButtonContainer,
} from '../../styled-components/Body/styles';
import { 
  StyledButton, 
  StyledButtonSecondary,
} from '../../styled-components/styles';

export default function Account({client}){

    const user = useSelector(state => state.user.user);

    const dispatch = useDispatch();

    const [goToInicio, setGoToInicio] = React.useState(false);

    const isAuthenticated = useSelector(state => state.user.isAuthenticated);

    const [userData, setUserData] = React.useState(null);

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);
    

    useEffect(() => {
      (async () => {
        if (goToInicio) {
          return <Navigate to="/" />;
        }
    
        const fetchUserData = async () => {
          try {
            if(user){
              const response = await client.get(`/api/usuarios/${user.id}`);
              if (response) {
                setUserData(response.data);
              }
            }
          } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
          }
        };
    
        await fetchUserData();
      })();
    
    }, [isAuthenticated, goToInicio, user ? user.id : null]);
    if (!user) {
      return <Navigate to="/login" />;
    }


    const handleLogout = async () => {
      try{
        
        dispatch(logout());
        setGoToInicio(true);
        
        } catch (error) {
          console.error('Error al realizar logout:', error);
        }
      };
    
        
      const handleDeleteAccount = async () => {
        try {
          setDeleteAlertData(true)

        } catch (error) {
          console.error('Error al eliminar la cuenta:', error);
        }
      };
      const handleDeleteConfirm = async () => {
        try {

          
          await client.delete(`/api/usuarios/${user.id}`);

          localStorage.removeItem('token');

          dispatch(logout());
          
          setGoToInicio(true);
        } catch (error) {
          console.error('Error al eliminar la cuenta:', error);
        }
      };

      const handleDeleteCancel = () => {

        setDeleteAlertData(null);
      };

      if (!userData) {
        return <div>Cargando datos del usuario...</div>;
      }

    return (
        <>
            <SpotifyBody>
                <Sidebar/>
                <BodyContainer>
                    <AccountContainer>
                        <AccountContainerLeft>
                          <FormContainer>
                            <StyledH1>Account details</StyledH1>
                            <h3>Email</h3>
                            <AccountInput type="email" placeholder="Email address" value={userData.email}/>
                            <h3>Username</h3>
                            <AccountInput type="text" placeholder="Username" value={userData.nombre}/>
                            <h3>Password</h3>
                            <AccountInput type="password" placeholder="Password"/>
                            <br/>
                            <br/>
                            <StyledButton>Save</StyledButton>
                          </FormContainer>
                        </AccountContainerLeft>
                        <AccountContainerRight>
                            <Avatar style={{width: '250px', height: '250px', margin: '20px'}} />
                              <h1>{user.nombre}</h1>
                              <h3 style={{paddingTop: '5px', textAlign:'center'}}>Do you want to log out?</h3>
                              <StyledButtonSecondary style={{width: '60%'}}  onClick={(e) => handleLogout(e)}>Log out</StyledButtonSecondary>

                              <h3 style={{paddingTop: '20px', textAlign:'center'}}>Do you want to delete your account?</h3>
                              <StyledButtonSecondary style={{width: '60%'}} onClick={handleDeleteAccount}>Delete account</StyledButtonSecondary>
                        </AccountContainerRight>
                    </AccountContainer>
                </BodyContainer>
            </SpotifyBody>
            {deleteAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Eliminar cuenta</AlertTitle>
                    <AlertText>
                        ¿Estás seguro de que desea eliminar su cuenta?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteConfirm()}>
                        Eliminar
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}

        </>  )
}

