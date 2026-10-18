import styles from './Gestion.module.css';
import { useEffect, useState, useCallback } from "react";
import TarjetaGestion from "../../components/TarjetaGestion/TarjetaGestion";
import DataTable from "@/components/Common/DataTable/DataTable";
import type { ColumnConfig } from "@/components/Common/DataTable/DataTable";
import AltaTipoFalla from '@/pages/TipoFalla/AltaTipoFalla';
import BajaTipoFalla from '@/pages/TipoFalla/BajaTipoFalla';
import ModificacionTipoFalla from '@/pages/TipoFalla/ModificacionTipoFalla';
import AltaTipoCliente from "../TipoCliente/AltaTipoCliente";
import BajaTipoCliente from "../TipoCliente/BajaClientCategory";
import ModifyClientCategory from "../TipoCliente/ModifyClientCategory";
import { eventBus, EVENTS } from "@/lib/eventBus";
import { BACKEND_URL } from '@/lib/config';
import RegisterPaymentType from "../TipoPago/RegisterPaymentType";
import DeletePaymentType from "../TipoPago/DeletePaymentType";
import ModifyPaymentType from "../TipoPago/ModifyPaymentType";
import { Wrench, Users, CreditCard, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import type { Client_Type, Payment_Type, Failure_Type } from "@/types/types";
import type { PaginatedResponse } from "@/types/types";

// ─── Tipos y columnas ─────────────────────────────────────────────────────────

const COLUMNS_TF: ColumnConfig<Failure_Type>[] = [
  { key: 'id_failure_type', label: 'ID' },
  { key: 'failureDescription', label: 'Descripción' },
  {
    key: 'estimatedImport',
    label: 'Costo Estimado',
    isTotalField: true,
    format: (v) => `$${Number(v).toLocaleString('es-AR')}`,
  },
];

const COLUMNS_TC: ColumnConfig<Client_Type>[] = [
  { key: 'id_client_type', label: 'ID' },
  { key: 'clientTypeName', label: 'Nombre' },
  { key: 'amountForCategoryUp', label: 'Órdenes requeridas' },
];


const COLUMNS_PT: ColumnConfig<Payment_Type>[] = [
  { key: 'id_payment_type', label: 'ID' },
  { key: 'paymentTypeName', label: 'Nombre' },
  { key: 'percentage', label: 'Porcentaje', format: (value) => `${(Number(value) * 100).toLocaleString('es-AR')}%` },
  { key: 'paymentMethod', label: 'Método de Pago' },
];

const Gestion = () => {
  const { isAuth, loading: authLoading } = useAuth();

  const [dataTF, setDataTF] = useState<PaginatedResponse<Failure_Type> | Failure_Type[]>();
  const [dataTC, setDataTC] = useState<PaginatedResponse<Client_Type> | Client_Type[]>();
  const [dataPT, setDataPT] = useState<PaginatedResponse<Payment_Type> | Payment_Type[]>();
  // Qué está seleccionado para gestionar: null = pantalla de opciones
  const [seleccion, setSeleccion] = useState<string | null>(null);

  const busquedaTF = useCallback(async () => {
    try {
      const result = await fetch(`${BACKEND_URL}/api/failure-types/`,
        { method: 'GET', credentials: 'include' });

      if (result.status === 404) { setDataTF([]); return; }
      const data = await result.json();
      setDataTF(data);
    } catch (e) {
      console.error('Error al buscar TF:', e);
    }
  }, []);
  const failureTypesData = Array.isArray(dataTF) ? dataTF : (dataTF?.data ?? []);
  const busquedaTC = useCallback(async () => {
    try {
      const result = await fetch(`${BACKEND_URL}/api/client-types/`,
        { method: 'GET', credentials: 'include' });

      if (result.status === 404) { setDataTC([]); return; }
      const data = await result.json();
      setDataTC(data);
    } catch (e) {
      console.error('Error al buscar TC:', e);
    }
  }, []);
  const clientTypesData = Array.isArray(dataTC) ? dataTC : (dataTC?.data ?? []);
  const busquedaTP = useCallback(async () => {
    try {
      const result = await fetch(`${BACKEND_URL}/api/payment-types/`,
        { method: 'GET', credentials: 'include' });

      if (result.status === 404) { setDataPT([]); return; }
      const data = await result.json();
      setDataPT(data);
    } catch (e) {
      console.error('Error al buscar TP:', e);
    }
  }, []);
  const paymentTypesData = Array.isArray(dataPT) ? dataPT : (dataPT?.data ?? []);

  useEffect(() => {
    if (!authLoading && isAuth) {
      busquedaTF();
      busquedaTC();
      busquedaTP();
    }
  }, [authLoading, isAuth, busquedaTF, busquedaTC, busquedaTP]);


  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.failureTypeChanged, () => busquedaTF());
    return unsubscribe;
  }, [busquedaTF]);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.failureTypeDeleted, () => busquedaTF());
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
    const unsubscribe = eventBus.on(EVENTS.clientCategoryDeleted, () => busquedaTC());
    return unsubscribe;
  }, [busquedaTC]);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.paymentTypeChanged, () => busquedaTP());
    return unsubscribe;
  }, [busquedaTP]);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.paymentTypeDeleted, () => busquedaTP());
    return unsubscribe;
  }, [busquedaTP]);

  const opciones = [
    { key: 'falla', titulo: 'Tipo de Falla', icon: <Wrench size={26} />, descripcion: 'Administrá los tipos de falla que pueden ocurrir en los dispositivos.' },
    { key: 'cliente', titulo: 'Tipo de Cliente', icon: <Users size={26} />, descripcion: 'Administrá los tipos de cliente que interactúan con tu negocio.' },
    { key: 'pago', titulo: 'Tipo de Pago', icon: <CreditCard size={26} />, descripcion: 'Administrá los métodos de pago que tus clientes pueden utilizar.' },
  ];

  return (
    <>
      <div className={styles.bodyContainer}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.titleHeader}>Gestión</h1>
            <p className={styles.descriptionHeader}>
              {seleccion === null
                ? 'Elegí qué querés administrar: tipos de falla, tipos de cliente o tipos de pago.'
                : 'Gestioná los registros de esta categoría. Podés volver para elegir otra.'}
            </p>
          </div>

          {seleccion === null ? (

            <div className={styles.opcionesGrid}>
              {opciones.map((o) => (
                <button key={o.key} type="button" className={styles.opcionCard} onClick={() => setSeleccion(o.key)}>
                  <span className={styles.opcionIcon}>{o.icon}</span>
                  <h3 className={styles.opcionTitulo}>{o.titulo}</h3>
                  <p className={styles.opcionDesc}>{o.descripcion}</p>
                  <span className={styles.opcionAbrir}>Abrir →</span>
                </button>
              ))}
            </div>
          ) : (

            <div className={styles.detalle}>
              <button type="button" className={styles.volverBtn} onClick={() => setSeleccion(null)}>
                <ArrowLeft size={18} /> Volver
              </button>

              {seleccion === 'falla' && (
                <TarjetaGestion
                  titulo="Tipo de Falla"
                  descripcion="Administrá los tipos de falla que pueden ocurrir en los dispositivos. Agregá, editá o eliminá categorías para mantener tu sistema organizado."
                  childrenTable={
                    <DataTable data={failureTypesData} idField="id_failure_type" columns={COLUMNS_TF} caption="Tabla de Tipos de Fallas" showTotal={false} />
                  }
                  childrenFuncionAlta={<AltaTipoFalla />}
                  childrenFuncionBaja={<BajaTipoFalla />}
                  childrenFuncionModify={<ModificacionTipoFalla />}
                />
              )}

              {seleccion === 'cliente' && (
                <TarjetaGestion
                  titulo="Tipo de Cliente"
                  descripcion="Administrá los tipos de cliente que interactúan con tu negocio. Agregá, editá o eliminá categorías para segmentar tus servicios."
                  childrenTable={
                    <DataTable data={clientTypesData} idField="id_client_type" columns={COLUMNS_TC} caption="Tabla de Tipos de Cliente" showTotal={false} />
                  }
                  childrenFuncionAlta={<AltaTipoCliente />}
                  childrenFuncionBaja={<BajaTipoCliente />}
                  childrenFuncionModify={<ModifyClientCategory />}
                />
              )}

              {seleccion === 'pago' && (
                <TarjetaGestion
                  titulo="Tipo de Pago"
                  descripcion="Administrá los métodos de pago que tus clientes pueden utilizar. Agregá, editá o eliminá métodos para dar más flexibilidad."
                  childrenTable={
                    <DataTable data={paymentTypesData} idField="id_payment_type" columns={COLUMNS_PT} caption="Tabla de Tipos de Pago" showTotal={false} />
                  }
                  childrenFuncionAlta={<RegisterPaymentType />}
                  childrenFuncionBaja={<DeletePaymentType />}
                  childrenFuncionModify={<ModifyPaymentType />}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Gestion;
