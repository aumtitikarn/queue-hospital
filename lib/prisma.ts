import { PrismaClient } from '../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create SQLite adapter
// DATABASE_URL format: "file:./dev.db" or just "./dev.db"
let dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
if (dbUrl.startsWith('file:')) {
  dbUrl = dbUrl.replace('file:', '')
}

const adapter = new PrismaBetterSqlite3({ url: dbUrl })

// For Prisma 7, PrismaClient requires an adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

