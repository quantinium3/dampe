import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/auth-schema';

export const db = drizzle(process.env.DATABASE_URL);
export { schema };
