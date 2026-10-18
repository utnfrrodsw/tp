// LaborCostCard.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import ActionButton from '@/components/Common/Buttons/ActionButton';
import SectionCard from '../SectionCard/SectionCard';
import styles from './LaborCostCard.module.css';

export interface LaborCostCardProps {
  /** Valor guardado actualmente (null/undefined si todavía no hay presupuesto) */
  savedLaborCost?: number | string | null;
  /** true si el presupuesto aún no existe: muestra la ayuda de creación */
  isNewBudget?: boolean;
  /** Debe lanzar un Error si falla; el mensaje se muestra en la card */
  onSave: (laborCost: number) => Promise<void>;
  currencyLabel?: string;
}

export default function LaborCostCard({
  savedLaborCost,
  isNewBudget = false,
  onSave,
  currencyLabel = 'ARS',
}: LaborCostCardProps) {
  const [inputCost, setInputCost] = useState(
    savedLaborCost != null ? String(savedLaborCost) : ''
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(parseFloat(inputCost) || 0);
    } catch (e) {
      console.error('Error guardando la mano de obra:', e);
      setError(e instanceof Error ? e.message : 'No se pudo guardar el presupuesto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      icon={<span>$</span>}
      title="Mano de Obra"
      description="Ingresa el costo de la mano de obra"
      footer={
        <>
          <ActionButton
            label={saving ? 'Guardando...' : 'Actualizar mano de obra'}
            onClick={handleSave}
            icon={null}
            disabled={saving}
          />
          {isNewBudget && (
            <p className={styles.helperText}>
              Para crear el presupuesto ingresa el valor de mano de obra inicial.
            </p>
          )}
        </>
      }
    >
      <div className={styles.field}>
        <label htmlFor="laborCost" className={styles.label}>
          Mano de obra especializada
        </label>

        <div className={styles.inputWrapper}>
          <Input
            id="laborCost"
            name="laborCost"
            value={inputCost}
            type="number"
            placeholder="0.00"
            onChange={(e) => setInputCost(e.target.value)}
            className={styles.input}
            disabled={saving}
          />
          <span className={styles.inputSuffix}>{currencyLabel}</span>
        </div>

        <p className={styles.helperText}>Tarifa del técnico aplicada al presupuesto.</p>

        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      <div className={styles.savedValue}>
        <span>Valor guardado actual</span>
        <strong>${Number(savedLaborCost ?? 0).toFixed(2)}</strong>
      </div>
    </SectionCard>
  );
}