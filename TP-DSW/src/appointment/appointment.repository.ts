/*import { Repository } from '../shared/repository.js';
import { Appointment } from './appointment.entity.js';

const appointments: Appointment[] = [
  new Appointment("1", new Date ("2024-07-20") ,true),
];

export class AppointmentRepository implements Repository<Appointment> {
  public findAll(): Appointment[] | undefined {
    return appointments;
  }

  public findOne(item: { id: string }): Appointment | undefined {
    return appointments.find((appointment) => item.id === appointment.appoNumber);
  }

  public add(item: Appointment): Appointment | undefined {
    appointments.push(item);
    return item;
  }

  public update(item: Appointment): Appointment | undefined {
    const appointmentId = appointments.findIndex(
      (appointment) => appointment.appoNumber === item.appoNumber
    );
    if (appointmentId === -1) {
      Object.assign(appointments[appointmentId], item);
    }
    return appointments[appointmentId];
  }

  public delete(item: { id: string }): Appointment | undefined {
    const appointmentId = appointments.findIndex(
      (appointment) => (appointment.appoNumber = item.id)
    );
    if (appointmentId !== -1) {
      const delappointment = appointments[appointmentId];
      appointments.splice(appointmentId, 1);
      return delappointment;
    }
  }
}*/
