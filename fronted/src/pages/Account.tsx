import Account from "@/components/Account";
import { useState, useEffect } from "react";

const AccountPage = () => {
  // Simulación: obtener datos del usuario desde localStorage o un estado global
  const [user, setUser] = useState<{ name: string; email: string }>({ name: "", email: "" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleUpdate = (data: { name: string; email: string; password?: string }) => {
    setUser({ name: data.name, email: data.email });
    localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
    // Aquí podrías hacer un PUT real
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313131]">
      <Account user={user} onUpdate={handleUpdate} />
    </div>
  );
};

export default AccountPage;
