/**
 * Verify API Key to Sales Channel Links
 */

import { ExecArgs } from '@medusajs/framework/types';

export default async function verifyApiKeyLinks({ container }: ExecArgs) {
  const logger = container.resolve('logger');
  const query = container.resolve('query');

  try {
    logger.info(
      '\n╔════════════════════════════════════════════════════════════════╗',
    );
    logger.info(
      '║           Verify API Key to Sales Channel Links               ║',
    );
    logger.info(
      '╚════════════════════════════════════════════════════════════════╝\n',
    );

    // Get API keys with their sales channel relationships
    const { data: apiKeys } = await query.graph({
      entity: 'api_key',
      fields: [
        'id',
        'title',
        'type',
        'token',
        'sales_channels.id',
        'sales_channels.name',
      ],
      filters: { type: 'publishable' },
    });

    if (!apiKeys || apiKeys.length === 0) {
      logger.warn('⚠️  No publishable API keys found');
      return;
    }

    logger.info(`Found ${apiKeys.length} publishable API key(s):\n`);

    for (const apiKey of apiKeys) {
      logger.info(`API Key: ${apiKey.title}`);
      logger.info(`  ID: ${apiKey.id}`);
      logger.info(`  Token: ${apiKey.token}`);

      if (apiKey.sales_channels && apiKey.sales_channels.length > 0) {
        logger.info(
          `  ✓ Linked to ${apiKey.sales_channels.length} sales channel(s):`,
        );
        apiKey.sales_channels.forEach((channel: any) => {
          logger.info(`    - ${channel.name} (${channel.id})`);
        });
      } else {
        logger.warn(`  ⚠️  NOT linked to any sales channels!`);
      }
      logger.info('');
    }

    logger.info(
      '╚════════════════════════════════════════════════════════════════╝\n',
    );
  } catch (error) {
    logger.error('\n❌ Verification failed!');
    console.error(error);
    throw error;
  }
}
