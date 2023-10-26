import type { Config } from 'drizzle-kit';

export default {
  schema: 'src/lib/schema',
  out: 'drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true, // Print all statements
  // strict: true,  // Always ask for my confirmation
} satisfies Config;
