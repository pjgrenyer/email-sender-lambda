import sendEmail from './lib/aws/send-email';
import { validateEmailAddresses } from './lib/validate-email-addresses';
import { Message } from './request';

export const processMessage = async (message: Message) => {
    const toAddresses = message.toAddresses ?? [];
    const ccAddresses = message.ccAddresses ?? [];
    const bccAddresses = message.bccAddresses ?? [];

    validateEmailAddresses(toAddresses, ccAddresses, bccAddresses);
    await sendEmail(toAddresses, ccAddresses, bccAddresses, message.subject, message.body, message.uniqueId);
};
