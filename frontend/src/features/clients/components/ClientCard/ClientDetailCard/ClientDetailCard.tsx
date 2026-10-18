import { User, Phone, Mail, MapPin, Pencil } from "lucide-react";
import type { Client } from "@/types/types";
import styles from "./ClientDetailCard.module.css";

export interface ClientDetailCardProps {
  client: Client;
  vip?: boolean;
  repairsCount?: number;
  branch?: string;
  onEdit?: () => void;
}

const ClientDetailCard = ({
  client,
  vip,
  repairsCount,
  branch,
  onEdit,
}: ClientDetailCardProps) => {
  const categoryLabel = client.client_type?.clientTypeName;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <User size={18} />
        </div>

        <div className={styles.titleBlock}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{client.clientName}</span>
            {vip && <span className={styles.vipBadge}>VIP</span>}
          </div>

          {(categoryLabel || repairsCount !== undefined) && (
            <span className={styles.subtitle}>
              {categoryLabel}
              {categoryLabel && repairsCount !== undefined && ' '}
              {repairsCount !== undefined && `(${repairsCount} reparaciones previas)`}
            </span>
          )}
        </div>

        {onEdit && (
          <button
            type="button"
            className={styles.editButton}
            onClick={onEdit}
            aria-label="Editar cliente"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <Phone size={14} className={styles.infoIcon} />
          <span className={styles.infoLabel}>Teléfono</span>
          <a href={`tel:${client.clientPhone}`} className={styles.infoValueLink}>
            {client.clientPhone}
          </a>
        </div>

        <div className={styles.infoRow}>
          <Mail size={14} className={styles.infoIcon} />
          <span className={styles.infoLabel}>Email</span>
          <a href={`mailto:${client.clientEmail}`} className={styles.infoValueLink}>
            {client.clientEmail}
          </a>
        </div>

        {branch && (
          <div className={styles.infoRow}>
            <MapPin size={14} className={styles.infoIcon} />
            <span className={styles.infoLabel}>Sucursal</span>
            <span className={styles.infoValue}>{branch}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetailCard;