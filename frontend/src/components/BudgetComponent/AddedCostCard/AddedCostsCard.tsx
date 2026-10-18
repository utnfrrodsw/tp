// AddedCostsCard.tsx
import imgAddedCost1 from '@/assets/imgAddedCost1.svg';
import AddedCostBudgetTable, {
  type AddedCostRow,
} from '@/components/AddedCost/AddedCostBudgetTable/AddedCostBudgetTable';
import ActionButton from '@/components/Common/Buttons/ActionButton';
import SectionCard from '../SectionCard/SectionCard';
import styles from './AddedCostsCard.module.css';

export interface AddedCostsCardProps {
  items: AddedCostRow[];
  onChange: (next: AddedCostRow[]) => void | Promise<void>;
  onAdd: () => void;
  /** Deshabilita tabla y botón (por ejemplo, si no existe el presupuesto) */
  disabled?: boolean;
  error?: string | null;
}

export default function AddedCostsCard({
  items,
  onChange,
  onAdd,
  disabled = false,
  error,
}: AddedCostsCardProps) {
  return (
    <SectionCard
      icon={<img src={imgAddedCost1} alt="Icono de agregar costo" />}
      iconIsImage
      title="Costos Adicionales y Repuestos"
      description="Agrega los costos adicionales a tu presupuesto."
      contentVariant="table"
      footerBetween
      footer={
        <>
          <span className={styles.tableHelper}>Agrega repuestos, insumos u otros costos.</span>
          <ActionButton
            label="Agregar Costo"
            onClick={onAdd}
            icon={null}
            variant="neutral"
            disabled={disabled}
          />
        </>
      }
    >
      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.table}>
        <AddedCostBudgetTable
          items={items}
          onChange={onChange}
          allowAdd={false}
          disabled={disabled}
        />
      </div>
    </SectionCard>
  );
}