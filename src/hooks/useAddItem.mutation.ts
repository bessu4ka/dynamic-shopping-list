// hooks
import { useQueryClient, useMutation } from '@tanstack/react-query';
// constants
import { SHOP_LIST } from '../constants/query-keys';
// utils
import { shopListApi } from '../api/shop-list';
// types
import type { ListItem } from '../types/list-item.type';
import type { addListItemFormType } from '../schemas/add-list-item-form.schema';

export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation<ListItem, Error, addListItemFormType>({
    mutationFn: async (item) => {
      return await shopListApi.addItem({
        ...item,
        id: String(Date.now()),
        purchased: false,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHOP_LIST] });
    },
  });
};
