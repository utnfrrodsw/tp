import styles from './TarjetaGestion.module.css';
import { Card, CardContent } from '@/components/ui/card';
import ModalTable from '../ModalTable/ModalTable';
import BottomPanel from '@/components/ui/SheetSide';
import AltaTipoFalla from '@/pages/TipoFalla/AltaTipoFalla';
import BajaTipoFalla from '@/pages/TipoFalla/BajaTipoFalla';
import ModificacionTipoFalla from '@/pages/TipoFalla/ModificacionTipoFalla';
import { useState } from 'react';

type TarjetaGestionProps = {
  titulo: string;
  descripcion: string;
  imagen: string;
  childrenCard?: React.ReactNode;
  childrenTable?: React.ReactNode;
  childrenFuncionAlta?: React.ReactNode;
  childrenFuncionBaja?: React.ReactNode;
  childrenFuncionModify?: React.ReactNode;
};

const TarjetaGestion = ({
  titulo,
  descripcion,
  imagen,
  childrenCard,
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


            <div className={styles.cajaTitulo}>
              <img src={imagen} alt={titulo} className={styles.imagenTitulo} />
              <div className={styles.tituloDecorativo}>
                <div className={styles.tituloContent}>
                  <h2 className={styles.titulo}>{titulo}</h2>
                </div>
              </div>
            </div>


            <p className={styles.descripcion}>{descripcion}</p>

            <button
              type="button"
              className={styles.botonVerTabla}
              onClick={() => setAbrirTabla(true)}
            >
              📋 Ver tabla
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
                  title="Eliminación de Tipo falla"
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
                  title="Modificación de Tipo falla"
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