import { useEffect, useMemo, useState } from 'react';
import { X, Wrench, User, AlertTriangle, FileText } from 'lucide-react';
import styles from './EquipmentDetailModal.module.css';
import { type Equipment } from '@/types/types';
import { type Client } from '@/types/types';
import { type Order, type Failure, type Status_History } from '@/types/types'
import SmallClientCard from '@/features/clients/components/ClientCard/SmallClientCard/SmallClientCard';
import ClientDetailModal from '@/features/clients/components/ClientCard/ClientDetailModal/ClientDetailModal';
import BACKEND_URL from '@/lib/config';
import FailureMiniCard from '@/components/Failure/FailureMiniCard/FailureMiniCard';
import OrderMiniCard from '@/components/OrderComponent/OrderMiniCard/OrderMiniCard';
import { EVENTS, eventBus } from '@/lib/eventBus';
import ConfirmDialog from '@/components/Common/ConfirmDialog/ConfirmDialog';

export interface EquipmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment;
  closeOnOverlayClick?: boolean;
  onEquipmentChanged?: () => void;
  zIndex?: number;
}

const EquipmentDetailModal = ({
  open,
  onClose,
  equipment,
  closeOnOverlayClick = true,
  onEquipmentChanged,
  zIndex,
}: EquipmentDetailModalProps) => {
  const [showModalClient, setShowModalClient] = useState(false);
  const [dataClient, setDataClient] = useState<Client | null>(null);
  const [dataOrders, setDataOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState<Equipment>(equipment);
  const [form, setForm] = useState<{ tipo_equipment: string; brand: string; model: string; observations: string }>({
    tipo_equipment: equipment.tipo_equipment ?? '',
    brand: equipment.brand ?? '',
    model: equipment.model ?? '',
    observations: equipment.observations ?? '',
  });

  useEffect(() => {
    setSaved(equipment);
    setForm({
      tipo_equipment: equipment.tipo_equipment ?? '',
      brand: equipment.brand ?? '',
      model: equipment.model ?? '',
      observations: equipment.observations ?? '',
    });
    setIsEditing(false);
  }, [equipment]);

  const guardarEquipo = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/equipments/${equipment.id_equipment}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tipo_equipment: form.tipo_equipment,
          brand: form.brand,
          model: form.model,
          ...(form.observations.trim() ? { observations: form.observations } : {}),
        }),
      });
      if (!response.ok) throw new Error('No se pudo guardar el equipo');
      const updated: Equipment = await response.json();
      setSaved(updated);
      setIsEditing(false);
      onEquipmentChanged?.();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error inesperado');
    }
  };

  const eliminarEquipo = async () => {
    setConfirmDelete(false);
    try {
      const response = await fetch(`${BACKEND_URL}/api/equipments/${equipment.id_equipment}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'No se pudo eliminar el equipo');
      }
      onEquipmentChanged?.();
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error inesperado');
    }
  };

  // Mismo criterio para órdenes, usando la fecha de ingreso.
  const sortedOrders = useMemo(
    () =>
      [...dataOrders].sort(
        (a, b) => new Date(b.dateOfEntry).getTime() - new Date(a.dateOfEntry).getTime()
      ),
    [dataOrders]
  );

  const sortedFailures = useMemo(() => {
    const allFailures = dataOrders.flatMap((order) => order.failures ?? []);
    return [...allFailures].sort(
      (a, b) => new Date(b.dateOfFailure).getTime() - new Date(a.dateOfFailure).getTime()
    );
  }, [dataOrders]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { id_client } = equipment;
        const client = await fetch(`${BACKEND_URL}/api/clients/${id_client}`, {
          method: "GET",
          credentials: 'include',
        });
        const dataClient: Client = await client.json();
        setDataClient(dataClient);
      } catch (e) {
        setDataClient(null);
      }
    }
    const fetchOrders = async () => {
      try {
        const id_equipment = equipment?.id_equipment;
        if (!id_equipment) return;
        const orders = await fetch(`${BACKEND_URL}/api/orders/ofEquipment/${id_equipment}`,
          {
            method: "GET",
            credentials: 'include',
          }
        );
        if (!orders.ok) {
          throw new Error('Error al obtener las órdenes');
        };
        const dataOrders = await orders.json();
        setDataOrders(dataOrders);
      } catch (e) {
        setDataOrders([]);
      }
    }
    fetchClient();
    fetchOrders();
  }, [equipment])


  useEffect(() => {
    const handleFailureChanged = (payload: unknown) => {
      const changedFailure = payload as Failure;

      setDataOrders((prev) => {
        const belongsHere = prev.some((o) => o.id_order === changedFailure.id_order);
        if (!belongsHere) return prev; // no es de este equipo, ignorar

        return prev.map((order) => {
          if (order.id_order !== changedFailure.id_order) return order;

          const currentFailures = order.failures ?? [];
          const exists = currentFailures.some((f) => f.id_failure === changedFailure.id_failure);

          return {
            ...order,
            failures: exists
              ? currentFailures.map((f) =>
                f.id_failure === changedFailure.id_failure ? changedFailure : f
              )
              : [...currentFailures, changedFailure],
          };
        });
      });
    };

    eventBus.on(EVENTS.failureChanged, handleFailureChanged);
    return () => eventBus.off(EVENTS.failureChanged, handleFailureChanged);
  }, []);

  useEffect(() => {
    const handleStatusChanged = (payload: unknown) => {
      const newStatus = payload as Status_History;

      setDataOrders((prev) => {
        const belongsHere = prev.some((o) => o.id_order === newStatus.id_order);
        if (!belongsHere) return prev;

        return prev.map((order) =>
          order.id_order === newStatus.id_order
            ? {
              ...order,
              status: newStatus.status,
              statusHistory: [...(order.statusHistory ?? []), newStatus],
            }
            : order
        );
      });
    };

    eventBus.on(EVENTS.statusChanged, handleStatusChanged);
    return () => eventBus.off(EVENTS.statusChanged, handleStatusChanged);
  }, []);
  useEffect(() => {
    const handleFailureDeleted = (payload: unknown) => {
      const { id_failure, id_order } = payload as { id_failure: string; id_order: string };

      setDataOrders((prev) => {
        const belongsHere = prev.some((o) => o.id_order === id_order);
        if (!belongsHere) return prev;

        return prev.map((order) =>
          order.id_order === id_order
            ? { ...order, failures: (order.failures ?? []).filter((f) => f.id_failure !== id_failure) }
            : order
        );
      });
    };

    eventBus.on(EVENTS.failureDeleted, handleFailureDeleted);
    return () => eventBus.off(EVENTS.failureDeleted, handleFailureDeleted);
  }, []);

  if (!open) return null;

  return (
    <>
      <div
        className={styles.overlay}
        style={zIndex !== undefined ? { zIndex } : undefined}
        onClick={() => {
          if (closeOnOverlayClick) onClose();
        }}
      >
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>

          <h2 className={styles.modalTitle}>Detalles del Equipo</h2>

          <div className={styles.contentGrid}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Wrench size={18} className={styles.icon} />
                <h3>Información Técnica</h3>
              </div>
              {!isEditing ? (
                <div className={styles.technicalCards}>
                  <div className={styles.technicalCard}>
                    <span className={styles.label}>Tipo</span>
                    <span className={styles.value}>{saved.tipo_equipment || '---'}</span>
                  </div>
                  <div className={styles.technicalCard}>
                    <span className={styles.label}>Marca</span>
                    <span className={styles.value}>{saved.brand || '---'}</span>
                  </div>
                  <div className={styles.technicalCard}>
                    <span className={styles.label}>Modelo</span>
                    <span className={styles.value}>{saved.model || '---'}</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span className={styles.label}>Tipo</span>
                    <select
                      value={form.tipo_equipment}
                      onChange={(e) => setForm({ ...form, tipo_equipment: e.target.value })}
                      style={{ padding: 8, borderRadius: 8 }}
                    >
                      {['celular', 'computadora', 'notebook', 'impresora', 'televisor', 'tablet', 'consola', 'otro'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span className={styles.label}>Marca</span>
                    <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} style={{ padding: 8, borderRadius: 8 }} />
                  </label>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span className={styles.label}>Modelo</span>
                    <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} style={{ padding: 8, borderRadius: 8 }} />
                  </label>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span className={styles.label}>Observaciones</span>
                    <textarea value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} rows={2} style={{ padding: 8, borderRadius: 8 }} />
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {!isEditing ? (
                  <>
                    <button type="button" onClick={() => setIsEditing(true)} style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>
                      Editar
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(true)} style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer', background: '#dc2626', color: '#fff', border: 'none' }}>
                      Eliminar
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={guardarEquipo} style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer', background: '#1e3a8a', color: '#fff', border: 'none' }}>
                      Guardar
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <User size={18} className={styles.icon} />
                <h3>Propietario</h3>
              </div>
              {dataClient ? (
                <SmallClientCard
                  id_client={dataClient?.id_client}
                  clientName={String(dataClient?.clientName)}
                  registrationYear={String(dataClient?.dateOfRegistration)}
                  onClick={() => setShowModalClient(true)}
                />
              ) : (
                <p className={styles.emptyText}>Sin cliente asignado</p>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <AlertTriangle size={18} className={styles.icon} />
                <h3>Fallas Registradas</h3>
              </div>
              {sortedFailures.length > 0 ? (
                <div className={styles.cardsGrid}>
                  {sortedFailures.map((failure) => (
                    <FailureMiniCard key={failure.id_failure} failure={failure} />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyText}>No hay fallas registradas asociadas.</p>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FileText size={18} className={styles.icon} />
                <h3>Órdenes Registradas</h3>
              </div>
              {sortedOrders.length > 0 ? (
                <div>
                  {sortedOrders.map((order) => (
                    <OrderMiniCard key={order.id_order} order={order} />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyText}>No hay Ordenes registradas asociadas.</p>
              )}
            </section>
          </div>
        </div>
      </div>

      {showModalClient && dataClient && (
        <ClientDetailModal
          client={dataClient}
          open={showModalClient}
          onClose={() => setShowModalClient(false)}
        />
      )}

      <ConfirmDialog
        open={confirmDelete}
        danger
        title="Eliminar equipo"
        message="Esta acción no se puede deshacer. ¿Querés eliminar el equipo?"
        confirmLabel="Eliminar"
        onConfirm={eliminarEquipo}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
};

export default EquipmentDetailModal;