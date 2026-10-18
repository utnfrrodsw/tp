import Nav from "@/components/layout/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import styles from "./OrderDirectory.module.css";
import '../../../index.css';
import { useEffect, useMemo, useState, useCallback } from "react";
import type { Order, EnumOrderStatus, Status_History } from "@/types/types";
import { Wrench, FileText, AlertTriangle, Banknote } from "lucide-react";
import DescriptiveMiniCard from "@/components/Common/Cards/DescriptiveMiniCard/DescriptiveMiniCard";
import SearchBar, { type FilterConfig } from "@/components/SearchBar/SearchBar";
import DataTable, { type ColumnConfig } from "@/components/Common/DataTable/DataTable";
import OrderDescription from "@/components/OrderComponent/OrderDescription/OrderDescription";
import { BACKEND_URL } from "@/lib/config";
import UpdateStatusModal from "@/components/Status/UpdateStatusModal/UpdateStatusModal";
import { eventBus, EVENTS } from '@/lib/eventBus';
import type { PaginatedResponse } from "@/types/types";
import { formatDocumentNumber } from "@/lib/utils";
import ActionButton from "@/components/Common/Buttons/ActionButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmDialog from "@/components/Common/ConfirmDialog/ConfirmDialog";



// Mismo tono que venimos usando en OrderCard / StatusMiniDescriptiveCard
const STATUS_META: Record<EnumOrderStatus, { label: string; tone: 'info' | 'warning' | 'success' | 'danger' }> = {
  recibido: { label: 'Recibido', tone: 'info' },
  diagnostico: { label: 'En diagnóstico', tone: 'warning' },
  presupuestado: { label: 'Presupuestado', tone: 'info' },
  aprobado: { label: 'Aprobado', tone: 'warning' },
  reparacion: { label: 'En reparación', tone: 'warning' },
  listo: { label: 'Listo para retirar', tone: 'success' },
  entregado: { label: 'Entregado', tone: 'success' },
  cancelado: { label: 'Cancelado', tone: 'danger' },
};

const FILTER_LABELS: Record<string, string> = {
  activas: 'Órdenes activas',
  pendientes: 'Pendientes de presupuesto',
  reparacion: 'En reparación',
  entregado: 'Entregadas',
};

const STATUS_FILTER_OPTIONS = Object.entries(STATUS_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

interface OrderRow {
  id_order: string;
  nroOrder: string;
  orderLabel: string;
  customer: string;
  device: string;
  status: EnumOrderStatus;
  elapsed: string;
  raw: Order;
}

// Mismo criterio que usamos en OrderMiniCard/EquipmentDetailModal: último cambio de estado
const getCurrentStatus = (history?: Status_History[]): Status_History | null => {
  if (!history || history.length === 0) return null;
  return [...history].sort(
    (a, b) => new Date(b.dateOfChange).getTime() - new Date(a.dateOfChange).getTime()
  )[0];
};

const formatElapsed = (value: Date | string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (!date || isNaN(date.getTime())) return '—';

  const diffHrs = Math.floor((Date.now() - date.getTime()) / 3600000);
  if (diffHrs < 1) return 'Hace instantes';
  if (diffHrs < 24) return `${diffHrs} hora${diffHrs === 1 ? '' : 's'}`;

  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} día${diffDays === 1 ? '' : 's'}`;
};

const toRow = (order: Order): OrderRow => {
  const currentStatus = getCurrentStatus(order.statusHistory);

  return {
    id_order: order.id_order,
    nroOrder: formatDocumentNumber("#ORD", order.nroOrder, { padLength: 4 }),
    orderLabel: `${formatDocumentNumber("#ORD", order.nroOrder)}`,
    customer: order.equipment?.client?.clientName ?? 'Sin cliente',
    device: order.equipment
      ? `${order.equipment.brand ?? ''} ${order.equipment.model ?? ''}`.trim()
      : `Equipo #${order.id_equipment}`,
    status: (currentStatus?.status ?? 'recibido') as EnumOrderStatus,
    elapsed: formatElapsed(order.dateOfEntry),
    raw: order,
  };
};

