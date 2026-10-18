import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { eventBus } from '@/lib/eventBus';
import { EVENT_QUERY_MAP } from '@/lib/queryKeys';

const QueryCacheSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cleanups = Object.entries(EVENT_QUERY_MAP).map(
      ([event, queryKey]) => {
        return eventBus.on(event, () => {
          queryClient.invalidateQueries({
            queryKey,
          });
        });
      }
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [queryClient]);

  return null;
};

export default QueryCacheSync;