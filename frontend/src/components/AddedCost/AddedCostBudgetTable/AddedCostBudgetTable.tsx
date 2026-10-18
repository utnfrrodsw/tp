import { useState } from "react";
import DataTable, { type ColumnConfig } from "@/components/Common/DataTable/DataTable";
import ConfirmDialog from "@/components/Common/ConfirmDialog/ConfirmDialog";
import { Trash2 } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";
import styles from "./AddedCostBudgetTable.module.css";
import type { EnumTypeAddedCost } from "@/types/types"

const TYPE_LABELS: Record<EnumTypeAddedCost, string> = {
  repuesto: "Repuesto",
  procedimientoEspecial: "Procedimiento especial",
  garantia: "Garantía",
  reparacionExpress: "Reparación express",
  limpiezaPuestaAPunto: "Limpieza y puesta a punto",
  serviciosSoftware: "Servicios de software",
};

const TYPE_OPTIONS = Object.entries(TYPE_LABELS) as [EnumTypeAddedCost, string][];

export interface AddedCostRow {
  rowId: string;
  id_addedCost?: string;
  type_addedCost: EnumTypeAddedCost;
  addedCostDescription: string;
  addedCostAmount: number;
}

export interface AddedCostBudgetTableProps {
  items: AddedCostRow[];
  onChange: (items: AddedCostRow[]) => void;
  disabled?: boolean;
  allowAdd?: boolean;
}

const AddedCostBudgetTable = ({
  items,
  onChange,
  disabled = false,
}: AddedCostBudgetTableProps) => {

  const [deletingRowId, setDeletingRowId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<AddedCostRow | null>(null);

  const updateRow = (rowId: string, patch: Partial<AddedCostRow>) => {
    onChange(items.map((row) => (row.rowId === rowId ? { ...row, ...patch } : row)));
  };
  const confirmRemove = async () => {
    if (!pendingDelete) return;
    const row = pendingDelete;
    setDeleteError(null);

    if (!row.id_addedCost) {
      onChange(items.filter((r) => r.rowId !== row.rowId));
      setPendingDelete(null);
      return;
    }

    setDeletingRowId(row.rowId);

    try {
      const res = await fetch(`${BACKEND_URL}/api/added-cost/${row.id_addedCost}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Error ${res.status} al eliminar el costo adicional`);
      }

      onChange(items.filter((r) => r.rowId !== row.rowId));
    } catch (e) {
      console.error("Error al eliminar el costo adicional:", e);
      setDeleteError(
        e instanceof Error ? e.message : "No se pudo eliminar el costo adicional."
      );
    } finally {
      setDeletingRowId(null);
      setPendingDelete(null);
    }
  };

  const columns: ColumnConfig<AddedCostRow>[] = [
    {
      key: "type_addedCost",
      label: "Tipo",
      render: (row) => (
        <select
          className={styles.select}
          value={row.type_addedCost}
          disabled={disabled || deletingRowId === row.rowId}
          onChange={(e) =>
            updateRow(row.rowId, { type_addedCost: e.target.value as EnumTypeAddedCost })
          }
        >
          {TYPE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "addedCostDescription",
      label: "Descripción",
      render: (row) => (
        <input
          type="text"
          className={styles.input}
          placeholder="Describí el costo adicional"
          value={row.addedCostDescription}
          disabled={disabled || deletingRowId === row.rowId}
          onChange={(e) => updateRow(row.rowId, { addedCostDescription: e.target.value })}
        />
      ),
    },
    {
      key: "addedCostAmount",
      label: "Monto",
      isTotalField: true,
      format: (value) => `$ ${Number(value).toLocaleString("es-AR")}`,
      render: (row) => (
        <div className={styles.amountWrap}>
          <span className={styles.currencyPrefix}>$</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className={styles.amountInput}
            value={row.addedCostAmount}
            disabled={disabled || deletingRowId === row.rowId}
            onChange={(e) => updateRow(row.rowId, { addedCostAmount: Number(e.target.value) })}
          />
        </div>
      ),
    },
    {
      key: "rowId",
      label: "Acción",
      render: (row) => (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => setPendingDelete(row)}
          disabled={disabled || deletingRowId === row.rowId}
          aria-label="Eliminar costo adicional"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className={styles.wrap}>
      {deleteError && <p className={styles.errorText}>{deleteError}</p>}

      <DataTable<AddedCostRow>
        data={items}
        idField="rowId"
        columns={columns}
        showTotal
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar costo adicional"
        message={
          pendingDelete
            ? `¿Seguro que querés eliminar "${pendingDelete.addedCostDescription || TYPE_LABELS[pendingDelete.type_addedCost]}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AddedCostBudgetTable;