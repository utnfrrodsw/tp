import  {type AddedCostRow} from "@/components/AddedCost/AddedCostBudgetTable/AddedCostBudgetTable";
import DetailBudget from "@/components/BudgetComponent/DetailBudget/DetailBudget";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Budget, Order } from "@/types/types";
import styles from "./CreateBudget.module.css";
import CreateAddedCost from "@/components/AddedCost/CreateAddedCost/CreateAddedCost";
import BACKEND_URL from "@/lib/config";
import { EVENTS, eventBus } from "@/lib/eventBus";
import AddedCostsCard from "../AddedCostCard/AddedCostsCard";
import LaborCostCard from "../LaborCostCard/LaborCostCard";

interface CreateBudgetProps {
    order: Order;
    onClick?: () => void;
}

const CreateBudget = ({ order }: CreateBudgetProps) => {
    const [budget, setBudget] = useState<Budget | null>(order.budget ?? null);
    const [addedCosts, setAddedCosts] = useState<AddedCostRow[]>([]);
    const [addedCostsError, setAddedCostsError] = useState<string | null>(null);

    const [newAddedCost, setNewAddedCost] = useState(false);

    const navigate = useNavigate();


    const fetchAddedCosts = async (id_budget: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/added-cost/ofBudget/${id_budget}`, {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status} al obtener los costos adicionales`);
            }

            const data: Array<{
                id_addedCost: string;
                type_addedCost: AddedCostRow["type_addedCost"];
                addedCostDescription: string;
                addedCostAmount: number;
            }> = await res.json();

            setAddedCosts(
                data.map((item) => ({
                    rowId: item.id_addedCost,
                    id_addedCost: item.id_addedCost,
                    type_addedCost: item.type_addedCost,
                    addedCostDescription: item.addedCostDescription,
                    addedCostAmount: item.addedCostAmount,
                }))
            );
        } catch (e) {
            console.error("Error al obtener los costos adicionales:", e);
        }
    };

    const refreshBudget = async (id_budget: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/budgets/${id_budget}`, {
                credentials: "include",
            });

            if (!res.ok) return;

            const updated: Budget = await res.json();
            setBudget(updated);
        } catch (e) {
            console.error("Error al refrescar el presupuesto:", e);
        }
    };

    useEffect(() => {
        if (budget?.id_budget) {
            fetchAddedCosts(budget.id_budget);
        }
    }, [budget?.id_budget]);

    useEffect(() => {
        const unsubscribe = eventBus.on(EVENTS.budgetChanged, () => {
            if (budget?.id_budget) {
                fetchAddedCosts(budget.id_budget);
                refreshBudget(budget.id_budget);
            }
        });
        return unsubscribe;
    }, [budget?.id_budget]);

    const handleSaveLaborCost = async (laborCost: number) => {
        const method = budget ? 'PUT' : 'POST';
        const url = budget
            ? `${BACKEND_URL}/api/budgets/modifyBudget/${budget.id_budget}`
            : `${BACKEND_URL}/api/budgets`;

        const payload = budget ? { laborCost } : { id_order: order.id_order, laborCost };

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `Error ${response.status} al guardar el presupuesto`);
        }

        const updatedBudget: Budget = await response.json();
        setBudget(updatedBudget);
        eventBus.emit(EVENTS.budgetChanged, updatedBudget);
        };

    const handleAddedCostsChange = async (next: AddedCostRow[]) => {
        const prevById = new Map(addedCosts.map((row) => [row.rowId, row]));

        const edited = next.filter((row) => {
            if (!row.id_addedCost) return false;
            const prev = prevById.get(row.rowId);
            if (!prev) return false;
            return (
                prev.type_addedCost !== row.type_addedCost ||
                prev.addedCostDescription !== row.addedCostDescription ||
                prev.addedCostAmount !== row.addedCostAmount
            );
        });

        const rowWasRemoved = next.length < addedCosts.length;

        setAddedCosts(next);
        setAddedCostsError(null);

        if (edited.length === 0 && !rowWasRemoved) return;

        try {
            await Promise.all(
                edited.map((row) =>
                    fetch(`${BACKEND_URL}/api/added-cost/${row.id_addedCost}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            type_addedCost: row.type_addedCost,
                            addedCostDescription: row.addedCostDescription,
                            addedCostAmount: row.addedCostAmount,
                        }),
                    }).then((res) => {
                        if (!res.ok) {
                            throw new Error(`Error ${res.status} al actualizar el costo adicional`);
                        }
                    })
                )
            );

            if (budget?.id_budget) {
                await refreshBudget(budget.id_budget);
                eventBus.emit(EVENTS.budgetChanged, budget);
            }
        } catch (e) {
            console.error("Error al sincronizar costos adicionales:", e);
            setAddedCostsError(
                e instanceof Error ? e.message : "No se pudo guardar el cambio en costos adicionales."
            );
        }
    };

    const handleIssueBudget = async ({ sendEmail }: { sendEmail: boolean }) => {
        if (!budget) return;

        try {
            if (sendEmail) {
                await fetch(`${BACKEND_URL}/api/budgets/${budget.id_budget}/send-email`, {
                    method: 'POST',
                    credentials: 'include',
                });
            }

        } catch (e) {
            console.error('Error al emitir el presupuesto:', e);
        }
    };

    const closeModalAddedCost = () => {
        setNewAddedCost(false);
        if (budget?.id_budget) {
            fetchAddedCosts(budget.id_budget);
            refreshBudget(budget.id_budget);
        }
    };
    useEffect(() => {
        const refresh = () => {
            if (budget?.id_budget) {
                fetchAddedCosts(budget.id_budget);
                refreshBudget(budget.id_budget);
            }
        };
        const offBudget = eventBus.on(EVENTS.budgetChanged, refresh);
        const offAddedCost = eventBus.on(EVENTS.addedCostChanged, refresh);
        return () => {
            offBudget();
            offAddedCost();
        };
    }, [budget?.id_budget]);

return (
    <div className={styles.page}>
        <div className={styles.layout}>
           <main className={styles.main}>
                <LaborCostCard
                    savedLaborCost={budget?.laborCost}
                    isNewBudget={budget == null}
                    onSave={handleSaveLaborCost}
                />

                <AddedCostsCard
                    items={addedCosts}
                    onChange={handleAddedCostsChange}
                    onAdd={() => setNewAddedCost(true)}
                    disabled={!budget}
                    error={addedCostsError}
                />
                </main>

            {budget != null && (
                <aside className={styles.sidebar}>
                    <div className={styles.summarySticky}>
                        <DetailBudget
                            budget={budget}
                            onIssue={handleIssueBudget}
                            onSaveDraft={()=>{}}
                            onCancel={() => navigate(-1)}
                        />
                    </div>
                </aside>
            )}
        </div>

        {newAddedCost && budget && (
            <div
                className={styles.modalOverlay}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        closeModalAddedCost();
                    }
                }}
            >
                <div className={styles.modalContent}>
                    <button
                        type="button"
                        className={styles.modalClose}
                        onClick={closeModalAddedCost}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>

                    <CreateAddedCost budget={budget} />
                </div>
            </div>
        )}
    </div>
);
};

export default CreateBudget;