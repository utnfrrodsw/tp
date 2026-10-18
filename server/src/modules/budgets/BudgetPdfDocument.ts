import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { $Enums } from "@/database/prisma.js";
import type { Budget, OrderWithRelations } from './budget.entity.js';
import type { AddedCost } from "@/generated/prisma/client.js";

// Sin JSX: el backend no tiene el compilador de JSX configurado (eso es
// cosa del frontend). React.createElement es exactamente lo que el JSX
// compila por debajo, así que el resultado es idéntico — solo más verboso.
const e = React.createElement;

export type BudgetWithRelations = Budget & {
    order: OrderWithRelations;
    addedCosts: AddedCost[];
};

export interface BudgetPdfDocumentProps {
    budget: BudgetWithRelations;
}

// ─── Labels ─────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<$Enums.EnumBudgetStatus, string> = {
    pendiente: 'Pendiente',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
};

const EQUIPMENT_LABEL: Record<$Enums.EnumEquipmentType, string> = {
    celular: 'Celular',
    computadora: 'Computadora',
    tablet: 'Tablet',
    consola: 'Consola',
    notebook: 'Notebook',
    impresora: 'Impresora',
    televisor: 'Televisor',
    otro: 'Otro',
};

// 'respuesto' está mal escrito en el enum de la DB (typo heredado del
// schema); acá lo mapeamos a la etiqueta bien escrita para el PDF.
const ADDED_COST_LABEL: Record<$Enums.EnumTypeAddedCost, string> = {
    repuesto: 'Repuesto',
    procedimientoEspecial: 'Procedimiento especial',
    garantia: 'Garantía',
    reparacionExpress: 'Reparación express',
    limpiezaPuestaAPunto: 'Limpieza y puesta a punto',
    serviciosSoftware: 'Servicios de software',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatMoney(value: number, symbol = '$'): string {
    const abs = Math.abs(value);
    const formatted = abs.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${value < 0 ? '-' : ''}${symbol}${formatted}`;
}

function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function pad(n: number): string {
    return String(n).padStart(6, '0');
}

// ─── Estilos ────────────────────────────────────────────────────────────────

const COLORS = {
    text: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    primary: '#2563eb',
    danger: '#dc2626',
    bg: '#f8fafc',
};

const STATUS_COLORS: Record<$Enums.EnumBudgetStatus, { bg: string; text: string }> = {
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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    companyName: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: COLORS.text },
    companyTagline: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
    headerRight: { alignItems: 'flex-end' },
    docType: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLORS.primary, letterSpacing: 1, marginBottom: 4 },
    docMeta: { fontSize: 9, color: COLORS.muted, marginBottom: 2 },
    statusBadge: {
        marginTop: 4,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 8,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
    },
    divider: { borderBottomWidth: 1, borderBottomColor: COLORS.border, marginVertical: 12 },
    infoRow: { flexDirection: 'row', gap: 24 },
    infoBlock: { flex: 1 },
    infoTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    infoLine: { fontSize: 10, color: COLORS.text, marginBottom: 3 },
    sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 8 },
    table: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 4 },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    tableRowLast: { borderBottomWidth: 0 },
    tableHeaderRow: { backgroundColor: COLORS.bg },
    tableCell: { fontSize: 9.5 },
    tableHeaderCell: {
        fontSize: 8.5,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    colDescription: { flex: 1, paddingRight: 8 },
    colAmount: { width: 90, textAlign: 'right' },
    discountText: { color: COLORS.danger },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1.5,
        borderTopColor: COLORS.text,
    },
    totalLabel: { fontSize: 12, fontFamily: 'Helvetica-Bold' },
    totalValue: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: COLORS.primary },
    footerNote: { marginTop: 24, fontSize: 8, color: COLORS.muted, lineHeight: 1.4 },
    pageNumber: { position: 'absolute', bottom: 24, right: 40, fontSize: 8, color: COLORS.muted },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BudgetPdfDocument({ budget }: BudgetPdfDocumentProps) {
    const client = budget.order.equipment.client;
    const equipment = budget.order.equipment;
    const status = STATUS_COLORS[budget.status ?? 'pendiente'];

    const laborCost = budget.laborCost;
    const discount = budget.discount ?? 0;
    const estimatedTotal = budget.estimatedTotal;

    // Cada bloque se arma por separado, de abajo hacia arriba, para que
    // esto no termine siendo una sola llamada a e() con 15 niveles de
    // anidamiento ilegibles.

    const header = e(
        View,
        { style: styles.header },
        e(
            View,
            null,
            e(Text, { style: styles.companyName }, 'TechFix'),
            e(Text, { style: styles.companyTagline }, 'Servicio técnico especializado'),
        ),
        e(
            View,
            { style: styles.headerRight },
            e(Text, { style: styles.docType }, 'PRESUPUESTO'),
            e(Text, { style: styles.docMeta }, `N° ${pad(budget.nroBudget ?? 0)}`),
            e(Text, { style: styles.docMeta }, `Fecha: ${formatDate(budget.budgetDate ?? new Date())}`),
            e(
                Text,
                { style: [styles.statusBadge, { backgroundColor: status.bg, color: status.text }] },
                STATUS_LABEL[budget.status ?? 'pendiente'],
            ),
        ),
    );

    const infoSection = e(
        View,
        { style: styles.infoRow },
        e(
            View,
            { style: styles.infoBlock },
            e(Text, { style: styles.infoTitle }, 'Cliente'),
            e(Text, { style: styles.infoLine }, client.clientName),
            e(Text, { style: styles.infoLine }, client.clientEmail),
            e(Text, { style: styles.infoLine }, client.clientPhone),
        ),
        e(
            View,
            { style: styles.infoBlock },
            e(Text, { style: styles.infoTitle }, 'Equipo'),
            e(
                Text,
                { style: styles.infoLine },
                `${EQUIPMENT_LABEL[equipment.tipo_equipment]} — ${equipment.brand} ${equipment.model}`,
            ),
            equipment.observations
                ? e(Text, { style: styles.infoLine }, `Obs: ${equipment.observations}`)
                : null,
            e(Text, { style: styles.infoLine }, `Orden N° ${pad(budget.order.nroOrder ?? 0)}`),
        ),
    );

    const tableHeaderRow = e(
        View,
        { style: [styles.tableRow, styles.tableHeaderRow], key: 'table-header' },
        e(Text, { style: [styles.tableHeaderCell, styles.colDescription] }, 'Concepto'),
        e(Text, { style: [styles.tableHeaderCell, styles.colAmount] }, 'Importe'),
    );

    const laborRow = e(
        View,
        { style: styles.tableRow, key: 'labor-row' },
        e(Text, { style: [styles.tableCell, styles.colDescription] }, 'Mano de obra especializada'),
        e(Text, { style: [styles.tableCell, styles.colAmount] }, formatMoney(laborCost)),
    );

    const failureRows = budget.order.failures.map((f) =>
        e(
            View,
            { style: styles.tableRow, key: f.id_failure },
            e(Text, { style: [styles.tableCell, styles.colDescription] }, `Falla: ${f.failureType.failureDescription}`),
            e(
                Text,
                { style: [styles.tableCell, styles.colAmount] },
                formatMoney(f.failureType.estimatedImport.toNumber()),
            ),
        ),
    );

    const addedCostRows = budget.addedCosts.map((c) =>
        e(
            View,
            { style: styles.tableRow, key: c.id_addedCost },
            e(
                Text,
                { style: [styles.tableCell, styles.colDescription] },
                `${ADDED_COST_LABEL[c.type_addedCost]}: ${c.addedCostDescription}`,
            ),
            e(Text, { style: [styles.tableCell, styles.colAmount] }, formatMoney(c.addedCostAmount.toNumber())),
        ),
    );

    const discountRow =
        discount > 0
            ? e(
                  View,
                  { style: [styles.tableRow, styles.tableRowLast], key: 'discount-row' },
                  e(
                      Text,
                      { style: [styles.tableCell, styles.colDescription, styles.discountText] },
                      'Descuento bonificado',
                  ),
                  e(
                      Text,
                      { style: [styles.tableCell, styles.colAmount, styles.discountText] },
                      `-${formatMoney(discount)}`,
                  ),
              )
            : null;

    const tableRows = [tableHeaderRow, laborRow, ...failureRows, ...addedCostRows, discountRow].filter(
        (row): row is Exclude<typeof row, null> => row !== null,
    );

    const table = e(View, { style: styles.table }, ...tableRows);

    const totalSection = e(
        View,
        { style: styles.totalRow },
        e(Text, { style: styles.totalLabel }, 'Total estimado'),
        e(Text, { style: styles.totalValue }, formatMoney(estimatedTotal ?? 0)),
    );

    const footerNote = e(
        Text,
        { style: styles.footerNote },
        'Este documento es un presupuesto estimado y puede sufrir variaciones una vez iniciada la ' +
            'reparación, sujeto a la aprobación previa del cliente. Validez: 15 días desde la fecha de emisión.',
    );

    const pageNumber = e(Text, {
        style: styles.pageNumber,
        render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `${pageNumber} / ${totalPages}`,
        fixed: true,
    });

    const page = e(
        Page,
        { size: 'A4', style: styles.page },
        header,
        e(View, { style: styles.divider }),
        infoSection,
        e(View, { style: styles.divider }),
        e(Text, { style: styles.sectionTitle }, 'Detalle del presupuesto'),
        table,
        totalSection,
        footerNote,
        pageNumber,
    );

    return e(Document, { title: `Presupuesto N° ${pad(budget.nroBudget ?? 0)} - TechFix` }, page);
}