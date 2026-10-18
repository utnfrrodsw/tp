import BACKEND_URL from "@/lib/config";
import type { EnumOrderStatus, Order } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "@/components/layout/Nav/Nav";
import OrderDetailNav from "@/components/OrderComponent/OrderDetailNav/OrderDetailNav";
import StatusPipeline from "@/components/Status/StatusPipeline/StatusPipeline";
import Footer from "@/components/Footer/Footer";
import ClientDetailCard from "@/features/clients/components/ClientCard/ClientDetailCard/ClientDetailCard";
import EquipmentDetailCard from "@/components/EquipmentComponent/EquipmentDetailCard/EquipmentDetailCard";
import CreateBudget from "@/components/BudgetComponent/CrateBudget/CreateBudget";
import UpdateStatusModal from "@/components/Status/UpdateStatusModal/UpdateStatusModal";
import styles from "./ManageOrder.module.css";
import Diagnostic from "@/components/Status/UpdateStatusModal/Diagnostic/Diagnostic";

type Transition = { target: EnumOrderStatus; direction: "advance" | "retreat" };

const ManageOrder = () => {
  const { id_order } = useParams<{ id_order: string }>();
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transition, setTransition] = useState<Transition | null>(null);

  const getCurrentStatus = (o: Order): EnumOrderStatus => {
    const latest = [...(o.statusHistory ?? [])].sort(
      (a, b) => new Date(b.dateOfChange).getTime() - new Date(a.dateOfChange).getTime()
    )[0];
    return latest?.status ?? o.status;
  };

  const fetchOrder = useCallback(
    async (silent = false, signal?: AbortSignal) => {
      if (!id_order) return;

      if (!silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/orders/${id_order}`, {
          credentials: "include",
          method: "GET",
          signal,
        });

        if (response.status === 404) throw new Error("La orden no existe.");
        if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);

        setOrder(await response.json());
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        console.error("Error al obtener la orden", e);
        if (!silent) {
          setError(e instanceof Error ? e.message : "No se pudo cargar la orden.");
          setOrder(null);
        }
      } finally {
        if (!silent && !signal?.aborted) setLoading(false);
      }
    },
    [id_order]
  );

  useEffect(() => {
    if (!id_order) {
      setError("No se indicó la orden.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    fetchOrder(false, controller.signal);
    return () => controller.abort();
  }, [id_order, fetchOrder]);

  // Reglas mínimas para poder AVANZAR. Retroceder no se bloquea.
  // Son solo ayuda visual: la validación real tiene que estar en el backend.

  const equipment = order?.equipment;
  const client = equipment?.client;

  const renderContent = () => {
    if (loading) {
      return <div className={styles.state}>Cargando orden...</div>;
    }

    if (error || !order) {
      return (
        <div className={`${styles.state} ${styles.stateError}`} role="alert">
          {error ?? "No se pudo cargar la orden."}
        </div>
      );
    }

    return (
      <main className={styles.main}>
        <section className={styles.orderHeader}>
          <OrderDetailNav order={order} />
        </section>

        <section className={styles.pipelineSection}>
          <StatusPipeline
            order={order}
            onAdvance={(s) => setTransition({ target: s, direction: "advance" })}
            onRetreat={(s) => setTransition({ target: s, direction: "retreat" })}
          />
        </section>

        <section className={styles.detailsRow}>
          {client ? (
            <ClientDetailCard client={client} />
          ) : (
            <div className={styles.missing}>Esta orden no tiene un cliente asociado.</div>
          )}

          {equipment ? (
            <EquipmentDetailCard equipment={equipment} />
          ) : (
            <div className={styles.missing}>Esta orden no tiene un equipo asociado.</div>
          )}
        </section>

        {["recibido", "diagnostico"].includes(getCurrentStatus(order)) && (
          <section className={styles.budgetSection}>
            <Diagnostic order={order} />
          </section>
        )}
        {["presupuestado", "aprobado", "reparacion", "listo", "entregado", "cancelado"].includes(getCurrentStatus(order)) && (
          <section className={styles.budgetSection}>
            <CreateBudget order={order} />
          </section>
        )}

        {transition && (
          <UpdateStatusModal
            key={`${transition.direction}-${transition.target}`}
            open
            order={order}
            targetStatus={transition.target}
            direction={transition.direction}
            onClose={() => setTransition(null)}
            onConfirm={() => fetchOrder(true)}
          />
        )}
      </main>
    );
  };

  return (
    <div className={styles.page}>
      <Nav />
      <button type= 'button' className= {styles.backButton} onClick={() => navigate('/manageOrder')}>
         ← volver a ordenes
      </button>
      {renderContent()}
      <Footer />
    </div>
  );
};

export default ManageOrder;