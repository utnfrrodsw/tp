import { useCallback, useEffect, useState } from 'react';
import BACKEND_URL from '@/lib/config';
import { EVENTS, eventBus } from '@/lib/eventBus';

interface BudgetTotals {
  failuresTotal: number;
  addedCostsTotal: number;
  loading: boolean;
  error: string | null;
}

export function useBudgetTotals(id_order?: string, id_budget?: string): BudgetTotals {
  const [failuresTotal, setFailuresTotal] = useState(0);
  const [addedCostsTotal, setAddedCostsTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotals = useCallback(async () => {
    if (!id_order || !id_budget) return;

    setLoading(true);
    setError(null);

    try {
      const [failuresRes, addedCostsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/failures/ofOrder/${id_order}/total`, {
          credentials: 'include',
        }),
        fetch(`${BACKEND_URL}/api/added-cost/ofBudget/${id_budget}/total`, {
          credentials: 'include',
        }),
      ]);

      if (!failuresRes.ok || !addedCostsRes.ok) {
        throw new Error('No se pudieron obtener los totales del presupuesto.');
      }

      const failuresData: { total: number } = await failuresRes.json();
      const addedCostsData: { total: number } = await addedCostsRes.json();
      
      setFailuresTotal(failuresData.total);
      setAddedCostsTotal(addedCostsData.total);
    } catch (e) {
      console.error('Error al obtener los totales del presupuesto:', e);
      setError(e instanceof Error ? e.message : 'Error al obtener los totales.');
    } finally {
      setLoading(false);
    }
  }, [id_order, id_budget]);

  useEffect(() => {
    fetchTotals();
    const unsubscribe = eventBus.on(EVENTS.budgetChanged, fetchTotals);
    return unsubscribe;
  }, [fetchTotals]);
  useEffect(() => {
    fetchTotals();
    const offBudget = eventBus.on(EVENTS.budgetChanged, fetchTotals);
    const offAddedCost = eventBus.on(EVENTS.addedCostChanged, fetchTotals);
    return () => {
      offBudget();
      offAddedCost();
    };
  }, [fetchTotals]);
  return { failuresTotal, addedCostsTotal, loading, error };
}