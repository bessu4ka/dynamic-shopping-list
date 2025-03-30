// hooks
import { useQueryClient, useMutation } from '@tanstack/react-query';
// constants
import { SHOP_LIST } from '../constants/query-keys';
// utils
import { shopListApi } from '../api/shop-list';
// types
import { ListItem } from '../types/list-item.type';

interface UpdateName {
  id: string;
  name: string;
}

export const useUpdateName = () => {
  const queryClient = useQueryClient();

  return useMutation<ListItem, Error, UpdateName>({
    mutationFn: ({ id, name }) => shopListApi.updateName(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHOP_LIST] });
    },
  });
};
