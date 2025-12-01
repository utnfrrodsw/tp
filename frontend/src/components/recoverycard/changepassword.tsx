import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usuariosApi } from '../../services/usuariosApi';
import Navbar from '../Navbar/Navbar';
import { z } from 'zod';

const schema = z.object({
  mail: z.string().email(),
  codigo: z.string().min(6).max(6),
  nuevaContrasena: z.string(),
  contrasena: z
    .string()
    .min(
      6,
      'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número'
    )
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número'
    ),
});

export type Usuario = z.infer<typeof schema>;

function ChangePassword() {
  const navigate = useNavigate();

  //setea la contraseña y la confirmacion
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //Setea mensaje y modal
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();

  // inntenta obtener mail y codigo del estado
  const mail = location.state?.mail || localStorage.getItem('recoveryMail');
  const codigo =
    location.state?.codigo || localStorage.getItem('recoveryCodigo');

  const cambiarpassword = async () => {
    const datos = {
      mail,
      codigo,
      nuevaContrasena: password,
      contrasena: password,
    };

    //valida los datos ingresados por el usuario con zod
    const resultado = schema.safeParse(datos);
    if (!resultado.success) {
      const errores = resultado.error.issues;
      setMessage(errores[0]?.message || 'Datos inválidos');
      setOpen(true);
      return;
    }

    //valida que las contraseñas coincidan
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setOpen(true);
      return;
    }

    //intenta cambiar la password
    try {
      await usuariosApi.cambiarPassword({
        mail,
        codigo,
        nuevaContrasena: password,
      });
      setMessage('Contraseña cambiada con éxito');
      setOpen(true);
      localStorage.removeItem('recoveryMail');
      localStorage.removeItem('recoveryCodigo');
    } catch {
      setOpen(true);
      setMessage('Error al cambiar la contraseña, por favor vuelva a intentar');
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-100 rounded-4xl shadow-inner mt-8 overflow-hidden px-4 md:px-0">
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-full p-9">
            <p className="text-black font-inter text-4xl mb-4 font-bold">
              Cambiar contraseña
            </p>
            <p className="text-black font-inter text-1xl mb-4">
              Ingrese su nueva contraseña
            </p>
            <form
              className="w-full flex flex-col items-center"
              onSubmit={(e) => {
                e.preventDefault();
                cambiarpassword();
              }}
            >
              <div className="relative inline-block w-full max-w-xs mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nueva contraseña"
                  className="w-full pt-3 pb-3 pr-5 pl-12 text-base border-none rounded-4xl bg-white shadow-inner outline-none text-black font-inter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i className="fa-solid fa-lock absolute top-6 left-4 -translate-y-1/2 text-gray-500 text-1xl pointer-events-none"></i>
                <i
                  className={`fa-solid ${
                    showPassword ? 'fa-eye' : 'fa-eye-slash'
                  } absolute top-6 right-4 -translate-y-1/2 text-gray-500 text-1xl cursor-pointer`}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                ></i>
              </div>
              <div className="relative inline-block w-full max-w-xs mb-4">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmar contraseña"
                  className="w-full pt-3 pb-3 pr-5 pl-12 text-base border-none rounded-4xl bg-white shadow-inner outline-none text-black font-inter"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i className="fa-solid fa-lock absolute top-6 left-4 -translate-y-1/2 text-gray-500 text-1xl pointer-events-none"></i>
                <i
                  className={`fa-solid ${
                    showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'
                  } absolute top-6 right-4 -translate-y-1/2 text-gray-500 text-1xl cursor-pointer`}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                ></i>
              </div>
              <button
                className={
                  password === '' || confirmPassword === ''
                    ? 'w-full bg-gray-300 text-black-500 px-5 py-2.5 rounded-b-2xl cursor-pointer focus:outline-none mb-5 mt-3'
                    : 'w-full bg-naranja-1 text-white px-5 py-2.5 rounded-b-2xl cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg'
                }
                disabled={password === '' || confirmPassword === ''}
                type="submit"
              >
                Confirmar cambio
              </button>
            </form>
          </div>
          <div className="hidden md:block w-full md:w-1/2 h-64 md:h-auto">
            <img
              className="w-full h-full object-cover rounded-tr-4xl rounded-br-4xl shadow-inner"
              src="/images/carousel1.jpg"
              alt="Cambiar contraseña"
            />
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-5 backdrop-blur-md bg-opacity-40">
          <div className="text-black bg-white p-4 rounded shadow-md">
            <div className="flex justify-end z-30 bg-transparent w-auto">
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Cerrar modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p>{message}</p>
            <button
              onClick={() => {
                if (message === 'Contraseña cambiada con éxito') {
                  navigate('/login');
                }
                setOpen(false);
              }}
              className="mt-2 px-4 py-2 bg-naranja-1 text-white rounded hover:bg-naranja-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChangePassword;
