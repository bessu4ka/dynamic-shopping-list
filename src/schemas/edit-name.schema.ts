import { z } from 'zod';

export const editNameFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Max 30 symbols'),
});

export type EditNameFormType = z.infer<typeof editNameFormSchema>;
