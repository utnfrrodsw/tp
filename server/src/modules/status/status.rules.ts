import type { $Enums } from "@/database/prisma.js";

type Status = $Enums.EnumOrderStatus;

const FLOW: Status[] = [
    "recibido", "diagnostico", "presupuestado", "aprobado",
    "reparacion", "listo", "entregado",
];

interface OrderForRules {
    status?: Status;
    budget?: { status?: $Enums.EnumBudgetStatus } | null;
}

export function getBlockReason(order: OrderForRules, target: Status): string | null {
    const current = order.status;
    if (!current) return "La orden no tiene un estado actual definido.";
    if (target === current) return "La orden ya está en ese estado.";
    if (current === "cancelado") return "La orden está cancelada y no puede cambiar de estado.";

    if (target === "cancelado") {
        return current === "entregado" ? "No se puede cancelar una orden ya entregada." : null;
    }

    const from = FLOW.indexOf(current);
    const to = FLOW.indexOf(target);

    if (Math.abs(to - from) !== 1) return "Solo se puede avanzar o retroceder un paso a la vez.";

    if (to < from) return null; 

    if (target === "presupuestado" && !order.budget) return "Primero hay que crear el presupuesto.";
    if (target === "aprobado" && order.budget?.status !== "aprobado") {
        return "El cliente todavía no aprobó el presupuesto.";
    }
    return null;
}