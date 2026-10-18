import { useMemo, useState } from 'react';
import UserCard from './UserCard';
import type { UserCardProps } from './UserCard';
import styles from './UserGrid.module.css';

interface UserGridProps {
  users: UserCardProps[];
  onCardClick?: (id: string) => void;
  onAddClick?: () => void;
  columns?: 2 | 3 | 4;
}

const ALL_ROLES = '__ALL__';

export default function UserGrid({ users, onCardClick, onAddClick, columns }: UserGridProps) {
  const [rolFilter, setRolFilter] = useState<string>(ALL_ROLES);
  const [onlyUnvalidated, setOnlyUnvalidated] = useState(false);

  const availableRoles = useMemo(
    () => Array.from(new Set(users.map(u => u.rol))).sort(),
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRol = rolFilter === ALL_ROLES || user.rol === rolFilter;
      const matchesValidation = !onlyUnvalidated || user.validationStatus === false;
      return matchesRol && matchesValidation;
    });
  }, [users, rolFilter, onlyUnvalidated]);

  return (
    <div>

      <div className={styles.filters}>
        <select
          className={styles.rolSelect}
          value={rolFilter}
          onChange={e => setRolFilter(e.target.value)}
        >
          <option value={ALL_ROLES}>Todos los roles</option>
          {availableRoles.map(rol => (
            <option key={rol} value={rol}>{rol}</option>
          ))}
        </select>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={onlyUnvalidated}
            onChange={e => setOnlyUnvalidated(e.target.checked)}
          />
          Solo pendientes de validación
        </label>
      </div>

      <div className={`${styles.grid} ${styles[`cols${columns}`]}`}>
        {filteredUsers.map(user => (
          <UserCard
            key={user.id_user}
            {...user}
            onClick={onCardClick}
          />
        ))}

        {onAddClick && (
          <div className={styles.addCard} onClick={onAddClick}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addLabel}>Add Another User</span>
          </div>
        )}
      </div>
    </div>
  );
}