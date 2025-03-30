// utils
import { instance } from './instance';
// types
import type { ListItem } from '../types/list-item.type';

export const shopListApi = {
  getAllData: async () => {
    try {
      return (await instance.get('shopList')).data;
    } catch (error) {
      console.error('Error fetching shop list:', error);
    }
  },

  addItem: async (item: ListItem) => {
    try {
      return (await instance.post('shopList', item)).data;
    } catch (error) {
      console.error('Error adding item:', error);
    }
  },
};
