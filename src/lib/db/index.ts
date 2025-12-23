// Database utility functions - Re-export all
export * from './contestants';
export * from './votes';
export * from './applications';
export * from './admin';
export * from './locations';

// Re-export prisma client
export { default as prisma } from '@/lib/prisma';
