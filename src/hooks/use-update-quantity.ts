// hooks
import { useQueryClient, useMutation } from '@tanstack/react-query';
// constants
import { SHOP_LIST } from '../constants/query-keys';
// utils
import { shopListApi } from '../api/shop-list';
// types
import { ListItem } from '../types/list-item.type';

interface ChangeQuantity {
  id: string;
  quantity: number;
}

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation<ListItem, Error, ChangeQuantity>({
    mutationFn: ({ id, quantity }) => shopListApi.updateQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHOP_LIST] });
    },
  });
};
