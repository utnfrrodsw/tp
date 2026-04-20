import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from '../config/api.config';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  User,
  Mail,
  AtSign,
  MapPin,
  BookOpen,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  Edit,
} from "lucide-react";

interface ConfiguracionUsuarioProps {}

const ConfiguracionUsuario: React.FC<ConfiguracionUsuarioProps> = () => {
  const countries = [
    'Argentina',
    'Australia',
    'Brasil',
    'Canadá',
    'Chile',
    'Colombia',
    'España',
    'Estados Unidos',
    'Francia',
    'Italia',
    'México',
    'Perú',
    'Reino Unido',
    'Uruguay',
    'Venezuela',
    // Add more as needed
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    biografia: "",
    ubicacion: "",
    genero: "otro" as "masculino" | "femenino" | "otro",
    email: "",
    username: "",
    avatar: "",
  });

  const [originalData, setOriginalData] = useState(formData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/usuarios/me`);
        const data = response.data;

        const profileData = {
          nombre: data.nombre || "",
          biografia: data.biografia || "",
          ubicacion: data.ubicacion || "",
          genero: data.genero || "otro",
          email: data.email || "",
          username: data.username || "",
          avatar: data.avatar || "",
        };

        setFormData(profileData);
        setOriginalData(profileData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          setError("Sesión expirada. Redirigiendo al inicio de sesión...");
          setTimeout(() => {
            window.location.href = "/LoginPage";
          }, 2000);
        } else {
          setError(err.response?.data?.error || "Error al cargar configuración de usuario");
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    } else if (formData.username.length < 4) {
      newErrors.username = "El nombre de usuario debe tener al menos 4 caracteres";
    }

    if (formData.nombre && formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres";
    }

    if (formData.biografia && formData.biografia.length > 500) {
      newErrors.biografia = "La biografía no puede exceder 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvatarSelect = (avatarId: string) => {
    setFormData((prev) => ({ ...prev, avatar: avatarId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) return;

    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/usuarios/me`, formData);
      setOriginalData(formData);
      setMessage("Configuración actualizada correctamente");
      setTimeout(() => setMessage(""), 5000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("El email o nombre de usuario ya están en uso");
      } else {
        setError("Error al actualizar configuración");
      }
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const avatars = [
    { id: "avatar1", src: "/assets/avatar1.svg", alt: "Avatar 1" },
    { id: "avatar2", src: "/assets/avatar2.svg", alt: "Avatar 2" },
    { id: "avatar3", src: "/assets/avatar3.svg", alt: "Avatar 3" },
    { id: "avatar4", src: "/assets/avatar4.svg", alt: "Avatar 4" },
    { id: "avatar5", src: "/assets/avatar5.svg", alt: "Avatar 5" },
    { id: "avatar6", src: "/assets/avatar6.svg", alt: "Avatar 6" },
  ];

  const avatarMap: { [key: string]: string } = {
    avatar1: "/assets/avatar1.svg",
    avatar2: "/assets/avatar2.svg",
    avatar3: "/assets/avatar3.svg",
    avatar4: "/assets/avatar4.svg",
    avatar5: "/assets/avatar5.svg",
    avatar6: "/assets/avatar6.svg",
  };

  const currentAvatarSrc = formData.avatar ? avatarMap[formData.avatar] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <DotLottieReact
            src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
            loop
            autoplay
            style={{ width: 80, height: 80 }}
          />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-700 text-white shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/perfil"
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/40 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Perfil
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold tracking-tight">Configuración de Usuario</h1>
            <p className="text-base text-blue-100 dark:text-blue-200 mt-2 opacity-90">
              Personaliza tu perfil y preferencias
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-800/30 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in duration-500 hover:shadow-3xl transition-shadow duration-500">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Avatar */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" /> Avatar
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 overflow-hidden shadow-lg">
                    {currentAvatarSrc ? (
                      <img src={currentAvatarSrc} alt="Avatar actual" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white cursor-pointer hover:bg-blue-700 transition-colors">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleAvatarSelect(avatar.id)}
                      className={`relative p-2 border-2 rounded-full transition-all duration-200 ${
                        formData.avatar === avatar.id
                          ? "border-blue-500 bg-blue-100 ring-4 ring-blue-500/30"
                          : "border-gray-200 hover:border-blue-400"
                      }`}
                    >
                      <img src={avatar.src} alt={avatar.alt} className="w-16 h-16 mx-auto rounded-full" />
                      {formData.avatar === avatar.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Información Básica */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" /> Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100" htmlFor="nombre">
                    Nombre Completo
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none focus-visible:ring-4 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                      errors.nombre
                        ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 focus-visible:ring-red-500/20"
                        : "border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500 focus-visible:ring-blue-500/20"
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.nombre && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" /> {errors.nombre}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100" htmlFor="username">
                      Nombre de Usuario *
                    </label>
                    <div className="group relative">
                      <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 cursor-help transition-colors" />
                      <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg border border-gray-700">
                        Tu nombre de usuario debe tener al menos 4 caracteres y puede contener letras, números y guiones bajos.
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={`w-full pl-12 border-2 rounded-xl px-4 py-4 focus:outline-none focus-visible:ring-4 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                        errors.username
                          ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 focus-visible:ring-red-500/20"
                          : "border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500 focus-visible:ring-blue-500/20"
                      }`}
                      placeholder="tu_usuario"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" /> {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100" htmlFor="email">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full pl-12 border-2 rounded-xl px-4 py-4 focus:outline-none focus-visible:ring-4 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                        errors.email
                          ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 focus-visible:ring-red-500/20"
                          : "border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500 focus-visible:ring-blue-500/20"
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100" htmlFor="ubicacion">
                    País
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <select
                      id="ubicacion"
                      value={formData.ubicacion}
                      onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                      className="w-full pl-12 border-2 rounded-xl px-4 py-4 focus:outline-none focus-visible:ring-4 focus:border-blue-400 dark:focus:border-blue-500 focus-visible:ring-blue-500/20 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Selecciona tu país</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Género */}
              <div className="mt-8">
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100" htmlFor="genero">
                  Género
                </label>
                <select
                  id="genero"
                  value={formData.genero}
                  onChange={(e) => handleInputChange("genero", e.target.value as any)}
                  className="w-full md:w-1/2 border-2 rounded-xl px-4 py-4 focus:outline-none focus-visible:ring-4 focus:border-blue-400 dark:focus:border-blue-500 focus-visible:ring-blue-500/20 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Biografía */}
            <div className="p-6 pt-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" /> Acerca de Ti
              </h2>
              <textarea
                id="biografia"
                value={formData.biografia}
                onChange={(e) => handleInputChange("biografia", e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none focus-visible:ring-4 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                  errors.biografia
                    ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 focus-visible:ring-red-500/20"
                    : "border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500 focus-visible:ring-blue-500/20"
                }`}
                rows={4}
                placeholder="Cuéntanos un poco sobre ti..."
              />
              <div className="flex justify-between items-center mt-2">
                {errors.biografia && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.biografia}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">{formData.biografia.length}/500 caracteres</p>
              </div>

              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all ${
                    formData.biografia.length > 450
                      ? "bg-red-500 dark:bg-red-400"
                      : formData.biografia.length > 400
                      ? "bg-yellow-500 dark:bg-yellow-400"
                      : "bg-blue-500 dark:bg-blue-400"
                  }`}
                  style={{ width: `${(formData.biografia.length / 500) * 100}%` }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-end p-6">
              <Link
                to="/perfil"
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-gray-900 dark:text-gray-100 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={!hasChanges || saving}
                className={`px-8 py-4 rounded-xl font-semibold flex items-center justify-center shadow-lg transition-all ${
                  hasChanges && !saving
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-105"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3" /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Mensajes */}
          {(message || error) && (
            <div className="mt-8">
              {message && (
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <p className="ml-4 text-green-800 font-semibold">{message}</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-lg mt-4">
                  <div className="flex items-center">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <p className="ml-4 text-red-800 font-semibold">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionUsuario;
