import { useMemo, useState } from 'react';
import IconDoc from '@/assets/document.svg';
import IconSearch from '@/assets/search.svg';
import IconMail from '@/assets/mail.svg';
import IconCheck from '@/assets/check.svg';
import IconSend from '@/assets/send.svg';
import { formatMoney } from '@/lib/utils';
import styles from './DetailBudget.module.css';
import ActionButton from '@/components/Common/Buttons/ActionButton';
import { useBudgetTotals } from './useBudgetTotals'
import type { Budget, EnumBudgetStatus } from '@/types/types';

export interface DetailBudgetProps {
  budget: Budget;
  onIssue?: (payload: { sendEmail: boolean }) => void | Promise<void>;
  onSaveDraft?: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  currencySymbol?: string;
}

const STATUS_MAP: Record<EnumBudgetStatus, { label: string; tone: string }> = {
  pendiente: { label: 'VIVO', tone: 'live' },
  aprobado: { label: 'Aprobado', tone: 'approved' },
  rechazado: { label: 'Rechazado', tone: 'rejected' },
};


//const IconWhatsApp = (
//  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 0 0 4.62 1.18h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.03.29-3.44-.72-2.9-1.2-4.76-4.15-4.9-4.34-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.1 1-2.39.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.5-.15.15-.3.31-.13.6.17.29.75 1.24 1.61 2 1.11.99 2.04 1.3 2.33 1.45.29.15.46.12.63-.07.17-.19.72-.84.92-1.13.19-.28.38-.24.64-.14.26.09 1.65.78 1.93.92.29.15.48.22.55.34.07.13.07.75-.17 1.43Z" />
//  </svg>
//);

//const IconSave = (
//  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
//    <polyline points="17 21 17 13 7 13 7 21" />
//    <polyline points="7 3 7 8 15 8" />
//  </svg>
//);



export default function DetailBudget({
  budget,
  onIssue,
  loading = false,
  currencySymbol = '$',
}: DetailBudgetProps) {
  //const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);

  const client = budget.order?.equipment?.client;

  const {
    failuresTotal,
    addedCostsTotal,
    loading: totalsLoading,
    error: totalsError,
  } = useBudgetTotals(budget.id_order, budget.id_budget);

  const totalPaid = useMemo(
    () => (budget.payments ?? []).reduce((acc: number, p) => acc + (Number(p.amount) || 0), 0),
    [budget.payments]
  );

  const estimatedTotal = failuresTotal + addedCostsTotal + budget.laborCost;

  const balance = estimatedTotal - totalPaid;

  const status = STATUS_MAP[budget.status] ?? { label: budget.status, tone: 'neutral' };

  const money = (v: number) => formatMoney(v, currencySymbol);
  const displayTotal = (v: number) => (totalsLoading ? '—' : money(v));

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.headerIcon}><img src={IconDoc} alt="" /></span>
          <h3 className={styles.title}>Resumen Presupuestario</h3>
        </div>
        <span className={`${styles.badge} ${styles[`badge_${status.tone}`]}`}>{status.label}</span>
      </div>

      <div className={styles.divider} />

      {totalsError && <p className={styles.errorText}>{totalsError}</p>}

      {/* Rows */}
      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>
            <span className={styles.rowIcon}><img src={IconSearch} alt="" /></span>
            Importe por Fallas por Estimadas:
          </span>
          <span className={styles.rowValue}>{displayTotal(failuresTotal)}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Subtotal Mano de Obra:</span>
          <span className={styles.rowValue}>{money(budget.laborCost)}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Repuestos y Costos Adicionales:</span>
          <span className={styles.rowValue}>{displayTotal(addedCostsTotal)}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>
            Descuento Bonificado:
            {budget.discount > 0 && <span className={styles.promoTag}>PROMO</span>}
          </span>
          <span className={styles.rowValueDiscount}>-{money(budget.discount)}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Total */}
      <div className={styles.totalBlock}>
        <span className={styles.totalCaption}>Total Estimado</span>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>ARS Neto</span>
          <span className={styles.totalValue}>{money(estimatedTotal)}</span>
        </div>
      </div>

      {/* Anticipo / Saldo */}
      <div className={styles.balanceBox}>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>Anticipo / Total Abonado:</span>
          <span className={styles.balancePaid}>{money(totalPaid)}</span>
        </div>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabelStrong}>Saldo Restante / Pendiente:</span>
          <span className={styles.balancePending}>{money(balance)}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Canales de comunicación */}
      <div className={styles.commSection}>
        <span className={styles.commTitle}>Canales de Comunicación</span>
        {/*
        <button
          type="button"
          className={styles.commRow}
          onClick={() => setNotifyWhatsApp((v) => !v)}
        >
          <span className={`${styles.checkbox} ${notifyWhatsApp ? styles.checkboxGreen : ''}`}>
            {notifyWhatsApp && IconCheck}
          </span>
          <span className={styles.commIcon}>{IconWhatsApp}</span>
          <span className={styles.commText}>
            Notificar vía WhatsApp
            {client?.clientPhone && <span className={styles.commMuted}> ({client.clientPhone})</span>}
          </span>
        </button>
           */}
        <button
          type="button"
          className={styles.commRow}
          onClick={() => setSendEmail((v) => !v)}
        >
          <span className={`${styles.checkbox} ${sendEmail ? styles.checkboxBlue : ''}`}>
            {sendEmail && <img src={IconCheck} alt="" />}
          </span>
          <span className={styles.commIcon}><img src={IconMail} alt="" /></span>
          <span className={styles.commText}>
            Enviar PDF formal
            {client?.clientEmail && <span className={styles.commMuted}> a {client.clientEmail}</span>}
          </span>
        </button>
      </div>
      {budget.clientSuggestion !== null && (
        <div className={styles.suggSection}>
          <span className={styles.suggTitle}>Sugerencia del Cliente</span>
          <p className={styles.suggText}>{budget.clientSuggestion}</p>
        </div>
      )}


      {/* Actions */}
      <div className={styles.actions}>
        <ActionButton
          label="Emitir Presupuesto"
          icon={<img src={IconSend} alt="" />}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={() => onIssue?.({ sendEmail })}
        />
        {/* <div className={styles.actionsRow}>
          <ActionButton
            label="Cancelar"
            icon={IconX}
            variant="ghost"
            size="md"
            fullWidth
            onClick={onCancel}
          />
        </div> */}
      </div>
    </div>
  );
}