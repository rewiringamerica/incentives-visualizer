import { z } from 'zod';

const schema = z.object({
  API_URL: z.string().url(),
  MAPTILER_API_KEY: z.string(),
});

export const env = schema.parse({
  API_URL: process.env.API_URL,
  MAPTILER_API_KEY: process.env.MAPTILER_API_KEY,
});
