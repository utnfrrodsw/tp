import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { formatMoney } from '@/shared/utils.js';

import { Budget as BudgetEntity, type OrderWithRelations } from '@/modules/budgets/budget.entity.js';
import type { AddedCost, Failure_Type } from '@/generated/prisma/client.js';
import type { $Enums } from '@/database/prisma.js';

type EnumBudgetStatus = $Enums.EnumBudgetStatus;
type EnumEquipmentType = $Enums.EnumEquipmentType;

type EnumTypeAddedCost = $Enums.EnumTypeAddedCost;
type BudgetCore = Omit<BudgetEntity, 'order' | 'addedCosts'>;

export type BudgetWithRelations = Required<BudgetCore> & {
  order: OrderWithRelations;
  addedCosts: AddedCost[];
};

export interface BudgetPdfDocumentProps {
  budget: BudgetWithRelations;
}

const STATUS_LABEL: Record<EnumBudgetStatus, string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

const EQUIPMENT_LABEL: Record<EnumEquipmentType, string> = {
  celular: 'Celular',
  computadora: 'Computadora',
  tablet: 'Tablet',
  consola: 'Consola',
  notebook: 'Notebook',
  impresora: 'Impresora',
  televisor: 'Televisor',
  otro: 'Otro',
};

const ADDED_COST_LABEL: Record<EnumTypeAddedCost, string> = {
  repuesto: 'Repuesto',
  procedimientoEspecial: 'Procedimiento especial',
  garantia: 'Garantía',
  reparacionExpress: 'Reparación express',
  limpiezaPuestaAPunto: 'Limpieza y puesta a punto',
  serviciosSoftware: 'Servicios de software',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function pad(n: number) {
  return String(n).padStart(6, '0');
}

// ─── Estilos ────────────────────────────────────────────────────────────────

const COLORS = {
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  primary: '#2563eb',
  primarySoft: '#eef2ff',
  danger: '#dc2626',
  bg: '#f8fafc',
};

const STATUS_COLORS: Record<EnumBudgetStatus, { bg: string; text: string }> = {
  pendiente: { bg: '#e7f9ee', text: '#16a34a' },
  aprobado: { bg: '#e7f0fe', text: '#2563eb' },
  rechazado: { bg: '#fde8e8', text: '#dc2626' },
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: COLORS.text,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
  },
  companyTagline: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  docType: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 2,
  },
  statusBadge: {
    marginTop: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginVertical: 12,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 24,
  },
  infoBlock: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  infoLine: {
    fontSize: 10,
    color: COLORS.text,
    marginBottom: 3,
  },

  // Body
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableHeaderRow: {
    backgroundColor: COLORS.bg,
  },
  tableCell: {
    fontSize: 9.5,
  },
  tableHeaderCell: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  colDescription: {
    flex: 1,
    paddingRight: 8,
  },
  colAmount: {
    width: 90,
    textAlign: 'right',
  },
  discountText: {
    color: COLORS.danger,
  },

  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.text,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
  },

  footerNote: {
    marginTop: 24,
    fontSize: 8,
    color: COLORS.muted,
    lineHeight: 1.4,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 24,
    right: 40,
    fontSize: 8,
    color: COLORS.muted,
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BudgetPdfDocument({ budget }: BudgetPdfDocumentProps) {
  const client = budget.order.equipment.client;
  const equipment = budget.order.equipment;
  const status = STATUS_COLORS[budget.status];

  const laborCost = Number(budget.laborCost) || 0;
  const discount = Number(budget.discount) || 0;
  const estimatedTotal = Number(budget.estimatedTotal) || 0;

  return (
    <Document title={`Presupuesto N° ${pad(budget.nroBudget)} - TechFix`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>TechFix</Text>
            <Text style={styles.companyTagline}>Servicio técnico especializado</Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.docType}>PRESUPUESTO</Text>
            <Text style={styles.docMeta}>N° {pad(budget.nroBudget)}</Text>
            <Text style={styles.docMeta}>Fecha: {formatDate(budget.budgetDate)}</Text>
            <Text
              style={[
                styles.statusBadge,
                { backgroundColor: status.bg, color: status.text },
              ]}
            >
              {STATUS_LABEL[budget.status]}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Cliente / Equipo */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Cliente</Text>
            <Text style={styles.infoLine}>{client.clientName}</Text>
            <Text style={styles.infoLine}>{client.clientEmail}</Text>
            <Text style={styles.infoLine}>{client.clientPhone}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Equipo</Text>
            <Text style={styles.infoLine}>
              {EQUIPMENT_LABEL[equipment.tipo_equipment]} — {equipment.brand} {equipment.model}
            </Text>
            {equipment.observations && (
              <Text style={styles.infoLine}>Obs: {equipment.observations}</Text>
            )}
            <Text style={styles.infoLine}>Orden N° {pad(budget.order.nroOrder)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Body */}
        <Text style={styles.sectionTitle}>Detalle del presupuesto</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>Concepto</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Importe</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colDescription]}>Mano de obra especializada</Text>
            <Text style={[styles.tableCell, styles.colAmount]}>{formatMoney(laborCost)}</Text>
          </View>

          {budget.order.failures.map((f) => (
            <View style={styles.tableRow} key={f.id_failure}>
              <Text style={[styles.tableCell, styles.colDescription]}>
                Falla: {f.failureType?.failureDescription}
              </Text>
              <Text style={[styles.tableCell, styles.colAmount]}>
                {formatMoney(Number(f.failureType?.estimatedImport) || 0)}
              </Text>
            </View>
          ))}

          {budget.addedCosts.map((c) => (
            <View style={styles.tableRow} key={c.id_addedCost}>
              <Text style={[styles.tableCell, styles.colDescription]}>
                {ADDED_COST_LABEL[c.type_addedCost]}: {c.addedCostDescription}
              </Text>
              <Text style={[styles.tableCell, styles.colAmount]}>
                {formatMoney(Number(c.addedCostAmount) || 0)}
              </Text>
            </View>
          ))}

          {discount > 0 && (
            <View style={[styles.tableRow, styles.tableRowLast]}>
              <Text style={[styles.tableCell, styles.colDescription, styles.discountText]}>
                Descuento bonificado
              </Text>
              <Text style={[styles.tableCell, styles.colAmount, styles.discountText]}>
                -{formatMoney(discount)}
              </Text>
            </View>
          )}
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total estimado</Text>
          <Text style={styles.totalValue}>{formatMoney(estimatedTotal)}</Text>
        </View>

        <Text style={styles.footerNote}>
          Este documento es un presupuesto estimado y puede sufrir variaciones una vez iniciada la
          reparación, sujeto a la aprobación previa del cliente. Validez: 15 días desde la fecha de
          emisión.
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}