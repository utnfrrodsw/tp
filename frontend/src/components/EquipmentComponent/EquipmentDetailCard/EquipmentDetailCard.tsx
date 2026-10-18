import type { ElementType } from "react";
import {
  Smartphone,
  Monitor,
  Tablet,
  Gamepad2,
  Laptop,
  Printer,
  Tv,
  HelpCircle,
  Pencil,
} from "lucide-react";
import type { Equipment, EnumEquipmentType } from "@/types/types";
import styles from "./EquipmentDetailCard.module.css";

const TYPE_ICONS: Record<EnumEquipmentType, ElementType> = {
  celular: Smartphone,
  computadora: Monitor,
  tablet: Tablet,
  consola: Gamepad2,
  notebook: Laptop,
  impresora: Printer,
  televisor: Tv,
  otro: HelpCircle,
};

export interface EquipmentDetailCardProps {
  equipment: Equipment;
  imei?: string;
  storage?: string;
  color?: string;
  accessories?: string[];
  onEdit?: () => void;
}

function maskImei(imei: string) {
  return `...${imei.slice(-5)}`;
}

const EquipmentDetailCard = ({
  equipment,
  imei,
  storage,
  color,
  accessories,
  onEdit,
}: EquipmentDetailCardProps) => {
  const Icon = TYPE_ICONS[equipment.tipo_equipment] ?? HelpCircle;
  const subtitleParts = [equipment.brand, storage, color].filter(Boolean);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <Icon size={18} />
        </div>

        <div className={styles.titleBlock}>
          <span className={styles.title}>{equipment.model}</span>
          {subtitleParts.length > 0 && (
            <span className={styles.subtitle}>{subtitleParts.join(' • ')}</span>
          )}
        </div>

        {imei && <span className={styles.imeiBadge}>IMEI {maskImei(imei)}</span>}

        {onEdit && (
          <button
            type="button"
            className={styles.editButton}
            onClick={onEdit}
            aria-label="Editar equipo"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      {(imei || (accessories && accessories.length > 0)) && (
        <div className={styles.infoGrid}>
          {imei && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>N° de Serie / IMEI</span>
              <span className={styles.infoValue}>{imei}</span>
            </div>
          )}

          {accessories && accessories.length > 0 && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Accesorios Dejados</span>
              <span className={styles.infoValue}>{accessories.join(' + ')}</span>
            </div>
          )}
        </div>
      )}

      {equipment.observations && (
        <div className={styles.observations}>
          <span className={styles.observationsLabel}>Estado estético:</span>
          <p className={styles.observationsText}>{equipment.observations}</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetailCard;