import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AccountModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUpdate?: (data: { name: string; email: string; telefono?: string; password?: string }) => void;
}

const AccountModal = ({ isOpen, onClose, onUpdate }: AccountModalProps) => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const user = JSON.parse(stored) as { name?: string; email?: string; telefono?: string };
          const nameParts = (user.name || "").split(" ");
          setForm((prev) => ({
            ...prev,
            nombre: nameParts[0] || "",
            apellido: nameParts.slice(1).join(" ") || "",
            telefono: user.telefono || "",
            email: user.email || "",
            password: "",
            confirmPassword: "",
          }));
        }
      } catch {
        // ignore
      }
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

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

    const fullName = `${form.nombre} ${form.apellido}`.trim();

    const payload = { name: fullName, email: form.email, telefono: form.telefono || undefined };
    localStorage.setItem("user", JSON.stringify(payload));

    if (onUpdate) onUpdate({ ...payload, password: form.password || undefined });

    setError("");
    setSuccess(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && onClose) onClose(); }}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Cuenta</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex gap-3 w-full">
            <label className="flex-1 relative">
              <input
                className="bg-[#333] text-white w-full pt-8 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <span className="absolute left-3 top-3 text-white/50 text-sm">Nombre</span>
            </label>
            <label className="flex-1 relative">
              <input
                className="bg-[#333] text-white w-full pt-8 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none"
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
              />
              <span className="absolute left-3 top-3 text-white/50 text-sm">Apellido</span>
            </label>
          </div>

          <label className="relative">
            <input
              className="bg-[#333] text-white w-full pt-8 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none"
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
            <span className="absolute left-3 top-3 text-white/50 text-sm">Teléfono</span>
          </label>

          <label className="relative">
            <input
              className="bg-[#333] text-white w-full pt-8 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <span className="absolute left-3 top-3 text-white/50 text-sm">Email</span>
          </label>

          <label className="relative">
            <input
              className="bg-[#333] text-white w-full pt-8 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <span className="absolute left-3 top-3 text-white/50 text-sm">Nueva contraseña</span>
          </label>

          <label className="relative">
            <input
              className="bg-[#333] text-white w-full pt-8 pb-1 px-3 rounded-lg border border-[#69696965] focus:outline-none"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <span className="absolute left-3 top-3 text-white/50 text-sm">Confirmar contraseña</span>
          </label>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          {success && <div className="text-green-400 text-sm text-center">Datos actualizados</div>}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Actualizar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountModal;

