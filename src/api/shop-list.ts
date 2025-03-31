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

  updateQuantity: async (id: string, quantity: number) => {
    try {
      return (await instance.patch(`shopList/${id}`, { quantity })).data;
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },

  updatePurchaseStatus: async (id: string, purchased: boolean) => {
    try {
      return (await instance.patch(`shopList/${id}`, { purchased })).data;
    } catch (error) {
      console.error('Error updating purchase status:', error);
    }
  },

  removeItem: async (id: string) => {
    try {
      return (await instance.delete(`shopList/${id}`)).data;
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  },

  updateName: async (id: string, name: string) => {
    try {
      return (await instance.patch(`shopList/${id}`, { name })).data;
    } catch (error) {
      console.error('Error updating name:', error);
    }
  },
};
