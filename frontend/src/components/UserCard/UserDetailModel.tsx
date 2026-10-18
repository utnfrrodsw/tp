import { useState, useEffect } from "react";
import DetailModal from "../Modals/DetailModal";
import type { DetailFieldConfig, DetailItemConfig } from "../Modals/DetailModal";
import styles from './UserDetailModal.module.css';
import { eventBus } from "@/lib/eventBus";
import { BACKEND_URL } from "@/lib/config";
import ActionButton from "../Common/Buttons/ActionButton";
import ConfirmDialog from "../Common/ConfirmDialog/ConfirmDialog";
import type { User as UserBase } from '@/features/users/types';

interface User extends UserBase {
  onClick?: (id: string) => void;
}

interface OrderSummary {
  id: string;
  status: string;
  date?: string;
}

const userFields: DetailFieldConfig<User>[] = [
  { name: 'userName', label: 'Nombre de usuario' },
  { name: 'email',    label: 'Email' },
  { name: 'rol',      label: 'Rol' },
  {
    name: 'validationStatus',
    label: 'Validación',
    format: (value) => (value === true ? 'Validado' : 'Pendiente de validación'),
  },
];

const orderItemConfig: DetailItemConfig<OrderSummary> = {
  getKey: (item) => item.id,
  primary: (item) => `Pedido #${item.id}`,
  secondary: (item) => item.status,
  onClick: (item) => console.log('abrir pedido', item.id),
};

interface UserDetailModalProps {
  user: User;
  orders: OrderSummary[];
  open: boolean;
  onClose: () => void;
  entityEvent?: string;
}

const UserDetailModal = ({
  user,
  orders,
  open,
  onClose,
  entityEvent,
}: UserDetailModalProps) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [formValidate, setFormValidate] = useState<User>(user);
  const [confirmBaja, setConfirmBaja] = useState(false);

  useEffect(() => {
    setFormValidate(user);
  }, [user]);
  useEffect(() => {
    if (!open) {
      setIsUpgrading(false);
    }
  }, [open]);

  const handleEdit = async (updatedUser: User): Promise<boolean> => {
    try {
      // Excluimos las propiedades que el esquema del backend prohíbe explícitamente
      const { id_user, status, ...payload } = updatedUser;

      const response = await fetch(
        `${BACKEND_URL}/api/users/${id_user}`,
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
        const errorValidate = await response.json().catch(() => ({}));
        throw new Error(errorValidate.message || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();

      if (entityEvent) eventBus.emit(entityEvent, result);

      return true;
    } catch (error) {
      console.error('Error al editar usuario:', error);
      alert(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
      return false;
    }
  };

  const handleValidate = async () => {
    await handleEdit({ ...user, validationStatus: true });
  };

  const handleConfirmUpgrade = async () => {
    const exito = await handleEdit({ ...formValidate, rol: 'admin' });
    if (exito) {
      setIsUpgrading(false);
    }
  };

  const doBaja = async () => {
    setConfirmBaja(false);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/users/${user.id_user}`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'No se pudo dar de baja el usuario');
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
      onClose={() => {
        setIsUpgrading(false);
        onClose();
      }}
      title={isUpgrading ? "Confirmar Ascenso" : "Detalle de Usuario"}
      data={user}
      fields={isUpgrading ? [] : userFields}
      statusField="status"
      statusLabel={(value) => (value === true ? "Activo" : "Inactivo")}
      statusTone={(value) => (value === true ? "active" : "inactive")}
      listTitle="Pedidos asociados"
      items={isUpgrading ? [] : orders}
      itemConfig={isUpgrading ? undefined : orderItemConfig}
      cancelLabel={isUpgrading ? "Cancelar" : "Cerrar"}
      onCancel={() => {
        if (isUpgrading) {
          setIsUpgrading(false);
        } else {
          onClose();
        }
      }}
      actions={
        isUpgrading
          ? [
              {
                label: "Confirmar Ascenso",
                variant: "primary",
                onClick: handleConfirmUpgrade,
              },
            ]
          : (user.status === true
              ? [
                  {
                    label: "Dar de baja",
                    variant: "danger",
                    onClick: () => setConfirmBaja(true),
                  },
                ]
              : [])
      }
    >
      {user.validationStatus === false && !isUpgrading && (
        <ActionButton
        label="Validar Usuario"
        onClick={handleValidate}
        icon={null}
        variant="neutral"
        />
      )}
      {!isUpgrading && user.validationStatus === true && user.rol !== 'admin' && (
        <ActionButton
        label="Ascender a Administrador"
        onClick={()=> setIsUpgrading(true)}
        icon={null}
        variant="neutral"
        />
      )}
      {isUpgrading && (
        <h1 className={styles.editingHeader}>Presione en confirmar ascenso para otorgarle todas las facultades correspondientes de un administrador al usuario {user.userName}.</h1>
      )}
    </DetailModal>

    <ConfirmDialog
      open={confirmBaja}
      danger
      title="Dar de baja usuario"
      message="El usuario quedará inactivo y no podrá iniciar sesión. ¿Continuar?"
      confirmLabel="Dar de baja"
      onConfirm={doBaja}
      onCancel={() => setConfirmBaja(false)}
    />
    </>
  );
};

export default UserDetailModal;