import React from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../Home/styles.js'
import {AccountContainer, AccountContainerLeft, AccountContainerRight, StyledH1} from './styles'
import { AccountInput, AccountButton} from './styles';
import { Avatar } from '@mui/material';
import {Navigate} from "react-router-dom";
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import { logout } from '../../redux/slices/userSlice';

export default function Account({client}){

    const user = useSelector(state => state.user.user);

    const dispatch = useDispatch();

    const [goToInicio, setGoToInicio] = React.useState(false);

    const isAuthenticated = useSelector(state => state.user.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (goToInicio) {
        return <Navigate to="/" />;
    }

    const handleLogout = async () => {
        try {
          const token = localStorage.getItem('token');
          
          if (token) {
            client.defaults.headers.common['Authorization'] = `Token ${token}`;
            await client.post('/nospeak-app/api/logout/');
        }
        
        dispatch(logout());
        setGoToInicio(true);
        
        } catch (error) {
          console.error('Error al realizar logout:', error);
        }
      };
    
        
      const handleDeleteAccount = async () => {
        try {
          const token = localStorage.getItem('token');
      
          if (token) {
            client.defaults.headers.common['Authorization'] = `Token ${token}`;
            await client.delete(`/nospeak-app/api/usuarios/${user.id}/`);
          }
      
          dispatch(logout());
          setGoToInicio(true);
        } catch (error) {
          console.error('Error al eliminar la cuenta:', error);
        }
      };

    return (
        <>
            <SpotifyBody>
                <Sidebar/>
                <BodyContainer>
                    <AccountContainer>
                        <AccountContainerLeft>
                            <StyledH1>Account details</StyledH1>
                            <h3>Email</h3>
                            <AccountInput type="email" placeholder="Email address"/>
                            <h3>Username</h3>
                            <AccountInput type="text" placeholder="Username" value={user.username}/>
                            <h3>Password</h3>
                            <AccountInput type="password" placeholder="Password" />
                            <br/>
                            <br/>
                            <AccountButton>Save</AccountButton>
                        </AccountContainerLeft>
                        <AccountContainerRight>
                            <Avatar style={{width: '250px', height: '250px', margin: '20px'}} />
                            <h1>{user.username}</h1>
                            <h3 style={{paddingTop: '20px'}}>Do you want to log out?</h3>
                            <AccountButton style={{backgroundColor: 'grey'}} onClick={(e) => handleLogout(e)}>Log out</AccountButton>

                            <h3 style={{paddingTop: '20px'}}>Do you want to delete your account?</h3>
                            <AccountButton style={{backgroundColor: 'grey'}} onClick={handleDeleteAccount}>Delete account</AccountButton>
                        </AccountContainerRight>
                    </AccountContainer>
                </BodyContainer>
            </SpotifyBody>

        </>  )
}

