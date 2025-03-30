// hooks
import { useQuery } from '@tanstack/react-query';
// constants
import { SHOP_LIST } from '../constants/query-keys';
// utils
import { shopListApi } from '../api/shop-list';
// types
import type { ListItem } from '../types/list-item.type';

export const useShopList = () => {
  return useQuery<ListItem[], Error>({
    queryKey: [SHOP_LIST],
    queryFn: shopListApi.getAllData,
  });
};
