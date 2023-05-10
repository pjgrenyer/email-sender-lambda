import { maskEmailAddresses } from './lib/email-mask';
import logger from './lib/logger';
import { processMessage } from './process-message';
import { Message, Request } from './request';

const handler = async (event: Request) => {
    try {
        for (const record of event.Records) {
            const message: Message = JSON.parse(record?.body);
            logger.debug(`Message received: ${record?.messageId}`, { context: 'handler', messageId: record?.messageId, body: maskMessage(message) });
            await processMessage(message);
        }

        return { success: true };
    } catch (error: any) {
        logger.error(`Error: ${error}`, { context: 'handler', error });
        throw error;
    }
};

const maskMessage = (message: Message) => {
    const maskedMessage = Object.assign({}, message);
    maskedMessage.toAddresses = maskEmailAddresses(maskedMessage.toAddresses);
    maskedMessage.ccAddresses = maskEmailAddresses(maskedMessage.ccAddresses);
    maskedMessage.bccAddresses = maskEmailAddresses(maskedMessage.bccAddresses);
    return maskedMessage;
};

export { handler };
