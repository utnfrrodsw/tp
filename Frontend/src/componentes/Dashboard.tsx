// src/componentes/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { getAccessToken, getNewAccessToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.config';

const DashboardPage = () => {
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtected = async () => {
      let token = getAccessToken();
      if (!token) {
        token = await getNewAccessToken();
      }

      const response = await fetch(`${API_BASE_URL}/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje(data.message);
      } else {
        setMensaje('Acceso no autorizado');
      }
    };

    fetchProtected();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigate('/favoritos')}>Mis Favoritos</button>
      <p>{mensaje}</p>
    </div>
  );
};

export default DashboardPage;
