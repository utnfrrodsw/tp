import type { PaginatedResult } from "@/shared/base.repository.js";
import type { PaymentQueryDto } from "./payment.schema.js";
import type { PaymentRepository } from "./payment.repository.js";
import { Payment } from "./payment.entity.js";

export class PaymentService {
    constructor(private repo: PaymentRepository) { }

    findAll(query?: PaymentQueryDto): Promise<PaginatedResult<Payment>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<Payment | undefined> {
        return this.repo.findById(id);
    }

    findByBudgetId(id_budget: string): Promise<Payment[]> {
        return this.repo.findByBudgetId(id_budget);
    }

    // TODO: si en algún momento hay que marcar la orden como cobrada del
    // todo (o setear Order.totalCharged) cuando la suma de payments
    // alcanza el estimatedTotal del budget, se engancha acá. No lo
    // implemento porque no se definió esa regla todavía.
    create(input: Omit<Payment, "id_payment">): Promise<Payment> {
        return this.repo.create(input as Payment);
    }

    update(id: string, input: Partial<Payment>): Promise<Payment | undefined> {
        return this.repo.update(id, input);
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }
}
