import { z } from "zod";

export const createPasteSchema = z.object({
  title: z.string().min(1),
  language: z.string().min(1).array(),
  content: z.string().min(1),
});

export type CreatePasteSchema = z.infer<typeof createPasteSchema>;
