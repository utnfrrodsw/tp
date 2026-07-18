// Perfil.tsx
import Nav from '../Nav/Nav';
import { parseJwt, capitalize } from '../App/App';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import  { Badge } from '@/components/ui/badge';
import styles from './Perfil.module.css';
import  type {UserProfile}  from "../../types/types"; 
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



const Perfil = () => {
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [comienzaEdicion, setComienzaEdicion] = useState<boolean>(false);

  useEffect(() => {
    const cargarPerfil = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token');

    const decoded = parseJwt(token);
    if (!decoded?.id_user) throw new Error('Token inválido');

    const response = await fetch(
      `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/users/verifica/${decoded.id_user}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data: UserProfile = await response.json();
    if (!data) throw new Error('Usuario no encontrado');

    setUsuario(data);
  } catch (e) {
    console.error('Error al cargar perfil:', e);
    setError(e instanceof Error ? e.message : 'Error desconocido');
  }
};

    cargarPerfil();
  }, []);


  if (error)    return <p className={styles.error}>Error: {error}</p>;
  if (!usuario) return <p className={styles.loading}>Cargando perfil...</p>;
  

  return (
    <>{comienzaEdicion ? <Navigate to="/editor-perfil" /> :
    <div className={styles.page}>
      <Nav />

      <div className={styles.container}>

        {/* ── Tarjeta de perfil ── */}
        <div className={styles.card}>
          <div className={styles.cardFlex}>

        {/*<Avatar className={styles.avatarRoot}>*/}
                    <img
            src={usuario?.urlPicture}
            alt={usuario?.userName}
            className={styles.avatarRoot}
          />
        {/*  <AvatarFallback className="bg-[#1A202C] text-white">
            {usuario?.userName?.[0]?.toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar> */}
            


            {/* Datos */}
            <div className={styles.dataStack}>

              {/* Nombre */}
              <div className={styles.fieldBox}>
                <p className={styles.fieldLabel}>NOMBRE DE USUARIO</p>
                <div className={styles.fieldRow}>
                  <span className={styles.nameText}>{usuario.userName}</span>
                  <button className={styles.editButton} onClick={() => setComienzaEdicion(true)}>
                    Editar
                  </button>
                </div>
              </div>

              <div className={styles.fieldBox}>
                <p className={styles.fieldLabel}>CORREO ELECTRÓNICO</p>
                <span className={styles.emailText}>{usuario.email}</span>
                {/*<div className={styles.fieldRow}>
                  <span className={styles.emailText}>{usuario.email}</span>
                  <button className={styles.changeButton}>Cambiar</button>
                </div> */}
              </div>

            <Badge variant="secondary" className="rounded-lg px-3">
              Rol: <span className={styles.roleText}>{capitalize(usuario.rol)}</span>
            </Badge>

            </div>
          </div>
        </div>

        {/* ── Sección tarjetas asociadas ── */}
        <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>...Tarjetas...</h2>
        </div>
      
      <Card className={styles.cardBodyPerfil}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      </div>

    </div>
}</>
  );
};

export default Perfil;
