import { SelectFilter, type FilterOption } from '@/components/Filters';
//import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { UsersQuery, User } from '../types';
import { usersService } from '../users.service';
import { EntityManagement, type EntityConfig, type FiltersProps } from '@/components/EntityManagement/EntityManagement';
import { EnumRol } from '@/types/types';
import UserDetailModal from "@/components/UserCard/UserDetailModel";
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useState } from 'react';
import { EVENTS } from '@/lib/eventBus';


const UserFilters = ({ query, updateQuery }: FiltersProps<UsersQuery>) => {
  const options: FilterOption<EnumRol>[] = Object.values(EnumRol).map((value) => ({
    value,
    label: value,
  }));

  return (
    <>
      <SelectFilter
        label="Tipo de cliente"
        value={query.ofRol}
        onChange={(v) => updateQuery({ ofRol: v })}
        options={options}
      />
      <SelectFilter
        label="Estado de validación"
        value={query.ofValidationStatus}
        onChange={(v) => updateQuery({ ofValidationStatus: v })}
        options={
          [
            { value: "1", label: 'Validado' },
            { value: "0", label: 'Pendiente de validación' },
          ]
        }
      />
    </>
  );
};

const UsersManagement = () => {
  const [detail, setDetail] = useState<{ user: User; clearSelection: () => void } | null>(null);

  const usersConfig: EntityConfig<User, UsersQuery> = {
    title: 'Usuarios',
    queryKey: QUERY_KEYS.users,
    queryFn: usersService.getAll,
    idField: 'id_user',
    columns: [
      { key: 'userName', label: 'Nombre' },
      { key: 'email', label: 'Email' },
      { key: 'rol', label: 'Rol' },
      //{ key: 'urlPicture', label: 'Foto' },
      { key: 'status', label: 'Estado', render: (c) => (c.status === false ? 'Baja' : 'Activo') },
    ],

    card: { titleField: 'userName', descriptionField: 'email', imageField: 'urlPicture' },
    searchPlaceholder: 'Buscar por nombre...',
    filterKeys: ['ofRol', 'ofValidationStatus'],
    initialQuery: { page: 1, limit: 10 },
    onItemClick: (user, { clearSelection }) => setDetail({ user, clearSelection }),
  };

  return (
    <>
      <EntityManagement
        config={usersConfig}
        Filters={UserFilters}
      />
      {detail && (
        <UserDetailModal
          user={detail.user}
          orders={[]}
          open={true}
          onClose={() => {
            detail.clearSelection();
            setDetail(null);
          }}
          entityEvent={EVENTS.userChanged}
        />
      )}
    </>);
};

export default UsersManagement;