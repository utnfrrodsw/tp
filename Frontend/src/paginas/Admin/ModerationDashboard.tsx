// src/paginas/Admin/ModerationDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, CheckCircle, XCircle, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { obtenerEstadisticasModeracion } from '../../services/resenaService';

interface ModerationStats {
  total: number;
  autoApproved: number;
  autoRejected: number;
  pending: number;
  manuallyReviewed: number;
  averageScore: number;
  topReasons: { reason: string; count: number }[];
  recentTrend: { date: string; approved: number; rejected: number; pending: number }[];
}

export const ModerationDashboard: React.FC = () => {
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setError('No hay token de autenticación');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await obtenerEstadisticasModeracion(timeRange, token);
      setStats(data);
    } catch (error) {
      console.error('Error fetching moderation stats:', error);
      setError('Error al cargar estadísticas de moderación');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">{error || 'Error al cargar estadísticas'}</p>
          <button 
            onClick={fetchStats}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const approvalRate = ((stats.autoApproved / stats.total) * 100).toFixed(1);
  const rejectionRate = ((stats.autoRejected / stats.total) * 100).toFixed(1);
  const pendingRate = ((stats.pending / stats.total) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard de Moderación</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Estadísticas y métricas del sistema de moderación automática</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {range === '7d' ? 'Últimos 7 días' : range === '30d' ? 'Últimos 30 días' : 'Últimos 90 días'}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stats.total}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Reseñas Totales</p>
          </div>

          {/* Auto Approved */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 font-semibold">{approvalRate}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stats.autoApproved}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Auto-Aprobadas</p>
          </div>

          {/* Auto Rejected */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-red-600 font-semibold">{rejectionRate}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stats.autoRejected}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Auto-Rechazadas</p>
          </div>

          {/* Pending */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-yellow-600 font-semibold">{pendingRate}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stats.pending}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Pendientes de Revisión</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Average Score */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Puntuación Promedio</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{stats.averageScore}</span>
              <span className="text-gray-500 dark:text-gray-400">/100</span>
            </div>
            <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  stats.averageScore >= 70
                    ? 'bg-green-500'
                    : stats.averageScore >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${stats.averageScore}%` }}
              />
            </div>
          </div>

          {/* Manual Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revisión Manual</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{stats.manuallyReviewed}</span>
              <span className="text-gray-500 dark:text-gray-400">reseñas</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Revisadas manualmente por moderadores
            </p>
          </div>
        </div>

        {/* Top Reasons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Razones Más Comunes de Rechazo</h3>
          </div>
          <div className="space-y-4">
            {stats.topReasons.map((item, index) => {
              const percentage = ((item.count / stats.autoRejected) * 100).toFixed(1);
              return (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-200">{item.reason}</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend Chart (Simple bar visualization) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tendencia de los Últimos 7 Días</h3>
          </div>
          <div className="space-y-4">
            {stats.recentTrend.map((day, index) => {
              const total = day.approved + day.rejected + day.pending;
              const approvedPct = (day.approved / total) * 100;
              const rejectedPct = (day.rejected / total) * 100;
              const pendingPct = (day.pending / total) * 100;

              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">Total: {total}</span>
                  </div>
                  <div className="flex h-8 rounded-lg overflow-hidden">
                    <div
                      className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${approvedPct}%` }}
                      title={`Aprobadas: ${day.approved}`}
                    >
                      {day.approved > 0 && day.approved}
                    </div>
                    <div
                      className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${rejectedPct}%` }}
                      title={`Rechazadas: ${day.rejected}`}
                    >
                      {day.rejected > 0 && day.rejected}
                    </div>
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${pendingPct}%` }}
                      title={`Pendientes: ${day.pending}`}
                    >
                      {day.pending > 0 && day.pending}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-6 mt-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Aprobadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Rechazadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Pendientes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
