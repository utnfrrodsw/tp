import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, History, RotateCcw, TestTube2, Megaphone } from 'lucide-react';
import { isAdmin } from '../utils/jwtUtils';
import { getAccessToken } from '../utils/tokenUtil';
import { adminNewsletterService, CampaignHistoryItem } from '../services/adminNewsletterService';

const cardClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900';

const formatCampaignDate = (rawDate: string) => {
  // Legacy rows created with SQL DATE (without time) can shift when interpreted as UTC.
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [year, month, day] = rawDate.split('-');
    return `${day}/${month}/${year} (sin hora)`;
  }

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return rawDate;

  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(parsed);
};

const AdminNewsletterHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<CampaignHistoryItem[]>([]);
  const [section, setSection] = useState<'campaigns' | 'tests'>('campaigns');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionBusyId, setActionBusyId] = useState<number | null>(null);

  const campaignItems = items.filter((item) => !item.isTest);
  const testItems = items.filter((item) => item.isTest);
  const visibleItems = section === 'tests' ? testItems : campaignItems;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminNewsletterService.getCampaignHistory(1, 50);
      setItems(response.data || []);
    } catch (err: any) {
      setError(err.message || 'No se pudo cargar el historial de campañas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/LoginPage');
      return;
    }

    if (!isAdmin()) {
      navigate('/');
      return;
    }

    void loadData();
  }, [navigate]);

  const handleReuse = async (id: number) => {
    try {
      setActionBusyId(id);
      const campaign = await adminNewsletterService.getCampaignDetail(id);
      navigate('/admin/newsletter', {
        state: { reuseCampaign: campaign },
      });
    } catch (err: any) {
      setError(err.message || 'No se pudo cargar la campaña seleccionada');
    } finally {
      setActionBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-3xl border border-cyan-200 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                <History className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Historial de campañas</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">Registro de envíos masivos y pruebas</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/admin/newsletter')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-900/40"
              >
                <RefreshCw className="h-4 w-4" />
                Refrescar
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            {error}
          </div>
        )}

        {!loading && (
          <section className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setSection('campaigns')}
              className={`rounded-2xl border p-4 text-left transition ${
                section === 'campaigns'
                  ? 'border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Megaphone className="h-4 w-4" />
                Campañas reales
              </div>
              <p className="mt-1 text-2xl font-bold">{campaignItems.length}</p>
              <p className="text-xs opacity-80">Envíos masivos a audiencia real</p>
            </button>

            <button
              type="button"
              onClick={() => setSection('tests')}
              className={`rounded-2xl border p-4 text-left transition ${
                section === 'tests'
                  ? 'border-slate-400 bg-slate-100 text-slate-800 dark:border-slate-500 dark:bg-slate-800/70 dark:text-slate-100'
                  : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TestTube2 className="h-4 w-4" />
                Mails de prueba
              </div>
              <p className="mt-1 text-2xl font-bold">{testItems.length}</p>
              <p className="text-xs opacity-80">Intentos de envío de prueba a un email puntual</p>
            </button>
          </section>
        )}

        <section className={cardClass}>
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Cargando historial...</p>
          ) : visibleItems.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {section === 'tests' ? 'No hay intentos de mails de prueba registrados.' : 'No hay campañas reales registradas.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    <th className="py-2 pr-4">Fecha</th>
                    <th className="py-2 pr-4">Asunto</th>
                    <th className="py-2 pr-4">Tipo</th>
                    <th className="py-2 pr-4">Enviados</th>
                    <th className="py-2 pr-4">Fallidos</th>
                    <th className="py-2 pr-4">Admin</th>
                    <th className="py-2 pr-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{formatCampaignDate(item.createdAt)}</td>
                      <td className="py-2 pr-4 text-slate-900 dark:text-slate-100">{item.subject}</td>
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{item.isTest ? 'Prueba' : item.audience}</td>
                      <td className="py-2 pr-4 text-emerald-700 dark:text-emerald-300">{item.sent}/{item.totalRecipients}</td>
                      <td className="py-2 pr-4 text-rose-700 dark:text-rose-300">{item.failed}</td>
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{item.sentByEmail || '-'}</td>
                      <td className="py-2 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleReuse(item.id)}
                            disabled={actionBusyId === item.id}
                            className="inline-flex items-center gap-1 rounded-md border border-cyan-300 bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-900/40"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reusar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminNewsletterHistoryPage;