const OrderDirectory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModalActStatus, setShowModalActStatus] = useState(false);
  const [showBajaConfirm, setShowBajaConfirm] = useState(false);
  const [bajaLoading, setBajaLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const metricFilter = searchParams.get('filtro');
  // 1. Envolver fetchOrders en useCallback y asegurar que la respuesta sea un Array
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al obtener las órdenes');

      // Tipamos la respuesta con tu interfaz
      const responseData: PaginatedResponse<Order> = await res.json();

      // Guardamos la propiedad .data
      setOrders(responseData.data ?? []);
    } catch (e) {
      console.error('Error fetching orders:', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Suscripción limpia al eventBus
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.statusChanged, () => fetchOrders());
    return unsubscribe;
  }, [fetchOrders]);
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.failureChanged, () => fetchOrders());
    return unsubscribe;
  }, [fetchOrders]);
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.failureDeleted, () => fetchOrders());
    return unsubscribe;
  }, [fetchOrders]);

  const handleBaja = async () => {
    if (!selectedOrder) return;
    setBajaLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${selectedOrder.id_order}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No se pudo dar de baja la orden');
      setShowBajaConfirm(false);
      setSelectedOrder(null);
      fetchOrders(); // refresca el listado (la baja ya no aparece)
    } catch (e) {
      console.error('Error al dar de baja la orden:', e);
    } finally {
      setBajaLoading(false);
    }
  };

  // 3. Carga inicial
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 4. Mappings blindados con verificación de array
  const rows = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return [...orders]
      .sort((a, b) => new Date(b.dateOfEntry).getTime() - new Date(a.dateOfEntry).getTime())
      .map(toRow);
  }, [orders]);

  const activeRepairs = useMemo(
    () => rows.filter(r => r.status !== 'entregado' && r.status !== 'cancelado').length,
    [rows]
  );

  const pendingBudgets = useMemo(
    () => rows.filter(r => r.status === 'presupuestado').length,
    [rows]
  );

  const dailyRevenue = useMemo(() => {
    if (!Array.isArray(orders)) return 0;
    const today = new Date().toDateString();
    return orders
      .filter(o => o.deliveryDate && new Date(o.deliveryDate).toDateString() === today)
      .reduce((sum, o) => sum + (o.totalCharged ?? 0), 0);
  }, [orders]);

    const filteredRows = useMemo(() => {
    switch (metricFilter) {
      case 'activas':       return rows.filter(r => r.status !== 'entregado' && r.status !== 'cancelado');
      case 'pendientes':    return rows.filter(r => r.status === 'recibido' || r.status === 'diagnostico');
      case 'reparacion':    return rows.filter(r => r.status === 'reparacion');
      case 'entregado':     return rows.filter(r => r.status === 'entregado');
      default:              return rows;
    }
  }, [rows, metricFilter]);

  const formattedRevenue = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(dailyRevenue);

  const filters: FilterConfig[] = [
    { key: 'status', label: 'Estado', type: 'select', placeholder: 'Todos los estados', options: STATUS_FILTER_OPTIONS },
    { key: 'dateOfEntry', label: 'Fecha de ingreso', type: 'date' },
  ];

  const columns: ColumnConfig<OrderRow>[] = [
    { key: 'nroOrder', label: 'Numero' },
    { key: 'customer', label: 'Cliente' },
    { key: 'device', label: 'Equipo' },
    {
      key: 'status',
      label: 'Estado',
      render: (row) => {
        const meta = STATUS_META[row.status];
        return <span className={`${styles.statusPill} ${styles[meta.tone]}`}>{meta.label}</span>;
      },
    },
    { key: 'elapsed', label: 'Tiempo' },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        <ActionButton label="Gestion" icon={null} variant="neutral" onClick={() => { navigate(`/manageOrder/${row.id_order}`) }} />
      ),
    }
  ];

  return (
    <div className={styles.page}>
      <Nav />
      <main>
        <h1 className={styles.title}>Gestión de Órdenes</h1>

        <div className={styles.cardSector}>
                    <DescriptiveMiniCard
            label="Reparaciones Activas" value={activeRepairs} icon={Wrench} tone="neutral"
          />
          <DescriptiveMiniCard
            label="Presupuestos Pendientes" value={pendingBudgets} icon={FileText} tone="success"
          />
          {/* Sin fuente de datos propia todavía: no hay modelo de stock/inventario en el schema actual */}
          <DescriptiveMiniCard label="Alertas de Stock" value={0} icon={AlertTriangle} tone="danger" />
          <DescriptiveMiniCard label="Ingresos del Día" value={formattedRevenue} icon={Banknote} tone="neutral" />
        </div>

        <div className={styles.orderSection}>
          <div className={styles.searchOrderSection}>
            <SearchBar<Order>
              searchPlaceholder="Buscar por ID, cliente, equipo..."
              searchEndpoint="/api/orders"
              filters={filters}
              onResults={(results) => setOrders(results.data)}
              onClear={fetchOrders}
            />
          </div>

          <div className={styles.dataOrderSection}>
            <div className={styles.tableOrderSection}>
              {metricFilter && (
              <div className={styles.filterBanner}>
                <span>Filtrando por: <strong>{FILTER_LABELS[metricFilter] ?? metricFilter}</strong></span>
                <button type="button" onClick={() => setSearchParams({})}>✕ Quitar filtro</button>
              </div>
            )}
              {loading && <p className={styles.loadingText}>Cargando órdenes...</p>}
              <DataTable<OrderRow>
                data={filteredRows}
                idField="id_order"
                columns={columns}
                onRowClick={(row) => setSelectedOrder(row.raw)}
                selectedId={selectedOrder?.id_order}

              />
            </div>

            <div className={styles.selectedOrderOption}>
              {selectedOrder && (
                <div className={styles.selectedOrderContent}>
                  <OrderDescription order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={() => setShowModalActStatus(true)} />
                  <ActionButton
                    label="Dar de baja"
                    icon={null}
                    variant="danger"
                    fullWidth
                    onClick={() => setShowBajaConfirm(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {showModalActStatus && selectedOrder && (
        <div>
          <UpdateStatusModal open={showModalActStatus} order={selectedOrder} onClose={() => setShowModalActStatus(false)} onConfirm={() => { fetchOrders(); setSelectedOrder(null); }}  />
        </div>
      )}

      <ConfirmDialog
        open={showBajaConfirm}
        title="Dar de baja la orden"
        message="¿Seguro que querés dar de baja esta orden? No se elimina: queda inactiva y sale del listado, pero se conserva su historial."
        confirmLabel={bajaLoading ? "Dando de baja..." : "Dar de baja"}
        cancelLabel="Cancelar"
        danger
        onConfirm={handleBaja}
        onCancel={() => setShowBajaConfirm(false)}
      />

      <Footer />
    </div>
  );
};

export default OrderDirectory;