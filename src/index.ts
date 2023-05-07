//import logger from './lib/logger';
import { Request } from './request';

const handler = async (event: Request) => {
    try {
        for (const record of event.Records) {
            console.log(record?.messageId);
            const body = JSON.parse(record?.body);
            console.log(body);
            //            logger.debug('Message:', report);
        }

        return { success: true };
    } catch (error: any) {
        //logger.error(`Error: ${error}`, error);
        throw error;
    }
};

export { handler };
