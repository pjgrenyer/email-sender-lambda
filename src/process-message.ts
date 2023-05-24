import { sendEmail } from './lib/aws/send-email';
import { recordEmail, recordEmailResponse } from './lib/recorder';
import { validateEmailAddresses } from './lib/validate-email-addresses';
import { Message } from './request';

export const processMessage = async (message: Message) => {
    const undefinedFromAddress = undefined;
    const toAddresses = message.toAddresses ?? [];
    const ccAddresses = message.ccAddresses ?? [];
    const bccAddresses = message.bccAddresses ?? [];
    const uniqueId = message.uniqueId;
    try {
        await recordEmail(toAddresses, ccAddresses, bccAddresses, uniqueId, message.subject, message.html, message.templateId, message.data);
        validateEmailAddresses(toAddresses, ccAddresses, bccAddresses);
        const response = await sendEmail(toAddresses, ccAddresses, bccAddresses, uniqueId, undefinedFromAddress, message.subject, message?.html, message.templateId, message.data);
        await recordEmailResponse(uniqueId, response);
    } catch (error: any) {
        await recordEmailResponse(uniqueId, JSON.stringify(error));
        throw error;
    }
};
