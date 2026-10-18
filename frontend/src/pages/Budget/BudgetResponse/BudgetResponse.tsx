// BudgetResponse.tsx
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type BudgetWithRelations } from '@/components/PDF/BudgetPDFDocument';
import ActionButton from '@/components/Common/Buttons/ActionButton';
import BACKEND_URL from '@/lib/config';
import styles from './BudgetResponse.module.css';
import BudgetView from '../BudgetView/BudgetView';
import { eventBus, EVENTS } from '@/lib/eventBus';

type Decision = 'approved' | 'rejected' | 'suggestion';

const SUCCESS_MESSAGES: Record<Decision, string> = {
  approved: '¡Gracias! Aprobaste el presupuesto.',
  rejected: 'Registramos que rechazaste el presupuesto.',
  suggestion: 'Enviamos tu sugerencia. Vamos a revisar el presupuesto y te contactamos.',
};

const BudgetResponse = () => {
  const { token } = useParams<{ token: string }>();
  const [budget, setBudget] = useState<BudgetWithRelations | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState<Decision | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Decision | null>(null);

  // Ref para que los listeners lean siempre el id actual sin re-suscribirse
  const budgetIdRef = useRef<string | null>(null);
  useEffect(() => {
    budgetIdRef.current = budget?.id_budget ?? null;
  }, [budget?.id_budget]);

  const fetchBudget = useCallback(
    async (signal?: AbortSignal) => {
      if (!token) return;
      try {
        const response = await fetch(`${BACKEND_URL}/api/budgets/public/${token}`, { signal });
        if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);

        setBudget(await response.json());
        setError(null);
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        console.error('Error al obtener el presupuesto', e);
        setError('No se pudo cargar el presupuesto');
      }
    },
    [token]
  );

  // 1) Carga inicial
    useEffect(() => {
        if (!token) {
        setError('Token no encontrado');
        return;
        }

        const controller = new AbortController();
        fetchBudget(controller.signal);
        return () => controller.abort();
    }, [token, fetchBudget]);

    useEffect(() => {
        const unsubscribeChanged = eventBus.on(EVENTS.budgetChanged, async (payload) => {
        const data = payload as { id_budget?: string };

        if (!data?.id_budget || data.id_budget === budgetIdRef.current) {
            await fetchBudget();
        }
        });

        const unsubscribeDeleted = eventBus.on(EVENTS.budgetDeleted, (payload) => {
        const data = payload as { id_budget?: string };

        if (!data?.id_budget || data.id_budget === budgetIdRef.current) {
            setError('Este presupuesto ya no se encuentra disponible.');
            setBudget(null);
        }
        });

        return () => {
        unsubscribeChanged();
        unsubscribeDeleted();
        };
    }, [fetchBudget]);

    useEffect(() => {
        if (
        budget?.status === 'pendiente' &&
        (completed === 'approved' || completed === 'rejected')
        ) {
        setCompleted(null);
        }
    }, [budget, completed]);

    const submitResponse = async (decision: Decision) => {
        if (!token) return;

        if (decision === 'suggestion' && !suggestion.trim()) {
        setSubmitError('Escribí tu sugerencia antes de enviarla.');
        return;
        }

        setSubmitting(decision);
        setSubmitError(null);

        try {
        const response = await fetch(`${BACKEND_URL}/api/budgets/public/${token}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            decision,
            client_suggestion: decision === 'suggestion' ? suggestion.trim() : undefined,
            }),
        });

        if (response.status === 409) {
        setSubmitError('Este presupuesto ya fue respondido.');
        await fetchBudget();
        return;
        }
        if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);

        await fetchBudget();          
        setCompleted(decision);
        setShowSuggestion(false);
        setSuggestion('');
        } catch (e) {
        console.error('Error al enviar la respuesta', e);
        setSubmitError('No se pudo enviar tu respuesta. Probablemente el presupuesto ya fue respondido, de no ser asi intenta de nuevo.');
        } finally {
        setSubmitting(null);
        }
    };

    if (error) return <div className={styles.state}>{error}</div>;
    if (!budget) return <div className={styles.state}>Cargando presupuesto...</div>;

    const busy = submitting !== null;
    const alreadyAnswered = budget.status !== 'pendiente';

    return (
        <div className={styles.page}>
        <div className={styles.card}>
            <h1 className={styles.title}>Presupuesto Recibido</h1>
            <p className={styles.subtitle}>
            A continuación, puede ver el presupuesto que le hemos enviado. Por favor, revise los
            detalles y tome las acciones necesarias.
            </p>

            <div className={styles.pdfWrapper}>
            <BudgetView budget={budget} />
            </div>

            {completed ? (
            <div className={`${styles.feedback} ${styles.success}`} role="status">
                {SUCCESS_MESSAGES[completed]}
            </div>
            ) : alreadyAnswered ? (
            <div className={`${styles.feedback} ${styles.success}`} role="status">
                Este presupuesto ya fue {budget.status === 'aprobado' ? 'aprobado' : 'rechazado'}.
            </div>
            ) : (
            <>
                <div className={styles.actions}>
                <ActionButton
                    label="Aprobar"
                    icon="✓"
                    variant="primary"
                    fullWidth
                    loading={submitting === 'approved'}
                    disabled={busy}
                    onClick={() => submitResponse('approved')}
                />
                <ActionButton
                    label="Sugerir cambios"
                    icon="✎"
                    variant="neutral"
                    fullWidth
                    disabled={busy}
                    onClick={() => setShowSuggestion((prev) => !prev)}
                />
                <ActionButton
                    label="Rechazar"
                    icon="✕"
                    variant="danger"
                    fullWidth
                    loading={submitting === 'rejected'}
                    disabled={busy}
                    onClick={() => submitResponse('rejected')}
                />
                </div>

                {showSuggestion && (
                <div className={styles.suggestionBox}>
                    <label htmlFor="client-suggestion" className={styles.suggestionLabel}>
                    ¿Qué te gustaría modificar?
                    </label>
                    <textarea
                    id="client-suggestion"
                    className={styles.textarea}
                    rows={4}
                    maxLength={1000}
                    placeholder="Ej: Me gustaría reducir la cantidad de..."
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    disabled={busy}
                    />
                    <div className={styles.suggestionFooter}>
                    <span className={styles.counter}>{suggestion.length}/1000</span>
                    <ActionButton
                        label="Enviar sugerencia"
                        icon="➤"
                        variant="primary"
                        loading={submitting === 'suggestion'}
                        disabled={busy || !suggestion.trim()}
                        onClick={() => submitResponse('suggestion')}
                    />
                    </div>
                </div>
                )}

                {submitError && (
                <div className={`${styles.feedback} ${styles.errorMsg}`} role="alert">
                    {submitError}
                </div>
                )}
            </>
            )}
        </div>
        </div>
    );
};

export default BudgetResponse;