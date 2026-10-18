import { useState } from 'react';

export function useSelection<T extends object>(
  items: T[],
  idField: keyof T,
  onItemClick?: (item: T) => void
) {
  type Id = T[keyof T];

  const [selectedIdRaw, setSelectedId] = useState<Id>();
  const [selectedIdsRaw, setSelectedIds] = useState<Id[]>([]);

  const present = new Set<Id>(items.map((item) => item[idField]));
  const selectedId =
    selectedIdRaw !== undefined && present.has(selectedIdRaw) ? selectedIdRaw : undefined;
  const selectedIds = selectedIdsRaw.filter((id) => present.has(id));

  const isMultiple = selectedIds.length > 0;

  const toggleMultiple = (id: Id) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );


  const handleRowClick = (item: T) => {
    const id = item[idField];

    if (isMultiple) {
      toggleMultiple(id);
      return;
    }
    if (selectedId === id) {
      setSelectedId(undefined);
      return;
    }
    setSelectedId(id);
    onItemClick?.(item);
  };
  
  const handleCheck = (item: T) => {
    setSelectedId(undefined);
    toggleMultiple(item[idField]);
  };

  const clear = () => {
    setSelectedId(undefined);
    setSelectedIds([]);
  };

  const selectedItems = isMultiple
    ? items.filter((item) => selectedIds.includes(item[idField]))
    : items.filter((item) => selectedId !== undefined && item[idField] === selectedId);

  return { selectedId, selectedIds, selectedItems, isMultiple, handleRowClick, handleCheck, clear };
}