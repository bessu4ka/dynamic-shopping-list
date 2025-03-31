import { z } from 'zod';

export const updateNameFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Max 30 symbols'),
});

export type UpdateNameFormType = z.infer<typeof updateNameFormSchema>;
