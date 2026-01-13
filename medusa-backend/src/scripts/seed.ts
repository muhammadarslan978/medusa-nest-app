import { ExecArgs } from '@medusajs/framework/types';

export default async function seed({ container }: ExecArgs): Promise<void> {
  const logger = container.resolve('logger');

  logger.info('Starting seed...');

  // Add your seed logic here
  // Example: Create regions, shipping options, products, etc.

  logger.info('Seed completed successfully');
}
