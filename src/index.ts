import logger from './lib/logger';
import { Message, Request } from './request';

const handler = async (event: Request) => {
    try {
        for (const record of event.Records) {
            const body: Message = JSON.parse(record?.body);
            logger.debug(`Message received: ${record?.messageId}`, { context: 'handler', messageId: record?.messageId, body });
        }

        return { success: true };
    } catch (error: any) {
        logger.error(`Error: ${error}`, { context: 'handler', error });
        throw error;
    }
};

export { handler };
