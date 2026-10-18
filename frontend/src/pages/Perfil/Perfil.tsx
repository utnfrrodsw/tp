// Perfil.tsx

import { capitalize } from '../App/App';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { BACKEND_URL } from '@/lib/config';
import styles from './Perfil.module.css';
import type { User } from '@/features/users/types';

const Perfil = () => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comienzaEdicion, setComienzaEdicion] = useState<boolean>(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {

        const response = await fetch(`${BACKEND_URL}/api/auth/me`,
          { credentials: 'include' });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data: User = await response.json();
        if (!data) throw new Error('Usuario no encontrado');

        setUsuario(data);
      } catch (e) {
        console.error('Error al cargar perfil:', e);
        setError(e instanceof Error ? e.message : 'Error desconocido');
      }
    };

    cargarPerfil();
  }, []);


  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!usuario) return <p className={styles.loading}>Cargando perfil...</p>;


  return (
    <>{comienzaEdicion ? <Navigate to="/editor-perfil" /> :
      <div className={styles.page}>
        

        <div className={styles.container}>

          {/* ── Tarjeta de perfil ── */}
          <div className={styles.card}>
            <div className={styles.cardFlex}>
              <img
                src={usuario?.urlPicture}
                alt={usuario?.userName}
                className={styles.avatarRoot}
              />

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
            <h2 className={styles.sectionTitle}>Tarjetas asociadas</h2>
            <p className={styles.sectionEmpty}>Todavía no hay tarjetas para mostrar.</p>
          </div>

        </div>

      </div>
    }</>
  );
};

export default Perfil;
