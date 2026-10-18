import { useState, useEffect } from "react";
import DetailModal from "@/components/Modals/DetailModal";
import type { DetailFieldConfig, DetailItemConfig } from "@/components/Modals/DetailModal";
import styles from './ClientDetailModal.module.css';
import { eventBus } from "@/lib/eventBus";
import { BACKEND_URL } from "@/lib/config";
import type { Equipment as EquipmentBase } from "@/types/types";
import type { Client as BaseClient } from "@/types/types";
import EquipmentDetailModal from "@/components/EquipmentComponent/EquipmentDetailModal/EquipmentDetailModal";
import ConfirmDialog from "@/components/Common/ConfirmDialog/ConfirmDialog";

// Extendemos la interfaz BaseClient para agregar la propiedad aplanada
interface Client extends BaseClient {
  clientTypeName?: string;
}
interface Equipment extends EquipmentBase {
  onClick?: (id: string) => void;
}

const clientFields: DetailFieldConfig<Client>[] = [
  { name: 'clientName', label: 'Nombre Completo' },
  { name: 'clientEmail', label: 'Email' },
  { name: 'cuit', label: 'CUIT' },
  { name: 'clientTypeName', label: 'Categoría' },
  { name: 'clientPhone', label: 'Teléfono' },
  {
    name: 'dateOfRegistration',
    label: 'Fecha de registro',
    format: (value) =>
      new Date(value as string | Date).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  },
];

interface ClientDetailModalProps {
  client: Client;
  open: boolean;
  onClose: () => void;
  entityEvent?: string;
}

const ClientDetailModal = ({
  client,
  open,
  onClose,
  entityEvent,
}: ClientDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData]   = useState<Client>(client);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [showDetailModalEquipment, setShowDetailModalEquipment] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [refreshEquip, setRefreshEquip] = useState(0);
  const [confirmBaja, setConfirmBaja] = useState(false);

  const equipmentItemConfig: DetailItemConfig<Equipment> = {
    getKey: (item) => item.id_equipment,
    primary: (item) => item.tipo_equipment,
    secondary: (item) => `Modelo: ${item.model}`,
    onClick: (item) => {
      setSelectedEquipment(item);
      setShowDetailModalEquipment(true);
    },
  };

  useEffect(() => {
    setFormData(client);
  }, [client]);
  
  useEffect(() => {
    if (!open || !client?.id_client) return;

    const searchEquipments = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/equipments/equipmentForClient/${client.id_client}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Error al obtener equipos');

        const data: Equipment[] = await response.json();
        setEquipments(data);
      } catch (e) {
        console.error('Error fetching equipments:', e);
        setEquipments([]);
      }
    };

    searchEquipments();
  }, [client.id_client, open, refreshEquip]);

  useEffect(() => {
    if (!open) setIsEditing(false);
  }, [open]);

  const handleEdit = async (data: Client): Promise<boolean> => {
    try {
      const payload = {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        cuit: data.cuit,
      };

      const response = await fetch(
        `${BACKEND_URL}/api/clients/${data.id_client}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), 
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      console.log('Cliente editado con éxito:', result);

      if (entityEvent) eventBus.emit(entityEvent, result);

      return true;
    } catch (error) {
      console.error('Error al editar cliente:', error);
      alert(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const exito = await handleEdit(formData);
    if (exito) {
      setIsEditing(false);
    }
  };

  const doBaja = async () => {
    setConfirmBaja(false);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/clients/${client.id_client}`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'No se pudo dar de baja el cliente');
      }
      const result = await response.json();
      if (entityEvent) eventBus.emit(entityEvent, result);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    }
  };

  const doReactivar = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/clients/${client.id_client}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: true }),
          credentials: 'include',
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'No se pudo reactivar el cliente');
      }
      const result = await response.json();
      if (entityEvent) eventBus.emit(entityEvent, result);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    }
  };

  return (
    <>
    <DetailModal
      open={open}
      onClose={() => { setIsEditing(false); onClose(); }}
      title={isEditing ? "Editar Cliente" : "Detalle de Cliente"}
      data={isEditing ? formData : client}
      fields={isEditing ? [] : clientFields}
      statusField="status"
      statusLabel={(value) => (value === true ? "Activo" : "Inactivo")}
      statusTone={(value) => (value === true ? "active" : "inactive")}
      listTitle="Equipos asociados"
      items={isEditing ? [] : equipments}
      itemConfig={isEditing ? undefined : equipmentItemConfig}
      actions={
        isEditing
          ? [{ label: 'Guardar', variant: 'primary', onClick: () => handleSave() }]
          : [
              { label: 'Editar Cliente', variant: 'secondary', onClick: () => setIsEditing(true) },
              client.status === true
                ? { label: 'Dar de baja', variant: 'danger', onClick: () => setConfirmBaja(true) }
                : { label: 'Reactivar', variant: 'primary', onClick: () => doReactivar() },
            ]
      }
      cancelLabel={isEditing ? "Cancelar" : "Cerrar"}
      zIndex={1100}
      onCancel={() => isEditing ? setIsEditing(false) : onClose()}
    >
      {isEditing && (
        <form className={styles.editFormGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Nombre Completo</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className={styles.formInput} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} className={styles.formInput} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>CUIT</label>
            <input type="text" name="cuit" value={formData.cuit} onChange={handleChange} className={styles.formInput} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Teléfono</label>
            <input type="text" name="clientPhone" value={formData.clientPhone} onChange={handleChange} className={styles.formInput} />
          </div>
        </form>
      )}
    </DetailModal>

    {showDetailModalEquipment && selectedEquipment && (
      <EquipmentDetailModal
        equipment={selectedEquipment}
        open={showDetailModalEquipment}
        onClose={() => setShowDetailModalEquipment(false)}
        onEquipmentChanged={() => setRefreshEquip((k) => k + 1)}
        zIndex={1200}
      />
    )}

    <ConfirmDialog
      open={confirmBaja}
      danger
      title="Dar de baja cliente"
      message="El cliente quedará inactivo. ¿Querés continuar?"
      confirmLabel="Dar de baja"
      onConfirm={doBaja}
      onCancel={() => setConfirmBaja(false)}
    />
    </>
  );
};

export default ClientDetailModal;