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
  purchased: boolean;
}

export const useUpdatePurchaseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ListItem, Error, ChangeQuantity>({
    mutationFn: ({ id, purchased }) =>
      shopListApi.updatePurchaseStatus(id, purchased),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHOP_LIST] });
    },
  });
};
