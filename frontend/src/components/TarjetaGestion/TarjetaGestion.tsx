import styles from './TarjetaGestion.module.css';
import { Card, CardContent } from '@/components/ui/card';
import ModalTable from '../Modals/ModalTable/ModalTable';
import BottomPanel from '@/components/ui/SheetSide';
import { useState } from 'react';
import { ClipboardList } from 'lucide-react';

type TarjetaGestionProps = {
  titulo: string;
  descripcion: string;
  childrenCard?: React.ReactNode;
  childrenTable?: React.ReactNode;
  childrenFuncionAlta?: React.ReactNode;
  childrenFuncionBaja?: React.ReactNode;
  childrenFuncionModify?: React.ReactNode;
};

const TarjetaGestion = ({
  titulo,
  descripcion,
  childrenTable,
  childrenFuncionAlta,
  childrenFuncionBaja,
  childrenFuncionModify
}: TarjetaGestionProps) => {
  const [abrirTabla, setAbrirTabla] = useState(false);

  return (
    <Card>
      <CardContent className="p-0">
        <div className={styles.containerContent}>

          <div className={styles.columnaIzquierda}>

            {/* Título limpio (sin la foto borrosa de antes) */}
            <div className={styles.cajaTitulo}>
              <h2 className={styles.titulo}>{titulo}</h2>
            </div>

            <p className={styles.descripcion}>{descripcion}</p>

            <button
              type="button"
              className={styles.botonVerTabla}
              onClick={() => setAbrirTabla(true)}
            >
              <ClipboardList size={18} style={{ verticalAlign: '-4px', marginRight: 6 }} />Ver tabla
            </button>

            <ModalTable
              open={abrirTabla}
              onClose={() => setAbrirTabla(false)}
              titulo={titulo}
            >
              {childrenTable}
            </ModalTable>

            <div className={styles.tablaBotones}>

              <BottomPanel
                trigger={
                  <button type="button" className={`${styles.btnAccion} ${styles.btnGestionar}`}>
                    Gestionar
                  </button>
                }
                title={titulo}
                description={descripcion}
              >
                {childrenFuncionAlta}
              </BottomPanel>

              <div className={styles.botonesFilaSecundaria}>
                <BottomPanel
                  trigger={
                    <button type="button" className={`${styles.btnAccion} ${styles.btnEliminar}`}>
                      Eliminar
                    </button>
                  }
                  title={`Eliminación de ${titulo}`}
                  description="Eliminar"
                >
                  {childrenFuncionBaja}
                </BottomPanel>

                <BottomPanel
                  trigger={
                    <button type="button" className={`${styles.btnAccion} ${styles.btnEditar}`}>
                      Editar
                    </button>
                  }
                  title={`Modificación de ${titulo}`}
                  description="Modificar"
                >
                  {childrenFuncionModify}
                </BottomPanel>
              </div>

            </div>
          </div>

          {/* ── Columna derecha: tabla solo en desktop ── */}
          <div className={styles.columnaDerecha}>
            <div className={styles.tablaDesktop}>
              {childrenTable}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default TarjetaGestion;
