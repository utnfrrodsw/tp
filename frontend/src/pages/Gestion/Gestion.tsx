import Nav from "../Nav/Nav";
import styles from './Gestion.module.css';
import { useEffect, useState, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import TarjetaGestion from "../../components/TarjetaGestion/TarjetaGestion";
import imagenTarjetaTipoFalla from "../../assets/imagenTarjetaTipoFalla.png";
import imagenTarjetaTipoCliente from "../../assets/imagenTarjetaTipoCliente.png";
import imagenTarjetaTipoPago from "../../assets/imagenTarjetaTipoPago.jpg";
import TableRtl from "@/components/DataTable/DataTable";
import type { ColumnConfig } from "@/components/DataTable/DataTable";
import { parseJwt } from "../App/App";
import AltaTipoFalla from '@/pages/TipoFalla/AltaTipoFalla';
import BajaTipoFalla from '@/pages/TipoFalla/BajaTipoFalla';
import ModificacionTipoFalla from '@/pages/TipoFalla/ModificacionTipoFalla';
import AltaTipoCliente from "../TipoCliente/AltaTipoCliente";
import BajaTipoCliente from "../TipoCliente/BajaClientCategory";
import ModifyClientCategory from "../TipoCliente/ModifyClientCategory";
import { eventBus, EVENTS } from "@/lib/eventBus";
import RegisterPaymentType from "../TipoPago/RegisterPaymentType";
import DeletePaymentType from "../TipoPago/DeletePaymentType";
import ModifyPaymentType from "../TipoPago/modifyPaymentType";


// ─── Tipos y columnas ─────────────────────────────────────────────────────────

interface FailureType {
  id_failure_type: number;
  failureDescription: string;
  estimatedImport: number;
}

const COLUMNS_TF: ColumnConfig<FailureType>[] = [
  { key: 'id_failure_type',    label: 'ID' },
  { key: 'failureDescription', label: 'Descripción' },
  {
    key: 'estimatedImport',
    label: 'Costo Estimado',
    isTotalField: true,
    format: (v) => `$${Number(v).toLocaleString('es-AR')}`,
  },
];

interface ClientType {
  id_category_client: number;
  categoryClientName: string;
  amountForCategoryUp: number;
}

const COLUMNS_TC: ColumnConfig<ClientType>[] = [
  { key: 'id_category_client',  label: 'ID' },
  { key: 'categoryClientName',  label: 'Nombre' },
  { key: 'amountForCategoryUp', label: 'Órdenes requeridas' },
];

interface PaymentType {
  id_payment_type: number;
  paymentTypeName: string;
  paymentMethod: string;
  type_of_payment: string;
  percentaje: number;
}

const COLUMNS_PT: ColumnConfig<PaymentType>[] = [
  { key: 'id_payment_type', label: 'ID' },
  { key: 'paymentTypeName', label: 'Nombre' },
  { key: 'percentaje', label: 'Porcentaje', format: (value) => `${(Number(value)*100).toLocaleString('es-AR')}%` },
  { key: 'paymentMethod', label: 'Método de Pago' },
];

const Gestion = () => {
  const [dataTF, setDataTF] = useState<FailureType[]>([]);
  const [dataTC, setDataTC] = useState<ClientType[]>([]);
  const [dataPT, setDataPT] = useState<PaymentType[]>([]);

  const busquedaTF = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token');
      const decoded = parseJwt(token);
      if (!decoded?.id_user) throw new Error('Token inválido');

      const result = await fetch(
        `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/failures/getAllTypes`,
        { headers: { Authorization: `Bearer ${token}` }, method: 'GET' }
      );

      if (result.status === 404) { setDataTF([]); return; }
      const data = await result.json();
      setDataTF(data);
    } catch (e) {
      console.error('Error al buscar TF:', e);
    }
  }, []);

  const busquedaTC = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token');
      const decoded = parseJwt(token);
      if (!decoded?.id_user) throw new Error('Token inválido');

      const result = await fetch(
        `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/clients/getAllCategoryClients`,
        { headers: { Authorization: `Bearer ${token}` }, method: 'GET' }
      );

      if (result.status === 404) { setDataTC([]); return; }
      const data = await result.json();
      setDataTC(data);
    } catch (e) {
      console.error('Error al buscar TC:', e);
    }
  }, []);

  const busquedaTP = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token');
      const decoded = parseJwt(token);
      if (!decoded?.id_user) throw new Error('Token inválido');

      const result = await fetch(
        `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/payments/getAllPaymentTypes`,
        { headers: { Authorization: `Bearer ${token}` }, method: 'GET' }
      );

      if (result.status === 404) { setDataPT([]); return; }
      const data = await result.json();
      setDataPT(data);
    } catch (e) {
      console.error('Error al buscar TP:', e);
    }
  }, []);

  // Carga inicial
  useEffect(() => { busquedaTF(); }, [busquedaTF]);
  useEffect(() => { busquedaTC(); }, [busquedaTC]);
  useEffect(() => { busquedaTP(); }, [busquedaTP]);

  // Suscripciones al eventBus
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.failureTypeChanged, () => busquedaTF());
    return unsubscribe;
  }, [busquedaTF]);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.clientChanged, () => busquedaTC());
    return unsubscribe;
  }, [busquedaTC]);
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.clientCategoryChanged, () => busquedaTC());
    return unsubscribe;
  }, [busquedaTC]);
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.paymentTypeChanged, () => busquedaTP());
    return unsubscribe;
  }, [busquedaTP]);
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 1, spacing: 16 },
  });

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titleHeader}>Gestión</h1>
          <p className={styles.descriptionHeader}>
            Bienvenido a la sección de gestión. Aquí podrás administrar los tipos de fallas, tipos de clientes y los tipos de pago de manera eficiente.
          </p>
        </div>

        <div style={{ maxWidth: '100%', margin: '30px auto', padding: '0 48px', position: 'relative' }}>
          <button
            onClick={() => instanceRef.current?.prev()}
            className={styles.nextButton}
            style={{
              position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
              background: 'white', border: '1px solid #e5e7eb', borderRadius: '50%',
              width: 36, height: 36, cursor: 'pointer', fontSize: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10,
            }}
          >‹</button>

          <div ref={sliderRef} className="keen-slider">

            {/* ── Slide Tipo Falla ── */}
            <div className="keen-slider__slide">
              <TarjetaGestion
                titulo="Tipo falla"
                descripcion="Administra los tipos de fallas que pueden ocurrir en los dispositivos. Agrega, edita o elimina categorías para mantener tu sistema organizado y eficiente."
                imagen={imagenTarjetaTipoFalla}
                childrenTable={
                  <TableRtl
                    data={dataTF}
                    idField="id_failure_type"
                    columns={COLUMNS_TF}
                    caption="Tabla de Tipos de Fallas"
                    showTotal={false}
                  />
                }
                childrenFuncionAlta={<AltaTipoFalla />}
                childrenFuncionBaja={<BajaTipoFalla />}
                childrenFuncionModify={<ModificacionTipoFalla />}
              />
            </div>

            {/* ── Slide Tipo Cliente ── */}
            <div className="keen-slider__slide">
              <TarjetaGestion
                titulo="Tipo Cliente"
                descripcion="Administra los tipos de clientes que interactúan con tu negocio. Agrega, edita o elimina categorías para segmentar y personalizar tus servicios de manera efectiva."
                imagen={imagenTarjetaTipoCliente}
                childrenTable={
                  <TableRtl
                    data={dataTC}
                    idField="id_category_client"
                    columns={COLUMNS_TC}
                    caption="Tabla de Tipos de Cliente"
                    showTotal={false}
                  />
                }
                childrenFuncionAlta={<AltaTipoCliente />}
                childrenFuncionBaja={<BajaTipoCliente />}
                childrenFuncionModify={<ModifyClientCategory />}
              />
            </div>
            <div className="keen-slider__slide">
              <TarjetaGestion
              titulo="Tipo Pago"
              descripcion="Administra los tipos de pago que tus clientes pueden utilizar. Agrega, edita o elimina métodos de pago para ofrecer flexibilidad y conveniencia en las transacciones."
              imagen={imagenTarjetaTipoPago}
              childrenTable={
                <TableRtl
                  data={dataPT}
                  idField="id_payment_type"
                  columns={COLUMNS_PT}
                  caption="Tabla de Tipos de Pago"
                  showTotal={false}
                />
              }
              childrenFuncionAlta={<RegisterPaymentType />}
              childrenFuncionBaja={<DeletePaymentType />}
              childrenFuncionModify={<ModifyPaymentType />} 
              />
            </div>
          </div>

          <button
            onClick={() => instanceRef.current?.next()}
            className={styles.nextButton}
            style={{
              position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
              background: 'white', border: '1px solid #e5e7eb', borderRadius: '50%',
              width: 36, height: 36, cursor: 'pointer', fontSize: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10,
              }}
          >›</button>
        </div>
      </div>
    </>
  );
};

export default Gestion;