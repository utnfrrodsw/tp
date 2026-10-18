import type { BudgetWithRelations } from '@/components/PDF/BudgetPDFDocument';
import {
  ADDED_COST_LABEL,
  EQUIPMENT_LABEL,
  STATUS_LABEL,
  calcBudgetTotal,
  formatDate,
  pad,
} from '@/components/PDF/budget.shared';
import { formatMoney } from '@/lib/utils';
import styles from './BudgetView.module.css';

export interface BudgetViewProps {
  budget: BudgetWithRelations;
}

export default function BudgetView({ budget }: BudgetViewProps) {
  const { equipment } = budget.order;
  const { client } = equipment;

  const laborCost = Number(budget.laborCost) || 0;
  const discount = Number(budget.discount) || 0;

  return (
    <article className={styles.document}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.companyName}>TechFix</h2>
          <p className={styles.tagline}>Servicio técnico especializado</p>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.docType}>PRESUPUESTO</span>
          <span className={styles.meta}>N° {pad(budget.nroBudget)}</span>
          <span className={styles.meta}>Fecha: {formatDate(budget.budgetDate)}</span>
          <span className={`${styles.badge} ${styles[`status_${budget.status}`]}`}>
            {STATUS_LABEL[budget.status]}
          </span>
        </div>
      </header>

      <hr className={styles.divider} />

      {/* Cliente / Equipo */}
      <section className={styles.infoRow}>
        <div className={styles.infoBlock}>
          <h3 className={styles.infoTitle}>Cliente</h3>
          <p>{client.clientName}</p>
          <p>{client.clientEmail}</p>
          <p>{client.clientPhone}</p>
        </div>

        <div className={styles.infoBlock}>
          <h3 className={styles.infoTitle}>Equipo</h3>
          <p>
            {EQUIPMENT_LABEL[equipment.tipo_equipment]} — {equipment.brand} {equipment.model}
          </p>
          {equipment.observations && <p>Obs: {equipment.observations}</p>}
          <p>Orden N° {pad(budget.order.nroOrder)}</p>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* Detalle */}
      <h3 className={styles.sectionTitle}>Detalle del presupuesto</h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colDescription}>Concepto</th>
              <th className={styles.colAmount}>Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mano de obra especializada</td>
              <td className={styles.colAmount}>{formatMoney(laborCost)}</td>
            </tr>

            {budget.order.failures.map((f) => (
              <tr key={f.id_failure}>
                <td>Falla: {f.failureType?.failureDescription}</td>
                <td className={styles.colAmount}>
                  {formatMoney(Number(f.failureType?.estimatedImport) || 0)}
                </td>
              </tr>
            ))}

            {budget.addedCosts.map((c) => (
              <tr key={c.id_addedCost}>
                <td>
                  {ADDED_COST_LABEL[c.type_addedCost]}: {c.addedCostDescription}
                </td>
                <td className={styles.colAmount}>
                  {formatMoney(Number(c.addedCostAmount) || 0)}
                </td>
              </tr>
            ))}

            {discount > 0 && (
              <tr className={styles.discountRow}>
                <td>Descuento bonificado</td>
                <td className={styles.colAmount}>-{formatMoney(discount)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total estimado</span>
        <span className={styles.totalValue}>{formatMoney(calcBudgetTotal(budget))}</span>
      </div>

      <p className={styles.footerNote}>
        Este documento es un presupuesto estimado y puede sufrir variaciones una vez iniciada la
        reparación, sujeto a la aprobación previa del cliente. Validez: 15 días desde la fecha de
        emisión.
      </p>
    </article>
  );
}