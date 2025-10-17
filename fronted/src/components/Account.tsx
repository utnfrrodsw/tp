import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AccountProps {
  user: { name: string; email: string; telefono?: string };
  onUpdate: (data: { name: string; email: string; telefono?: string; password?: string }) => void;
}

const Account = ({ user, onUpdate }: AccountProps) => {
  const navigate = useNavigate();
  // try to split user.name into nombre/apellido
  const nameParts = (user.name || "").split(" ");
  const [form, setForm] = useState({
    nombre: nameParts[0] || "",
    apellido: nameParts.slice(1).join(" ") || "",
    telefono: user.telefono || "",
    email: user.email || "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setSuccess(false);
      return;
    }
    setError("");
    setSuccess(true);
    const fullName = `${form.nombre} ${form.apellido}`.trim();
    onUpdate({ name: fullName, email: form.email, telefono: form.telefono || undefined, password: form.password || undefined });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313131] bg-[radial-gradient(rgba(255,255,255,0.171)_2px,transparent_0)] [background-size:30px_30px] animate-[move_4s_linear_infinite] text-white/70">
      <style>{`
        @keyframes move {
          20% { background-position: 0 0; }
          100% { background-position: 40px 100px; }
        }
        @keyframes pulse {
          from { transform: scale(0.9); opacity: 1; }
          to { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
      <form className="form flex flex-col gap-2 max-w-[420px] w-full p-8 rounded-2xl bg-[#1a1a1a] relative" onSubmit={handleSubmit}>
        <p className="title text-[28px] font-semibold flex items-center pl-8 text-[#00bfff] relative mb-1">
          Editar Cuenta
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#00bfff] before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-[#00bfff] after:content-[''] after:absolute after:w-4 after:h-4 after:rounded-full after:bg-[#00bfff] after:animate-pulse"></span>
        </p>
        <p className="message text-[15px] mt-[-10px] mb-2">Actualizá tus datos de usuario</p>
        <div className="flex gap-4 w-full">
          <label className="flex-1 relative">
            <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300">Nombre</span>
          </label>
          <label className="flex-1 relative">
            <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="text" name="apellido" value={form.apellido} onChange={handleChange} />
            <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300">Apellido</span>
          </label>
        </div>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="tel" name="telefono" value={form.telefono} onChange={handleChange} />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300">Teléfono</span>
        </label>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="email" name="email" value={form.email} onChange={handleChange} required />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300">Email</span>
        </label>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="password" name="password" value={form.password} onChange={handleChange} />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300">Nueva contraseña</span>
        </label>
        <label className="relative">
          <input className="input bg-[#333] text-white w-full pt-5 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          <span className="absolute left-3 top-3 text-white/50 text-sm pointer-events-none transition-all duration-300">Confirmar contraseña</span>
        </label>
        {error && <div className="text-red-400 text-sm text-center mb-2">{error}</div>}
        {success && <div className="text-green-400 text-sm text-center mb-2">Datos actualizados</div>}
        <button type="submit" className="submit border-0 py-2 rounded-lg text-white text-lg bg-[#00bfff] hover:bg-[#00c3ff96] transition-colors">Actualizar</button>
        <p className="signin text-center text-[#00bfff] mt-2">
          <button type="button" onClick={() => navigate('/')} className="hover:underline">Volver al inicio</button>
        </p>
      </form>
    </div>
  );
};

export default Account;
