import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.config';

type State = 'loading' | 'success' | 'error';

const NewsletterUnsubscribePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<State>('loading');
  const [message, setMessage] = useState('Procesando desuscripcion...');

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState('error');
        setMessage('Token de desuscripcion invalido.');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/newsletter/unsubscribe/${token}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'No se pudo procesar la desuscripcion.');
        }

        setState('success');
        setMessage(data.message || 'Suscripcion cancelada correctamente.');
      } catch (err: any) {
        setState('error');
        setMessage(err.message || 'No se pudo procesar la desuscripcion.');
      }
    };

    void run();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Newsletter BookCode</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">{message}</p>

        {state === 'loading' && <p className="mt-4 text-sm text-slate-500">Un momento...</p>}

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsletterUnsubscribePage;
