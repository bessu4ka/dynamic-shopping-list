export interface ListItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  purchased: boolean;
}

export interface QuantityChangeParams {
  id: string;
  quantity: number;
  action: 'increase' | 'decrease';
}
