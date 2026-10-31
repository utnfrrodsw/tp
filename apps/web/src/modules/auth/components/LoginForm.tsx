import React, { useState } from 'react';
import { iniciarSesionRequest } from '../services/authService';
import './LoginForm.scss';

// Tipos de  roles
export type UsuarioRol = 'admin' | 'empresa' | 'cliente';

export interface UsuarioAutenticado { //Un usuario autenticado tiene estas cuatro propiedades.
  id: number;
  nombre: string;
  role: UsuarioRol; 
  token: string;
}

interface PropiedadesFormularioLogin {
  alIniciarSesion?: (usuario: UsuarioAutenticado) => void;
  alSolicitarRegistro?: () => void;
}


// Función para mapear el rol del usuario recibido del backend a los roles de la app
export const convertirRolDeBackend = (rol: string): UsuarioRol | null => {
  switch (rol.trim().toLowerCase()) {
    case 'administrador':
      return 'admin';
    case 'empresa':
      return 'empresa';
    case 'cliente':
      return 'cliente';
    default:
      return null;
  }
};

export const FormularioLogin: React.FC<PropiedadesFormularioLogin> = ({
  alIniciarSesion,
  alSolicitarRegistro,
}) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setMensajeError('');

    try {
      const respuesta = await iniciarSesionRequest(correo.trim(), contrasena); // Llamada a la función de iniciarSesionRequest para autenticar al usuario
      const usuario = respuesta.user;
      const token = respuesta.token;

      const rol = convertirRolDeBackend(usuario.rol);

      if (!rol) { //Si no tengo rol valido:
        setMensajeError('Rol de usuario desconocido');
        return;
      }

      alIniciarSesion?.({
        id: usuario.id,
        nombre: usuario.nombre,
        role: rol,
        token: token,
      });
    } catch (errorInicioSesion) {
      if (errorInicioSesion instanceof Error) {
        setMensajeError(errorInicioSesion.message);
      } else {
        setMensajeError('No se pudo iniciar sesión');
      }
    }
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h2 className="form-title">INICIAR SESIÓN</h2>

      <p className="form-subtitle">
        ¡Bienvenido de nuevo! Ingresa tus datos.
      </p>

      <div className="input-group">
        <label>Correo Electrónico</label>

        <input
          className="form-input"
          type="text"
          placeholder="Tu correo o usuario"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)} // Llamada a la función setCorreo para actualizar el estado del correo
          required
        />
      </div>

      <div className="input-group">
        <label>Contraseña</label>

        <input
          className="form-input"
          type="password"
          placeholder="••••••••"
          value={contrasena}
          onChange={(evento) => setContrasena(evento.target.value)} // Llamada a la función setContrasena para actualizar el estado de la contraseña
          required
        />
      </div>

      {mensajeError && (
        <p className="error-text">{mensajeError}</p>
      )}

      <button className="primary-button" type="submit">
        INGRESAR AL SISTEMA
      </button>

      <p className="form-subtitle">
        ¿No tenés cuenta?{' '}
        <a
          href="#"
          onClick={(evento) => {
            evento.preventDefault();
            alSolicitarRegistro?.();
          }}
        >
          Registrate
        </a>
      </p>
    </form>
  );
};