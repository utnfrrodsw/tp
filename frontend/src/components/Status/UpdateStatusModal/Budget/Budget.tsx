import type { Order } from "@/types/types";
import CreateBudget from "@/components/BudgetComponent/CrateBudget/CreateBudget"

export type BudgetProps = {
    order: Order;
}

const Budget = ({ order }: BudgetProps) => {
    return (
        <div>
            <CreateBudget order={order} />
        </div>
    )
}
export default Budget;