import React, { useState } from 'react';
import { Eye, EyeOff, Book, Mail, Lock, ArrowRight, X } from 'lucide-react';
import { saveTokens } from '../services/authService';
import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err) && err.response?.data) {
      const data = err.response.data as any;
      return data.error || data.message || JSON.stringify(data);
    }
    if (err instanceof Error) return err.message;
    return String(err);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!loginData.email || !loginData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: loginData.email,
        password: loginData.password,
      });

      const { token, refreshToken, message } = response.data || {};
      if (token && refreshToken) saveTokens(token, refreshToken);

      setSuccess(message || 'Login exitoso');
      setError('');
      setLoading(false);

      // Cerrar modal y notificar éxito
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
      setSuccess('');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative border border-white/50 dark:border-gray-700/50 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-full"
          aria-label="Cerrar modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            <Book className="w-9 h-9 text-blue-600 dark:text-blue-400" />
            <span>BookCode</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Tu sesión ha expirado</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Por favor, inicia sesión nuevamente para continuar.
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm text-red-700 mb-4 p-3 rounded-xl text-center font-medium border border-red-200/50" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50/80 backdrop-blur-sm text-green-700 mb-4 p-3 rounded-xl text-center font-medium border border-green-200/50" role="alert">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-modal"
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password-modal"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span>Cargando...</span>
            ) : (
              <>
                <span>Iniciar sesión</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
