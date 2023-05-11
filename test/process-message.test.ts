import sendEmail from '../src/lib/aws/send-email';
import { processMessage } from '../src/process-message';

jest.mock('../src/lib/aws/send-email');

describe('process message', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should map message', async () => {
        await processMessage({
            toAddresses: ['email1@example.com', 'email2@example.com'],
            ccAddresses: ['email3@example.com', 'email4@example.com'],
            bccAddresses: ['email5@example.com', 'email6@example.com'],
            subject: 'subject',
            body: 'body',
            uniqueId: 'uniqueId',
        });

        expect(sendEmail).toBeCalledTimes(1);
        expect(sendEmail).toBeCalledWith(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'subject',
            'body',
            'uniqueId'
        );
    });

    it('should convert null emails to empty array', async () => {
        await processMessage({
            subject: 'subject',
            body: 'body',
            uniqueId: 'uniqueId',
        });

        expect(sendEmail).toBeCalledTimes(1);
        expect(sendEmail).toBeCalledWith([], [], [], 'subject', 'body', 'uniqueId');
    });
});
