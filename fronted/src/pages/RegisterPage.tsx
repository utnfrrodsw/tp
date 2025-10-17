import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registroSchema } from "../../../src/schema/personas.validator";
import { usePersonaAuth } from "../context/personaContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalidades, Localidad } from "../api/personas";

// Extendemos el schema del backend para agregar confirmPassword
const registerSchema = registroSchema.extend({
  confirmPassword: z.string().min(6, "Confirma tu contraseña")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      localidadId: "" // Valor inicial vacío para mostrar el placeholder
    }
  });
  
  const nav = useNavigate();
  const { signup, isAuthenticated, errors: RegisterErros, clearErrors } = usePersonaAuth();
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loadingLocalidades, setLoadingLocalidades] = useState(true);

  useEffect(() => {
    if (isAuthenticated) nav("/login");
  }, [isAuthenticated, nav]);

  // Cargar localidades al montar el componente
  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        const data = await getLocalidades();
        setLocalidades(data);
      } catch (error) {
        console.error("Error al cargar localidades:", error);
      } finally {
        setLoadingLocalidades(false);
      }
    };
    fetchLocalidades();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    await signup(values);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313131] bg-[radial-gradient(rgba(255,255,255,0.171)_2px,transparent_0)] [background-size:30px_30px] animate-[move_4s_linear_infinite] text-white/70 relative">
      <style>{`
        @keyframes move {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes pulse {
          from { transform: scale(0.9); opacity: 1; }
          to { transform: scale(1.8); opacity: 0; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Alerta flotante encima del formulario */}
      {RegisterErros.length > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20 max-w-[500px] w-full px-4" style={{ animation: 'slideDown 0.13s normal-out' }}>
          {RegisterErros.map((error, i) => (
            <div key={i} className="bg-red-500 p-4 text-white mb-2 rounded-lg shadow-lg flex items-center justify-between">
              <span className="flex-1">{error}</span>
              <button 
                onClick={clearErrors}
                className="ml-4 text-white hover:text-gray-200 font-bold text-xl leading-none"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form className="form flex flex-col gap-2 max-w-[500px] w-full p-8 rounded-2xl bg-[#1a1a1a] relative" onSubmit={onSubmit}>
        
        <p className="title text-[28px] font-semibold flex items-center pl-8 text-[#00bfff] relative mb-1">
          Registrarse
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#00bfff] before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-[#00bfff] after:content-[''] after:absolute after:w-4 after:h-4 after:rounded-full after:bg-[#00bfff] after:animate-pulse"></span>
        </p>
        <p className="message text-[15px] mt-[-10px] mb-2">Una app para manejar tus billeteras virtuales</p>
        <div className="flex gap-4 w-full">
          <label className="flex-1 relative">
            <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="text" {...register("name")} />
            <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#00bfff]">Nombre</span>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </label>
          <label className="flex-1 relative">
            <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="text" {...register("apellido")} />
            <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#00bfff]">Apellido</span>
            {errors.apellido && <p className="text-red-400 text-xs mt-1">{errors.apellido.message}</p>}
          </label>
        </div>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="tel" {...register("tel")} />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#00bfff]">Teléfono</span>
          {errors.tel && <p className="text-red-400 text-xs mt-1">{errors.tel.message}</p>}
        </label>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="email" {...register("email")} />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#00bfff]">Email</span>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </label>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="text" {...register("direccion")} />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#00bfff]">Dirección</span>
          {errors.direccion && <p className="text-red-400 text-xs mt-1">{errors.direccion.message}</p>}
        </label>
        <div className="relative">
          <label htmlFor="localidadId" className="block text-sm text-white/70 mb-2">
          </label>
          <div className="relative">
            <select 
              id="localidadId"
              className="w-full bg-[#333] text-white px-4 py-3 rounded-lg border border-[#69696965] focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 appearance-none cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              {...register("localidadId")}
              disabled={loadingLocalidades}
              aria-label="Seleccionar localidad"
              defaultValue=""
            >
              <option value="" disabled selected className="bg-[#333] text-gray-400">
                Selecciona una localidad
              </option>
              {localidades.map((localidad) => (
                <option key={localidad._id} value={localidad._id} className="bg-[#333] text-white py-2">
                  {localidad.nombre_localidad} - {localidad.pais}
                </option>
              ))}
            </select>
            {/* Icono de flecha personalizado */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {errors.localidadId && <p className="text-red-400 text-xs mt-1">{errors.localidadId.message}</p>}
        </div>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="password" {...register("password")} />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#00bfff]">Contraseña</span>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </label>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="password" {...register("confirmPassword")} />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#00bfff]">Confirmar Contraseña</span>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </label>
        <button type="submit" className="submit border-0 py-2 rounded-lg text-white text-lg bg-[#00bfff] hover:bg-[#00c3ff96] transition-colors">Registrarse</button>
  <p className="signin text-center text-[#00bfff] mt-2"><button onClick={() => nav('/login')}>Ya tienes una cuenta?</button></p>
      </form>
    </div>
  );
}

export default RegisterPage;

// --- referencias de codigo que se uso para hacer los cambios ---