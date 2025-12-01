import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosApi } from '../../services/usuariosApi';
import { useParams } from 'react-router-dom';
import useAuth from '../../cookie/useAuth';
import { cn } from '../../lib/utils.ts';
import { Alert, AlertTitle, AlertDescription } from './../Alerts/Alerts.tsx';
import { useProtectRoute } from '../../cookie/useProtectRoute.tsx';

function Logincard() {
  const { id, servicio, Tarea, horario, dia, montofinall } = useParams<{
    id?: string;
    servicio?: string;
    Tarea?: string;
    horario?: string;
    dia?: string;
    montofinall?: string;
  }>();

  const { verificarAuth } = useAuth();

  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useProtectRoute();

  // Ocultar password
  const [showPassword, setShowPassword] = useState(false);

  const handleClickCrossedEye = () => {
    setShowPassword(!showPassword);
  };

  //variable de estado para almacenar los datos del formulario
  const [form, setForm] = useState({ mail: '', contrasena: '' });

  const envioFormulario = async () => {
    try {
      const { data } = await usuariosApi.login(form);

      localStorage.setItem('token', data.token);
      await verificarAuth();
      if (data.data.nombreFantasia) {
        navigate('/dashboard');
      } else {
        if (id && servicio && Tarea && horario && dia && montofinall) {
          navigate(
            `/prestatario/${id}/${servicio}/${Tarea}/${horario}/${dia}/${montofinall}/true`
          );
        } else {
          navigate('/');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      try {
        if (error.response.data?.errors[0]?.message) {
          setMessage(error.response.data.errors[0].message);
        } else {
          setMessage('Error en el servidor, intente nuevamente mas tarde');
        }
      } catch {
        if (error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Error en el servidor, intente nuevamente mas tarde');
        }
      }
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center bg-white py-8">
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-gray-100 rounded-4xl shadow-lg mt-8 overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
            <p className="text-black font-inter text-3xl md:text-5xl mb-6 font-bold text-center">
              ¡Bienvenido!
            </p>
            <div className="w-full flex flex-col items-center">
              <form
                className="w-full flex flex-col items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  envioFormulario();
                }}
              >
                {/* Email Input */}
                <div className="relative inline-block w-full">
                  <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => setForm({ ...form, mail: e.target.value })}
                    className={cn(
                      'w-full pt-3 pb-3 pr-5 pl-12 text-base border-none',
                      'rounded-4xl bg-white shadow-inner outline-none mb-4',
                      'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
                      'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
                    )}
                  />
                  <i className="fa-solid fa-envelope absolute top-4 left-6 text-gray-500 text-lg pointer-events-none"></i>
                </div>

                {/* Password Input */}
                <div className="relative inline-block w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    onChange={(e) =>
                      setForm({ ...form, contrasena: e.target.value })
                    }
                    className={cn(
                      'w-full pt-3 pb-3 pr-12 pl-12 text-base border-none',
                      'rounded-4xl bg-white shadow-inner outline-none mb-4',
                      'text-black font-inter hover:shadow-lg hover:bg-orange-50 transition-all ease-in-out duration-300',
                      'focus:ring-2 focus:ring-naranja-1 focus:border-transparent'
                    )}
                  />
                  {/* Posición del ojo*/}
                  <i
                    className={`${
                      showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'
                    } absolute top-4 right-4 text-gray-500 text-lg cursor-pointer hover:text-gray-700 transition-colors`}
                    onClick={handleClickCrossedEye}
                  ></i>
                  <i className="fa-solid fa-lock absolute top-4 left-6 text-gray-500 text-lg pointer-events-none"></i>
                </div>

                <button
                  type="submit"
                  data-testid="login-button"
                  className={
                    form.mail === '' || form.contrasena === ''
                      ? 'w-full bg-gray-300 text-black-500 px-5 py-2.5 rounded-b-2xl cursor-pointer focus:outline-none mb-5 mt-3 '
                      : cn(
                          'w-full border-2 border-naranja-1 bg-naranja-1 text-white px-5 py-2.5 rounded-b-2xl cursor-pointer mb-5 mt-3 hover:shadow-lg',
                          'hover:bg-white hover:text-naranja-1 hover:border-naranja-1 transition-all ease-in-out duration-300 focus:outline-none'
                        )
                  }
                  disabled={form.mail === '' || form.contrasena === ''}
                >
                  Iniciar sesión
                </button>
              </form>
            </div>

            <p className="text-black font-inter mb-0 text-center">
              ¿No tienes cuenta?{' '}
              <Link
                to="/registration"
                className="font-bold cursor-pointer hover:border-b-2 border-naranja-1 shadow-2xs "
              >
                Regístrate
              </Link>
            </p>
            <Link
              to="/recovery"
              className="text-black font-inter mb-0 font-bold cursor-pointer shadow-2xs mt-2 border-b-2 border-transparent hover:border-naranja-1  "
            >
              Olvidé mi contraseña
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <img
              className="w-full h-64 md:h-full object-cover rounded-b-4xl md:rounded-tr-4xl md:rounded-br-4xl"
              src="/images/imagen-login.png"
              alt="Login"
            />
          </div>
        </div>
        {message && (
          <Alert
            variant={'danger'}
            className="max-w-xl mt-4"
            onClose={() => setMessage('')}
            autoClose={true}
            autoCloseDelay={10000}
            data-testid="alert"
          >
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mx-auto" data-testid="alert-msg">
              {message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}

export default Logincard;
