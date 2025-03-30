export interface ListItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  purchased: boolean;
}

export interface AdjustQuantity {
  id: string;
  quantity: number;
  quantityAdjustment: number;
}
