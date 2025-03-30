// hooks
import { useState, useEffect } from 'react';
// utils
import { shopListApi } from '../api/shop-list';
// types
import type { ListItem } from '../types/list-item.type';

export const useShopList = () => {
  const [data, setData] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = () =>
      shopListApi
        .getAllData()
        .then(setData)
        .catch(setError)
        .finally(() => setIsLoading(false));

    fetchData();
  }, []);

  return { data, isLoading, error };
};
