import styles from "./UserManagement.module.css";
import SearchBar from "@/components/SearchBar/SearchBar";
import type { FilterConfig } from "@/components/SearchBar/SearchBar";
import UserGrid from "@/components/UserCard/UserGrid";
import { useState, useEffect, useCallback, useMemo } from "react";
import { BACKEND_URL } from "@/lib/config";
import { eventBus, EVENTS } from "@/lib/eventBus";
import UserDetailModal from "@/components/UserCard/UserDetailModel";
import type { PaginatedResponse } from "@/types/types";
import type { User } from '@/features/users/types';
{/*
type User = UserBase & {
  onClick?: (id: string) => void;
};  
 */}

const UserManagement = () => {
  // OJO: el genérico va sobre el tipo del elemento (User), no sobre el
  // array (User[]) — PaginatedResponse<T> ya trae "data: T[]" adentro.
  const [results, setResults] = useState<PaginatedResponse<User> | null>(null);
  const [users, setAllUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setOneUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  // ─── Fetches ───────────────────────────────────────────────────────────────

  const getAllUsers = useCallback(async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/users/`,
        { credentials: 'include' }
      );

      if (res.status === 404) {
        // El backend devuelve 404 cuando no hay usuarios que cumplan el filtro
        setAllUsers([]);
        return;
      }

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      // El findAll paginado devuelve { data, metadata }, no un array suelto.
      const responseData: PaginatedResponse<User> = await res.json();
      setAllUsers(Array.isArray(responseData.data) ? responseData.data : []);
    } catch (e) {
      console.error('Error al obtener usuarios:', e);
      setError('No se pudieron cargar los usuarios. Intentá de nuevo.');
      setAllUsers([]);
    }
  }, []);

  const fetchOneUser = useCallback(async (id: string): Promise<User | null> => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/users/${id}`,
        { credentials: 'include' }
      );
      return await res.json();
    } catch (e) {
      console.error('Error en getOneUser:', e);
      return null;
    }
  }, []);

  // ─── Efectos ───────────────────────────────────────────────────────────────

  useEffect(() => { getAllUsers(); }, [getAllUsers]);

  // Suscripción única — refresca lista y modal si está abierto
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.userChanged, async () => {
      await getAllUsers();
      if (open && user) {
        const updated = await fetchOneUser(user.id_user);
        if (updated) setOneUser(updated);
      }
    });
    return unsubscribe;
  }, [getAllUsers, fetchOneUser, open, user]);

  // ─── Acciones ──────────────────────────────────────────────────────────────

  const openModal = async (id: string) => {
    const data = await fetchOneUser(id);
    if (data) {
      setOneUser(data);
      setOpen(true);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setOneUser(null);
  };

  // ─── Filtros ───────────────────────────────────────────────────────────────
  // Las opciones de rol se derivan de los usuarios ya cargados, así no hace
  // falta un endpoint aparte ni hardcodear los valores del enum EnumRol.

  const availableRoles = useMemo(
    () => Array.from(new Set((Array.isArray(users) ? users : []).map((u) => u.rol))).sort(),
    [users]
  );

  const USER_FILTERS: FilterConfig[] = useMemo(() => [
    {
      key: 'rol',
      label: 'Rol',
      type: 'select',
      placeholder: 'Todos los roles',
      options: availableRoles.map((r) => ({
        value: r,
        label: r,
      })),
    },
    {
      key: 'validationStatus',
      label: 'Validación',
      type: 'select',
      placeholder: 'Todos',
      options: [
        { value: 'false', label: 'Pendientes de validación' },
        { value: 'true', label: 'Validados' },
      ],
    },
  ], [availableRoles]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>

        <div className={styles.header}>
          <div className={styles.headerText}>
            <div>
              <h1 className={styles.title}>Directorio de Usuarios</h1>
              <p className={styles.subtitle}>
                Visualice los usuarios registrados y valide las cuentas pendientes.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.searchRow}>
          <SearchBar<User>
            showFilters={true}
            filters={USER_FILTERS}
            searchEndpoint="/api/users"
            searchPlaceholder="Buscar usuarios por nombre de usuario o correo electrónico"
            onResults={(data) => setResults(data)}
            onClear={() => setResults(null)}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {user && open && (
          <UserDetailModal
            user={user}
            orders={[]}
            open={open}
            onClose={closeModal}
            entityEvent={EVENTS.userChanged}
          />
        )}

        <div className={styles.mainContent} style={{ display: 'block' }}>
          <div className={styles.gridSection}>
            <UserGrid
              users={results?.data || users}
              columns={4}
              onCardClick={(id: string) => openModal(id)}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserManagement;