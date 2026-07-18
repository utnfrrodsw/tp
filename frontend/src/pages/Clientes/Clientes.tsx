import { useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import type { FilterConfig } from '../../components/SearchBar/SearchBar';
import ClientGrid from '../../components/ClientCard/ClientGrid';
import ActionButton from '../../components/Buttons/ActionButton';
import Nav from '../../pages/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import styles from './Clientes.module.css';

const CLIENT_FILTERS: FilterConfig[] = [
  {
    key: 'fecha',
    label: 'Fecha de última reparación',
    type: 'date',
    placeholder: 'Cualquier fecha',
  },
  {
    key: 'categoryClient',
    label: 'Tipo de cliente',
    type: 'select',
    placeholder: 'Todos los tipos',
    options: [
      { value: 'Normal',   label: 'Normal' },
      { value: 'Medio',    label: 'Medio' },
      { value: 'Premium',  label: 'Premium' },
      // ajustá con los valores reales de tu Category_Client
    ],
  },
];

const Clientes = () => {
  const [results, setResults] = useState([]);
 
  return (
    <div className={styles.page}>
      <Nav />
 
      <div className={styles.content}>
 
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div>
            <h1 className={styles.title}>👥 Directorio de Clientes</h1>
            <p className={styles.subtitle}>
              Administre la base de datos de sus clientes y realice un seguimiento del historial de servicios.
            </p>
            </div>
            <div className={styles.addButtonContainer}>
              <ActionButton
                label="Agregar Cliente"
                onClick={() => { /* lógica para agregar cliente */ }}
              />
            </div>
          </div>
        </div>
 
        {/* ── SearchBar ── */}
        <div className={styles.searchRow}>
          <SearchBar
            filters={CLIENT_FILTERS}
            searchEndpoint="/clients/getPartialClient"
            searchPlaceholder="Buscar clientes por nombre, apellido o correo electrónico"
            onResults={(data) => setResults(data as [])}
            onClear={() => setResults([])}
          />
        </div>
 
        {/* ── Grid ── */}
        <div className={styles.gridSection}>
          <ClientGrid clients={results} />
        </div>
 
      </div>
 
      <Footer />
    </div>
  );
};
 
export default Clientes;