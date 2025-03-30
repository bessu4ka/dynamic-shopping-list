import { z } from 'zod';

export const addListItemFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
  category: z.string().min(1, 'Category is required'),
});

export type addListItemFormType = z.infer<typeof addListItemFormSchema>;
