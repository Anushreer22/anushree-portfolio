import { PrismaClient } from '@prisma/client';
import env from './env.js';

let prismaInstance = null;

export function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }
  return prismaInstance;
}

export function setPrismaClient(mockClient) {
  prismaInstance = mockClient;
}

export const prisma = new Proxy({}, {
  get(target, prop) {
    const client = getPrismaClient();
    return client[prop];
  }
});

export default prisma;

