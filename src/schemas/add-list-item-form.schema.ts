import { z } from 'zod';

export const addListItemFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  category: z.string().min(1, 'Category is required'),
});

export type addListItemFormType = z.infer<typeof addListItemFormSchema>;
