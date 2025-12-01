import cron from 'node-cron';
import { orm } from '../db/orm.js';
import { Turno } from '../../turno/turno.entity.js';
import { CRON_CONFIG } from './cronConfig.js';
import { sendEmail } from '../../mail/mail.js';
export class CronJobs {
  /**
   * Opciones globales para todos los cron jobs
   */
  private static getCronOptions() {
    return {
      timezone: CRON_CONFIG.timezone,
    };
  }

  /**
   * Inicializa todos los cron jobs
   */
  static initializeCronJobs(): void {
    console.log('🕐 Inicializando cron jobs...');

    // Cambiar estado de turnos no confirmados (diariamente a medianoche)
    this.changestate();

    // Inicializar el recordatorio de turnos
    this.reminder();

    console.log(
      `✅ Cron jobs inicializados correctamente (Timezone: ${CRON_CONFIG.timezone})`
    );
  }

  /**
   * Cron job de prueba que se ejecuta cada minuto
   * Usar solo para testing, comentar en producción
   */
  private static testCronJob(): void {
    cron.schedule(
      '* * * * *',
      () => {
        console.log(
          '🔄 Test cron job ejecutándose cada minuto:',
          new Date().toISOString()
        );
      },
      this.getCronOptions()
    );
  }

  /**
   * Detiene todos los cron jobs activos
   */
  static destroyAllCronJobs(): void {
    cron.getTasks().forEach((task) => {
      task.destroy();
    });
    console.log('🛑 Todos los cron jobs han sido detenidos');
  }

  /**
   * Cambia el estado de turnos no confirmados a "cancelado" cada día a medianoche
   */
  static changestate(): void {
    cron.schedule(
      '0 0 * * *', // Real pasa cada media noche
      //'* * * * *', // Para probar se ejecuta todos los minutos.
      async () => {
        console.log(
          '🔄 [changestate] Cron job ejecutado:',
          new Date().toISOString()
        );
        console.log('🔄 Cambiando estado de turnos no confirmados:');

        try {
          const em = orm.em.fork(); // Crear una instancia del EntityManager

          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);

          const turnosVencidos = await em.find(Turno, {
            fechaHora: { $gte: todayStart, $lte: todayEnd },
            estado: 'pendiente',
          });

          //  Actualizar estado
          for (const turno of turnosVencidos) {
            turno.estado = 'cancelado';
            sendEmail(
              turno.servicio.usuario.mail,
              'Turno Cancelado',
              `El turno con ID ${turno.id} ha sido cancelado por no ser confirmado.`
            );
            console.log(`❌ Turno cancelado: ${turno.id}`);
          }

          //  Guardar cambios
          await em.flush();

          console.log(
            `✅ ${turnosVencidos.length} turnos marcados como cancelados`
          );
        } catch (error) {
          console.error('❌ Error en changestate:', error);
        }
      },
      this.getCronOptions()
    );
  }
  static reminder(): void {
    cron.schedule(
      '0,30 * * * *', // Cada 30 minutos, empezando en 00:00
      async () => {
        const now = new Date();
        const reminderTime = new Date(now);
        reminderTime.setDate(now.getDate() + 1); // Mañana, misma hora que ahora
        reminderTime.setMinutes(now.getMinutes() < 30 ? 30 : 0); // Ajusta a 00 o 30
        reminderTime.setSeconds(0, 0); // Segundos en 00
        console.log(
          '🔄 [reminder] Cron job ejecutado:',
          reminderTime.toISOString()
        );
        console.log('🔔 Enviando recordatorios de turnos:');

        try {
          const em = orm.em.fork(); // Crear una instancia del EntityManager

          // Obtener turnos que comienzan mañana a esta hora
          const turnos = await em.find(Turno, {
            estado: { $ne: 'cancelado' },
            fechaHora: reminderTime, // Solo los que arrancan exactamente mañana a esta hora
          });

          // Enviar recordatorios
          for (const turno of turnos) {
            console.log(`📅 Recordatorio enviado para el turno: ${turno.id}`);
            sendEmail(
              turno.servicio.usuario.mail,
              'Recordatorio de Turno',
              `Tienes un turno programado para el ${turno.fechaHora.toLocaleString()}. Del servicio ${
                turno.servicio.tarea.nombreTarea
              }.`
            );
          }

          console.log(`✅ ${turnos.length} recordatorios enviados`);
        } catch (error) {
          console.error('❌ Error en reminder:', error);
        }
      },
      this.getCronOptions()
    );
  }
}
