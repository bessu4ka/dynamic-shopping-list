// hooks
import { useQueryClient, useMutation } from '@tanstack/react-query';
// constants
import { SHOP_LIST } from '../constants/query-keys';
// utils
import { shopListApi } from '../api/shop-list';
// types
import { ListItem } from '../types/list-item.type';

interface RemoveQuantity {
  id: string;
}

export const useRemoveItem = () => {
  const queryClient = useQueryClient();

  return useMutation<ListItem, Error, RemoveQuantity>({
    mutationFn: ({ id }) => shopListApi.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHOP_LIST] });
    },
  });
};
