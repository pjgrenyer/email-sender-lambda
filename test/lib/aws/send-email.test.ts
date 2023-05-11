import logger from '../../../src/lib/logger';
import sendEmail from './../../../src/lib/aws/send-email';

const mockSendMail = jest.fn();

jest.mock('@aws-sdk/client-ses', () => {
    class SES {}

    return {
        SES,
    };
});

jest.mock('nodemailer', () => {
    return {
        createTransport: () => ({
            sendMail: (message: any) => mockSendMail(message),
        }),
    };
});

describe('Send email', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should handle no email addresses', async () => {
        await sendEmail([], [], [], '', '', '', '');

        expect(mockSendMail).toBeCalledTimes(1);
        expect(mockSendMail).toBeCalledWith({
            bcc: '',
            cc: '',
            from: '',
            html: '',
            subject: '',
            uniqueId: '',
            to: '',
        });
    });

    it('should handle mulitple email addresses', async () => {
        await sendEmail(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'subject',
            'body',
            'uniqueId',
            'email7@example.com'
        );

        expect(mockSendMail).toBeCalledTimes(1);
        expect(mockSendMail).toBeCalledWith({
            bcc: 'email5@example.com,email6@example.com',
            cc: 'email3@example.com,email4@example.com',
            from: 'email7@example.com',
            html: 'body',
            subject: 'subject',
            uniqueId: 'uniqueId',
            to: 'email1@example.com,email2@example.com',
        });
    });

    it('should use default from addres if not supplied', async () => {
        await sendEmail(['email1@example.com'], [], [], 'subject', 'body', 'uniqueId');

        expect(mockSendMail).toBeCalledTimes(1);
        expect(mockSendMail).toBeCalledWith({
            bcc: '',
            cc: '',
            from: 'from@example.com',
            html: 'body',
            subject: 'subject',
            uniqueId: 'uniqueId',
            to: 'email1@example.com',
        });
    });

    it('should mask email addresses in log', async () => {
        const loggerSpy = jest.spyOn(logger, 'info');

        await sendEmail(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'subject',
            'body',
            'uniqueId',
            'email7@example.com'
        );

        expect(loggerSpy).toBeCalledTimes(1);
        expect(loggerSpy).toBeCalledWith('Sending email: uniqueId', {
            bcc: 'e*****5@e******e.com,e*****6@e******e.com',
            cc: 'e*****3@e******e.com,e*****4@e******e.com',
            from: 'e*****7@e******e.com',
            html: 'body',
            subject: 'subject',
            to: 'e*****1@e******e.com,e*****2@e******e.com',
            uniqueId: 'uniqueId',
        });
    });
});
