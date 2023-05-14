import sendEmail from '../src/lib/aws/send-email';
import { recordEmail, recordEmailResponse } from '../src/lib/recorder';
import { validateEmailAddresses } from '../src/lib/validate-email-addresses';
import { processMessage } from '../src/process-message';

jest.mock('../src/lib/aws/send-email');
jest.mock('../src/lib/validate-email-addresses');
jest.mock('../src/lib/recorder');

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
            html: 'html',
            uniqueId: 'uniqueId',
        });

        expect(sendEmail).toBeCalledTimes(1);
        expect(sendEmail).toBeCalledWith(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'uniqueId',
            undefined,
            'subject',
            'html'
        );
    });

    it('should convert null emails to empty array', async () => {
        await processMessage({
            subject: 'subject',
            html: 'html',
            uniqueId: 'uniqueId',
        });

        expect(sendEmail).toBeCalledTimes(1);
        expect(sendEmail).toBeCalledWith([], [], [], 'uniqueId', undefined, 'subject', 'html');
    });

    it('should validate all email addresses', async () => {
        await processMessage({
            toAddresses: ['email1@example.com', 'email2@example.com'],
            ccAddresses: ['email3@example.com', 'email4@example.com'],
            bccAddresses: ['email5@example.com', 'email6@example.com'],
            subject: 'subject',
            html: 'html',
            uniqueId: 'uniqueId',
        });

        expect(validateEmailAddresses).toBeCalledTimes(1);
        expect(validateEmailAddresses).toBeCalledWith(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com']
        );
    });

    describe('record email', () => {
        it('should record email', async () => {
            await processMessage({
                toAddresses: ['email1@example.com', 'email2@example.com'],
                ccAddresses: ['email3@example.com', 'email4@example.com'],
                bccAddresses: ['email5@example.com', 'email6@example.com'],
                subject: 'subject',
                html: 'html',
                uniqueId: 'uniqueId',
            });

            expect(recordEmail).toBeCalledTimes(1);
            expect(recordEmail).toBeCalledWith(
                ['email1@example.com', 'email2@example.com'],
                ['email3@example.com', 'email4@example.com'],
                ['email5@example.com', 'email6@example.com'],
                'uniqueId',
                'subject',
                'html'
            );
        });

        it('should record successful response', async () => {
            const response = 'response';
            (sendEmail as any as jest.Mock).mockResolvedValue(response);

            await processMessage({
                toAddresses: ['email1@example.com', 'email2@example.com'],
                ccAddresses: ['email3@example.com', 'email4@example.com'],
                bccAddresses: ['email5@example.com', 'email6@example.com'],
                subject: 'subject',
                html: 'html',
                uniqueId: 'uniqueId',
            });

            expect(recordEmailResponse).toBeCalledTimes(1);
            expect(recordEmailResponse).toBeCalledWith('uniqueId', response);
        });

        it('should record error response', async () => {
            expect.assertions(3);
            (sendEmail as any as jest.Mock).mockImplementationOnce(() => {
                throw 'Oops!';
            });

            try {
                await processMessage({
                    toAddresses: ['email1@example.com', 'email2@example.com'],
                    ccAddresses: ['email3@example.com', 'email4@example.com'],
                    bccAddresses: ['email5@example.com', 'email6@example.com'],
                    subject: 'subject',
                    html: 'html',
                    uniqueId: 'uniqueId',
                });
            } catch (error: any) {
                expect(error).toEqual('Oops!');
            }

            expect(recordEmailResponse).toBeCalledTimes(1);
            expect(recordEmailResponse).toBeCalledWith('uniqueId', '"Oops!"');
        });
    });
});
