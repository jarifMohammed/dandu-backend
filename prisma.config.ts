// Prisma configuration for MongoDB
// MongoDB does not use Prisma migrations — use `prisma db push` instead.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema',
});
