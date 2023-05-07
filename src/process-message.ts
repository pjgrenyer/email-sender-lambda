import sendEmail from './lib/aws/send-email';
import { Message } from './request';

export const processMessage = async (message: Message) => {
    if (message?.toAddresses) {
        await sendEmail(message?.toAddresses[0], message.subject, message.body);
    }
};
