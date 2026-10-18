import type { ReactNode } from 'react';
import IconCheck from '@/assets/check.svg';
import styles from './DataTable.module.css';


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface ColumnConfig<T extends object = object> {
  key: keyof T | 'actions';
  label: string;
  format?: (value: unknown) => string;
  render?: (item: T) => ReactNode;
  isTotalField?: boolean;
}

interface DataTableProps<T extends object> {
  data: T[];
  idField: keyof T;
  columns: ColumnConfig<T>[];
  caption?: string;
  showTotal?: boolean;
  onRowClick?: (item: T) => void;
  onSelectItem?: (item: T) => void;
  selectedId?: T[keyof T];
  selectedIds?: T[keyof T][];
}

// 'actions' no es un dato del item: para esa columna no hay valor que leer
const getValue = <T extends object>(item: T, key: ColumnConfig<T>['key']): unknown =>
  key === 'actions' ? undefined : item[key];

function DataTable<T extends object>({
  data,
  idField,
  columns,
  caption,
  showTotal = false,
  onRowClick,
  onSelectItem,
  selectedId,
  selectedIds = [],
}: DataTableProps<T>) {
  const totalColumn = columns.find((c) => c.isTotalField);
  const total =
    showTotal && totalColumn
      ? data.reduce((acc, item) => acc + Number(getValue(item, totalColumn.key) ?? 0), 0)
      : 0;
  const selectedCount = data.filter((item) => selectedIds.includes(item[idField])).length;
  const allSelected = data.length > 0 && selectedCount === data.length;
  const partiallySelected = selectedCount > 0 && !allSelected;

  const toggleVisibleSelection = () => {
    if (!onSelectItem) return;

    data
      .filter((item) => selectedIds.includes(item[idField]) === allSelected)
      .forEach(onSelectItem);
  };

  return (
    <div className={styles.tableContainer}>
      <Table className={styles.table}>
        {caption && <TableCaption className={styles.caption}>{caption}</TableCaption>}

        <TableHeader className={styles.header}>
          <TableRow className={styles.headerRow}>
            {onSelectItem && (
              <TableHead className={`${styles.head} ${styles.selectionHead}`}>
                <button
                  type="button"
                  className={styles.selectionCheckbox}
                  aria-label={allSelected ? 'Deseleccionar todas las filas visibles' : 'Seleccionar todas las filas visibles'}
                  aria-checked={partiallySelected ? 'mixed' : allSelected}
                  aria-pressed={allSelected || partiallySelected}
                  role="checkbox"
                  onClick={toggleVisibleSelection}
                >
                  {allSelected && <img src={IconCheck} alt="" />}
                  {partiallySelected && <span className={styles.selectionIndeterminate} />}
                </button>
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead key={String(col.key)} className={styles.head}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className={styles.tableBody}>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onSelectItem ? 1 : 0)}
                className={styles.cell}
                style={{ textAlign: 'center' }}
              >
                No hay registros para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const isSelected = selectedId !== undefined && item[idField] === selectedId;
              const isMultiSelected = selectedIds.includes(item[idField]);
              return (
                <TableRow
                  key={String(item[idField])}
                  className={`${styles.bodyRow} ${onRowClick ? styles.clickableRow : ''} ${isMultiSelected ? styles.selectedRow : isSelected ? styles.individuallySelectedRow : ''}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {onSelectItem && (
                    <TableCell className={`${styles.cell} ${styles.selectionCell}`}>
                      <button
                        type="button"
                        className={styles.selectionCheckbox}
                        aria-pressed={isMultiSelected}
                        aria-label={`Seleccionar fila ${String(item[idField])}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectItem(item);
                        }}
                      >
                        {isMultiSelected && <img src={IconCheck} alt="" />}
                      </button>
                    </TableCell>
                  )}
                  {columns.map((col) => {
                    const value = getValue(item, col.key);
                    return (
                      <TableCell key={String(col.key)} className={styles.cell}>
                        {col.render
                          ? col.render(item)
                          : col.format
                            ? col.format(value)
                            : String(value ?? '')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
        {showTotal && totalColumn && (
          <TableFooter className={styles.footer}>
            <TableRow className={styles.footerRow}>
              <TableCell colSpan={columns.length - (onSelectItem ? 0 : 1)} className={styles.footerCell}>
                Total
              </TableCell>
              <TableCell className={`${styles.footerCell} ${styles.total}`}>
                {totalColumn.format
                  ? totalColumn.format(total)
                  : `$${total.toLocaleString('es-AR')}`}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

export default DataTable;