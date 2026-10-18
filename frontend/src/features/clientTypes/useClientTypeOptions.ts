// src/features/clientTypes/useClientTypeOptions.ts
import { useQuery } from '@tanstack/react-query';
import { clientTypesService } from './clientTypes.service';

export const useClientTypeOptions = () => {
  const { data, isPending } = useQuery({
    queryKey: ['client-types', 'options'],
    queryFn: ({ signal }) => clientTypesService.getAll({ page: 1, limit: 1000 }, signal),
    select: (res) =>
      res.data.map((t) => ({ value: t.id_client_type, label: t.clientTypeName })),
  });

  return { options: data ?? [], isLoading: isPending };
};