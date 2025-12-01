/**
 * Configuración básica para los cron jobs
 */
export const CRON_CONFIG = {
  // Zona horaria
  timezone: "America/Argentina/Buenos_Aires",
  
  // Control de activación
  enabled: true,
  
  // Ejemplo de horarios comunes (formato: minuto hora día mes día-semana)
  schedules: {
    everyMinute: '* * * * *',        // Cada minuto (solo para testing)
    hourly: '0 * * * *',             // Cada hora
    daily: '0 2 * * *',              // Cada día a las 2:00 AM
    weekly: '0 3 * * 0',             // Cada domingo a las 3:00 AM
  },
};

/**
 * Utilidad básica para mostrar configuración
 */
export class CronStatus {
  static showStatus(): void {
    console.log('\n📊 Configuración de Cron Jobs:');
    console.log('================================');
    console.log('🌍 Zona Horaria:', CRON_CONFIG.timezone);
    console.log('⚡ Estado:', CRON_CONFIG.enabled ? 'Habilitado' : 'Deshabilitado');
    console.log('\n⏰ Horarios de Ejemplo:');
    Object.entries(CRON_CONFIG.schedules).forEach(([key, value]) => {
      console.log(`  📅 ${key}: ${value}`);
    });
    console.log('================================\n');
  }
}
