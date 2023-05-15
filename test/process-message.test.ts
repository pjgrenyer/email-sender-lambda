import { sendEmail } from '../src/lib/aws/send-email';
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

    it('should map message with subject and html', async () => {
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
            'html',
            undefined,
            undefined
        );
    });

    it('should map message with templateId and data', async () => {
        await processMessage({
            toAddresses: ['email1@example.com', 'email2@example.com'],
            ccAddresses: ['email3@example.com', 'email4@example.com'],
            bccAddresses: ['email5@example.com', 'email6@example.com'],
            data: [{ key: 'NAME', value: 'Paul' }],
            templateId: 'templateId',
            uniqueId: 'uniqueId',
        });

        expect(sendEmail).toBeCalledTimes(1);
        expect(sendEmail).toBeCalledWith(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'uniqueId',
            undefined,
            undefined,
            undefined,
            'templateId',
            [{ key: 'NAME', value: 'Paul' }]
        );
    });

    it('should convert null emails to empty array', async () => {
        await processMessage({
            subject: 'subject',
            html: 'html',
            uniqueId: 'uniqueId',
        });

        expect(sendEmail).toBeCalledTimes(1);
        expect(sendEmail).toBeCalledWith([], [], [], 'uniqueId', undefined, 'subject', 'html', undefined, undefined);
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
        it('should record email with subject and html', async () => {
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
                'html',
                undefined,
                undefined
            );
        });

        it('should record email with templateId and data', async () => {
            await processMessage({
                toAddresses: ['email1@example.com', 'email2@example.com'],
                ccAddresses: ['email3@example.com', 'email4@example.com'],
                bccAddresses: ['email5@example.com', 'email6@example.com'],
                templateId: 'templateId',
                data: [{ key: 'NAME', value: 'PAUL' }],
                uniqueId: 'uniqueId',
            });

            expect(recordEmail).toBeCalledTimes(1);
            expect(recordEmail).toBeCalledWith(
                ['email1@example.com', 'email2@example.com'],
                ['email3@example.com', 'email4@example.com'],
                ['email5@example.com', 'email6@example.com'],
                'uniqueId',
                undefined,
                undefined,
                'templateId',
                [{ key: 'NAME', value: 'PAUL' }]
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
