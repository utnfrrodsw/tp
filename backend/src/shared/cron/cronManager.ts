import { CronJobs } from './cronJobs.js';

import { CronStatus, CRON_CONFIG } from './cronConfig.js';

/**
 * Manager básico para cron jobs
 */
export class CronManager {
  /**
   * Inicializa los cron jobs
   */
  static async initializeAll(): Promise<void> {
    console.log('🚀 Iniciando sistema de cron jobs...');

    // Mostrar configuración
    CronStatus.showStatus();

    try {
      if (CRON_CONFIG.enabled) {
        CronJobs.initializeCronJobs();
        console.log('🎉 Sistema de cron jobs iniciado correctamente');
      } else {
        console.log('⚠️ Cron jobs deshabilitados en configuración');
      }
    } catch (error) {
      console.error('❌ Error iniciando cron jobs:', error);
      throw error;
    }
  }

  /**
   * Detiene todos los cron jobs
   */
  static stopAll(): void {
    console.log('🛑 Deteniendo todos los cron jobs...');
    try {
      CronJobs.destroyAllCronJobs();
      console.log('✅ Todos los cron jobs detenidos');
    } catch (error) {
      console.error('❌ Error deteniendo cron jobs:', error);
    }
  }
}
