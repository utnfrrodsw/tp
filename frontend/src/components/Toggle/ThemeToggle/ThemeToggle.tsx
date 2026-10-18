import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

// Botón para cambiar entre modo claro y oscuro
const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  // next-themes solo conoce el tema real recién cuando el componente montó.
  // Hasta entonces no mostramos nada, para evitar un parpadeo del ícono.
  useEffect(() => setMontado(true), []);
  if (!montado) return null;

  const esOscuro = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(esOscuro ? "light" : "dark")}
      aria-label="Cambiar entre modo claro y oscuro"
      title={esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {esOscuro ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
