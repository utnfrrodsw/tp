import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from '@/lib/config';   // named export

export default function Validation() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Estamos validando tu cuenta, por favor aguardá...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("El enlace de validación no es válido.");
      return;
    }


    fetch(`${BACKEND_URL}/api/auth/validate/${token}`, { method: "PUT" })// <-- Ajustá la ruta según cómo la declaraste en tus rutas de Express
      .then((res) => {
        if (!res.ok) {
          // Si el backend responde con un código de error (400, 404, etc), tiramos error para ir al catch
          throw new Error();
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("¡Tu cuenta fue validada con éxito! Ya podés iniciar sesión.");
          
          // Redirigimos al Login después de unos segundos
          setTimeout(() => {
            navigate("/login");
          }, 3500);
        } else {
          setStatus("error");
          setMessage(data.message || "El enlace de validación expiró o es incorrecto.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Hubo un problema de conexión con el servidor o el enlace ya caducó.");
      });
  }, [token, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f7f9" }}>
      <div style={{ padding: "40px", borderRadius: "8px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxWidth: "400px", textAlign: "center" }}>
        {status === "loading" && (
          <div>
            <h2 style={{ color: "#1e293b" }}>Procesando...</h2>
            <p style={{ color: "#64748b" }}>{message}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <span style={{ fontSize: "48px", color: "#10b981" }}>✔</span>
            <h2 style={{ color: "#1e293b", marginTop: "10px" }}>¡Todo listo!</h2>
            <p style={{ color: "#475569" }}>{message}</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <span style={{ fontSize: "48px", color: "#ef4444" }}>❌</span>
            <h2 style={{ color: "#1e293b", marginTop: "10px" }}>No se pudo validar</h2>
            <p style={{ color: "#475569" }}>{message}</p>
            <button 
              onClick={() => navigate("/login")} 
              style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              Ir al Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}