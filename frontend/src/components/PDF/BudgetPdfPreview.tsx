import { PDFViewer } from '@react-pdf/renderer';
import BudgetPdfDocument, { type BudgetWithRelations } from './BudgetPDFDocument';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BACKEND_URL from '@/lib/config';

export interface BudgetPdfPreviewProps {
  budget?: BudgetWithRelations;
  id_budget?: string;
}

export default function BudgetPdfPreview({ budget: budgetProp, id_budget: idProp,}: BudgetPdfPreviewProps) {
  const { id_budget: idFromUrl } = useParams<{ id_budget: string }>();
  const id_budget = idProp ?? idFromUrl;

  const [fetchedBudget, setFetchedBudget] = useState<BudgetWithRelations | null>(null);

  useEffect(() => {
    if (budgetProp || !id_budget) return;

    const controller = new AbortController();

    const fetchBudget = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/budgets/${id_budget}`, {
          credentials: 'include',
          method: 'GET',
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }
        const data: BudgetWithRelations = await response.json();
        setFetchedBudget(data);
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        console.error('Error al obtener el presupuesto', e);
      }
    };

    fetchBudget();

    // Cancela el fetch si el componente se desmonta o cambia el id
    return () => controller.abort();
  }, [budgetProp, id_budget]);

  // Prioridad: el presupuesto por prop, si no, el que se trajo del backend
  const budget = budgetProp ?? fetchedBudget;

  if (!budget) return null; // o un spinner/loading

  return (
    <PDFViewer style={{ width: '100%', height: '80vh', border: 'none' }}>
      <BudgetPdfDocument budget={budget} />
    </PDFViewer>
  );
}