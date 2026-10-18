import type { EnumOrderStatus, Order } from '@/types/types';

export const FLOW: EnumOrderStatus[] = [    
    'recibido', 'diagnostico', 'presupuestado', 'aprobado',
    'reparacion', 'listo', 'entregado',
];

export function getCurrentStatus(order: Order): EnumOrderStatus {
    const latest = [...(order.statusHistory ?? [])].sort(
        (a, b) => new Date(b.dateOfChange).getTime() - new Date(a.dateOfChange).getTime()
    )[0];
    return latest?.status ?? order.status;
    }

export function getBlockReason(order: Order, target: EnumOrderStatus): string | null {
    const current = getCurrentStatus(order);

    if (target === current) return 'La orden ya está en ese estado.';
    if (current === 'cancelado') return 'La orden está cancelada y no puede cambiar de estado.';

    if (target === 'cancelado') {
        return current === 'entregado' ? 'No se puede cancelar una orden ya entregada.' : null;
    }

    const from = FLOW.indexOf(current);
    const to = FLOW.indexOf(target);

    if (Math.abs(to - from) !== 1) {
        return 'Solo se puede avanzar o retroceder un paso a la vez.';
    }

    // Retroceder no se bloquea
    if (to < from) return null;

    // Reglas para avanzar
    if (target === 'presupuestado' && !order.budget) {
        return 'Primero hay que crear el presupuesto.';
    }
    if (target === 'aprobado' && order.budget?.status !== 'aprobado') {
        return 'El cliente todavía no aprobó el presupuesto.';
    }
    return null;
}