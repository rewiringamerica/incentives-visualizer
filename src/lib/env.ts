import { z } from 'zod';

const schema = z.object({
  API_URL: z.string().url(),
  MAPTILER_API_KEY: z.string(),
});

export const env = schema.parse(process.env);
