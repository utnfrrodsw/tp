import React, { useState } from 'react';

import type { UsuarioRol, UsuarioAutenticado } from './LoginForm';
import { registrarUsuario } from '../services/authService';
import type { DatosRegistro } from '../services/authService';
import { esEmailValido } from '../../../shared/validators';

interface RegisterFormProps {
  alSolicitarRegistro?: (user?: UsuarioAutenticado) => void;
  onLoginClick?: () => void;
}

// Traduce el valor de `rol` guardado en la BD (admin/empresa/cliente) al UsuarioRol interno
const convertirRolDeBackend = (rol: string): UsuarioRol | null => {
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

export const RegisterForm = ({
  alSolicitarRegistro,
  onLoginClick
}: RegisterFormProps) => {

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  const [rol, setRol] = useState<'cliente' | 'empresa'>('cliente'); //este rol solo puede ser cliente o empresa, no admin.
  const [zona, setZona] = useState('');
  const [cuit, setCuit] = useState('');
  const [telefono, setTelefono] = useState('');

  const [mensaje, setMensaje] = useState('');

  // Se ejecuta cuando presiono CREAR CUENTA
  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {

    // Evita que el navegador recargue la página
    e.preventDefault();

    setMensaje('');

    if (!esEmailValido(correo)) {
      setMensaje('Ingresá un email válido');
      return;
    }

    if (rol === 'empresa' && (!zona || !cuit || !telefono)) {
      setMensaje('Zona, CUIT y teléfono son requeridos para cuentas de empresa');
      return;
    }

    try {

      const datosRegistro: DatosRegistro = {
        nombre: nombre,
        email: correo,
        password: contrasena,
        confirmarContrasena: confirmarContrasena,
        aceptaTerminos: aceptoTerminos,
        role: rol,
      };

      if (rol === 'empresa') {
        datosRegistro.zona = zona;
        datosRegistro.cuit = Number(cuit);
        datosRegistro.telefono = Number(telefono);
      }

      const data = await registrarUsuario(datosRegistro);

      // Registro correcto
      setMensaje(data.message);

      // Limpio el formulario
      setNombre('');
      setCorreo('');
      setContrasena('');
      setConfirmarContrasena('');
      setAceptoTerminos(false);
      setRol('cliente');
      setZona('');
      setCuit('');
      setTelefono('');

      const rolConvertido = convertirRolDeBackend(data.user.rol);

      alSolicitarRegistro?.(
        rolConvertido
          ? {
              id: data.user.id,
              nombre: data.user.nombre,
              role: rolConvertido,
              token: data.token
            }
          : undefined
      );

    } catch (error) {

      console.error('Error al registrar usuario:', error);

      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servidor'
      );
    }
  };

  return (
    <form onSubmit={manejarEnvio}>

      <h2 className="form-title">
        REGISTRARSE
      </h2>

      <p
        className="form-subtitle"
        style={{ marginBottom: '1rem' }}
      >
        ¿Sos nuevo? Crea tu cuenta.
      </p>

      <div className="input-group">

        <label>
          Nombre Completo
        </label>

        <input
          className="form-input compact-input"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

      </div>

      <div className="input-group">

        <label>
          Correo Electrónico
        </label>

        <input
          className="form-input compact-input"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

      </div>

      <div className="input-group">

        <label>
          Contraseña
        </label>

        <input
          className="form-input compact-input"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

      </div>

      <div className="input-group">

        <label>
          Confirmar Contraseña
        </label>

        <input
          className="form-input compact-input"
          type="password"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />

      </div>

      <div className="input-group">

        <label>
          Tipo de cuenta
        </label>

        <div className="options-row">

          <label className="checkbox-label">
            <input
              type="radio"
              name="role"
              checked={rol === 'cliente'}
              onChange={() => setRol('cliente')}
            />
            Cliente
          </label>

          <label className="checkbox-label">
            <input
              type="radio"
              name="role"
              checked={rol === 'empresa'}
              onChange={() => setRol('empresa')}
            />
            Empresa
          </label>

        </div>

      </div>

      {rol === 'empresa' && (
        <>
          <div className="input-group">

            <label>
              Zona
            </label>

            <input
              className="form-input compact-input"
              type="text"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>
              CUIT
            </label>

            <input
              className="form-input compact-input"
              type="number"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>
              Teléfono
            </label>

            <input
              className="form-input compact-input"
              type="number"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

          </div>
        </>
      )}

      <div
        className="options-row"
        style={{ marginBottom: '1rem' }}
      >

        <label className="checkbox-label">

          <input
            type="checkbox"
            checked={aceptoTerminos}
            onChange={(e) => setAceptoTerminos(e.target.checked)}
          />

          Acepto Términos y Condiciones

        </label>

      </div>

      <button
        className="primary-button "
        type="submit"
      >
        CREAR CUENTA
      </button>

      {mensaje && (
        <p>{mensaje}</p>
      )}

      <p className="form-subtitle">
        ¿Ya tenés una cuenta?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLoginClick?.();
          }}
        >
          Iniciá sesión
        </a>
      </p>

    </form>
  );
};