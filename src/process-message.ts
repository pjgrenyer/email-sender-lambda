import sendEmail from './lib/aws/send-email';
import { Message } from './request';

export const processMessage = async (message: Message) => {
    await sendEmail(message.toAddresses ?? [], message.ccAddresses ?? [], message.bccAddresses ?? [], message.subject, message.body, message.uniqueId);
};
