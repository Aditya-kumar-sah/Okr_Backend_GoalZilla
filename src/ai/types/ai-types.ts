import { z } from 'zod';

export const KeyResultSchema = z.object({
  description: z.string(),
  currentProgress: z.number(),
  targetProgress: z.number(),
  metric: z.string(),
  isCompleted: z.boolean(),
});

export const OkrSchema = z.object({
  title: z.string(),
  keyResult: z.array(KeyResultSchema),
});