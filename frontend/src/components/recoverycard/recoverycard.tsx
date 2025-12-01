import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosApi } from '../../services/usuariosApi';
import { z } from 'zod';

const usuarioSchema = z.object({
  mail: z.string().email('Ingrese un formato de email válido'),
});

export type Usuario = z.infer<typeof usuarioSchema>;

function Recovery() {
  //abre el modal de recuperación
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  //Almacena código de recuperación
  const [codigo, setCodigo] = useState('');

  const navigate = useNavigate();

  //Estados para el temporizador de recuperación
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [timerActivo, setTimerActivo] = useState(false);

  //Estado para mostrar un mensaje en caso de ingresar codigo de rec erroneo
  const [validado, setValidado] = useState(true);

  //animación de cuenta atrás en temporizador de recuperación
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActivo && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      setTimerActivo(false);
    }
    return () => clearInterval(interval);
  }, [timerActivo, tiempoRestante]);

  //valida el código ingresado por el usuario
  const validarCodigo = async () => {
    try {
      await usuariosApi.validateRecoveryCode({
        mail: form.mail,
        codigo,
      });
      navigate('/changepassword', { state: { mail: form.mail, codigo } });
    } catch {
      setValidado(false);
      console.log('Código incorrecto o expirado');
    }
  };

  const [form, setForm] = useState<Usuario>({
    mail: '',
  });

  //valida que el email ingresado tenga un formato válido
  const envioFormulario = async () => {
    const result = usuarioSchema.safeParse(form);
    if (!result.success) {
      setOpen(true);
      setCodigo('');
      setMessage('Ingresa un formato de email válido');
      return;
    }

    try {
      await usuariosApi.recoverPassword(form);
      setOpen(true);
      setCodigo('');
      setMessage('Ingrese el código de recuperación que se envió a su email');
      setTiempoRestante(300); // setea tiempo de 5 minutos hasta poder pedir otro codigo
      setTimerActivo(true);
    } catch (error) {
      setOpen(true);
      setCodigo('');
      const err = error as { response?: { status?: number } };
      if (err.response && err.response.status === 404) {
        setMessage('No existe un usuario con ese email');
      } else {
        setMessage(
          'Error en la recuperación de contraseña, por favor vuelva a intentar'
        );
      }
      setTimerActivo(false);
      setTiempoRestante(0);
    }
  };

  return (
    <>
      {/* Modal de recuperación */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-5 backdrop-blur-md bg-opacity-40 z-50">
          <div className="text-black bg-white p-4 rounded shadow-md max-w-xl w-full text-center">
            <div className="flex justify-end z-30 bg-transparent w-auto">
              <button
                onClick={() => {
                  setOpen(false);
                  setValidado(true);
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
            <p className="break-words whitespace-pre-line">{message}</p>
            {message ===
              'Ingrese el código de recuperación que se envió a su email' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  validarCodigo();
                }}
              >
                <input
                  className="w-full pt-3 pb-3 pr-5 pl-12 text-base border-none rounded-4xl bg-gray-100 shadow-inner outline-none mt-4 mb-4 text-black font-inter"
                  placeholder="Código de recuperación"
                  onChange={(e) => setCodigo(e.target.value)}
                  value={codigo}
                />
                <div className="w-full" style={{ minHeight: 28 }}>
                  {!validado && (
                    <p className="text-red-500 mt-2">
                      El código ingresado es incorrecto o expiró.
                    </p>
                  )}
                </div>
                <div className="w-full" style={{ minHeight: 32 }}>
                  {timerActivo && (
                    <p className="text-sm text-gray-500 mb-2">
                      Podrá pedir otro código en{' '}
                      {Math.floor(tiempoRestante / 60)}:
                      {(tiempoRestante % 60).toString().padStart(2, '0')}{' '}
                      minutos
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className={
                    codigo === ''
                      ? 'mt-2 px-4 py-2 bg-gray-200 text-black rounded'
                      : 'mt-2 px-4 py-2 bg-naranja-1 text-white rounded hover:bg-naranja-2'
                  }
                  disabled={codigo === ''}
                >
                  Ingresar
                </button>
                <button
                  onClick={() => {
                    envioFormulario();
                    setTiempoRestante(20);
                    setTimerActivo(true);
                    setValidado(true);
                  }}
                  type="button"
                  className={
                    timerActivo
                      ? 'mt-2 ml-2 px-4 py-2 bg-gray-200 text-black rounded '
                      : 'mt-2 ml-2 px-4 py-2 bg-naranja-1 text-white rounded hover:bg-naranja-2'
                  }
                  disabled={timerActivo}
                >
                  Reenviar código
                </button>
              </form>
            )}
            {(message === 'Ingresa un formato de email válido' ||
              message ===
                'Error en la recuperación de contraseña, por favor vuelva a intentar' ||
              message === 'No existe un usuario con ese email') && (
              <button
                onClick={() => setOpen(false)}
                className="mt-4 px-4 py-2 bg-naranja-1 text-white rounded hover:bg-naranja-2"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-100 rounded-4xl shadow-inner mt-8 overflow-hidden px-4 md:px-0 ">
          <div
            className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-}
         md:min-h-full justify-center border-black p-9"
          >
            <p className="text-black fonttext-black font-inter text-4xl mb-4 font-bold">
              Recuperar contraseña
            </p>
            <p className="text-black fonttext-black font-inter text-1xl mb-4">
              Ingresa tu email
            </p>
            <form
              className="w-full flex flex-col items-center"
              onSubmit={(e) => {
                e.preventDefault();
                envioFormulario();
              }}
            >
              <div className="relative inline-block w-full max-w-xs">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pt-3 pb-3 pr-5 pl-12 text-base border-none rounded-4xl bg-white shadow-inner outline-none mb-4 text-black font-inter"
                  onChange={(e) =>
                    setForm({ ...form, mail: e.target.value.toLowerCase() })
                  }
                />
                <i className="fa-solid fa-envelope absolute top-6 left-4 -translate-y-1/2 text-gray-500 text-1xl pointer-events-none"></i>
              </div>
              <button
                className={
                  form.mail === '' || timerActivo
                    ? 'w-full bg-gray-300 text-black-500 px-5 py-2.5 rounded-b-2xl cursor-pointer focus:outline-none mb-5 mt-3'
                    : 'w-full bg-naranja-1 text-white px-5 py-2.5 rounded-b-2xl cursor-pointer hover:text-black focus:outline-none mb-5 mt-3 hover:shadow-lg'
                }
                type="submit"
                disabled={form.mail === '' || timerActivo}
              >
                Recuperar contraseña
              </button>
            </form>
            <div style={{ minHeight: 24 }}>
              {timerActivo && (
                <p className="text-sm text-gray-500 mb-2">
                  Podrás pedir otro código en {Math.floor(tiempoRestante / 60)}:
                  {(tiempoRestante % 60).toString().padStart(2, '0')} minutos
                </p>
              )}
            </div>
            <p className="text-black font-inter  mb-7">
              ¿No tienes cuenta?{' '}
              <Link
                to="/registration"
                className="font-bold cursor-pointer hover:shadow-sm"
              >
                Regístrate
              </Link>
            </p>
          </div>
          <div className="hidden md:block w-full md:w-1/2 h-64 md:h-auto">
            <img
              className="w-full h-full object-cover rounded-tr-4xl rounded-br-4xl shadow-inner"
              src="/images/imagen-registration.jpg"
              alt="Recuperar contraseña"
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default Recovery;
