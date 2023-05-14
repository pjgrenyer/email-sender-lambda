import sendEmail from './lib/aws/send-email';
import { recordEmail, recordEmailResponse } from './lib/recorder';
import { validateEmailAddresses } from './lib/validate-email-addresses';
import { Message } from './request';

export const processMessage = async (message: Message) => {
    const toAddresses = message.toAddresses ?? [];
    const ccAddresses = message.ccAddresses ?? [];
    const bccAddresses = message.bccAddresses ?? [];
    const uniqueId = message.uniqueId;
    try {
        await recordEmail(toAddresses, ccAddresses, bccAddresses, message.subject, message.html, uniqueId);
        validateEmailAddresses(toAddresses, ccAddresses, bccAddresses);
        const response = await sendEmail(toAddresses, ccAddresses, bccAddresses, message.subject, message.html, uniqueId);
        await recordEmailResponse(uniqueId, response);
    } catch (error: any) {
        await recordEmailResponse(uniqueId, JSON.stringify(error));
        throw error;
    }
};
