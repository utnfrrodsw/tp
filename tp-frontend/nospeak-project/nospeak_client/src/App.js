import './App.css';
import Inicio from './pages/Inicio/Inicio';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Account from './pages/Account/Account';
import Playlist from './pages/Playlist/Playlist';
import Search from './pages/Search/Search';
import PrivateRoute from './components/PrivateRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Library from './pages/MyLibrary/Library';
import { useSelector } from 'react-redux';



export const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA130',
    },
  },
});

const client = axios.create({
  baseURL: 'http://localhost:8000',
});

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isAuthenticated = useSelector(state => state.user.isAuthenticated);


  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route
              path="/login"
              element={
                <Login
                  client={client}
                />
              }
            />
            <Route path="/home" element={<Home client={client}/>} />
            <Route
              path="/register"
              element={
                <Register
                  client={client}
                />
              }
            />
            <Route path="/account" element={<Account client={client}/>} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
