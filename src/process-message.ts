import { validateEmailAddresses } from './lib/validate-email-addresses';
import { Message } from './request';

export const processMessage = async (message: Message) => {
    const toAddresses: string[] = [];
    const uniqueId = message.uniqueId;
    // try {
    // TODO: Record Email
    validateEmailAddresses(toAddresses, [], []);
    // TODO: Send Email
    // TODO: Record email success and response
    // } catch (error: any) {
    //     // TODO: Record email failure and response
    //     throw error;
    // }
};
