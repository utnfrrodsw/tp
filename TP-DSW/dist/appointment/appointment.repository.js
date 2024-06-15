import { Appointment } from './appointment.entity.js';
const appointments = [
    new Appointment("1", new Date("2024-07-20"), true),
];
export class AppointmentRepository {
    findAll() {
        return appointments;
    }
    findOne(item) {
        return appointments.find((appointment) => item.id === appointment.appoNumber);
    }
    add(item) {
        appointments.push(item);
        return item;
    }
    update(item) {
        const appointmentId = appointments.findIndex((appointment) => appointment.appoNumber === item.appoNumber);
        if (appointmentId === -1) {
            Object.assign(appointments[appointmentId], item);
        }
        return appointments[appointmentId];
    }
    delete(item) {
        const appointmentId = appointments.findIndex((appointment) => (appointment.appoNumber = item.id));
        if (appointmentId !== -1) {
            const delappointment = appointments[appointmentId];
            appointments.splice(appointmentId, 1);
            return delappointment;
        }
    }
}
//# sourceMappingURL=appointment.repository.js.map