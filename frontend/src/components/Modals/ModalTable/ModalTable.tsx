import styles from './ModalTable.module.css';
import { X } from 'lucide-react';

type ModalTableProps = {
  open: boolean;
  onClose: () => void;
  titulo: string;
  children: React.ReactNode;
};

const ModalTable = ({ open, onClose, titulo, children }: ModalTableProps) => {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.titulo}>{titulo} — Tabla</h2>
          <button type="button" className={styles.cerrar} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.contenido}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default ModalTable;