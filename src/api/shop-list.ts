// utils
import { instance } from './instance';

export const shopListApi = {
  getAllData: async () => {
    try {
      return (await instance.get('shopList')).data;
    } catch (error) {
      console.error('Error fetching shop list:', error);
    }
  },
};
