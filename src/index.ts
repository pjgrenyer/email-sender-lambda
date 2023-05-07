import logger from './lib/logger';
import { processMessage } from './process-message';
import { Message, Request } from './request';

const handler = async (event: Request) => {
    try {
        for (const record of event.Records) {
            const message: Message = JSON.parse(record?.body);
            logger.debug(`Message received: ${record?.messageId}`, { context: 'handler', messageId: record?.messageId, body: message });
            await processMessage(message);
        }

        return { success: true };
    } catch (error: any) {
        logger.error(`Error: ${error}`, { context: 'handler', error });
        throw error;
    }
};

export { handler };
