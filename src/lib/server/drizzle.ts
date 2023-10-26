import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import * as schema1 from '$lib/schema/auth';
import * as schema2 from '$lib/schema/post';

const client = postgres(DATABASE_URL);

// @ts-ignore
export const db = drizzle(client, { ...schema1, ...schema2 });
