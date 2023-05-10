import logger from '../src/lib/logger';
import { processMessage } from '../src/process-message';
import { handler } from './../src/index';
import { Request } from './../src/request';

jest.mock('../src/process-message');

describe('handler', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should not call processMessage if there are no messages', async () => {
        await handler({ Records: [] } as Request);
        expect(processMessage).not.toBeCalled();
    });

    it('should log message with masked emails and messageId', async () => {
        const loggerSpy = jest.spyOn(logger, 'debug');
        await handler({
            Records: [
                {
                    messageId: 'messageId',
                    body: JSON.stringify({
                        toAddresses: ['email1@example.com', 'email2@example.com'],
                        ccAddresses: ['email3@example.com', 'email4@example.com'],
                        bccAddresses: ['email5@example.com', 'email6@example.com'],
                        subject: 'subject',
                        body: 'body',
                        uniqueId: 'uniqueId',
                    }),
                },
            ],
        } as Request);

        expect(loggerSpy).toBeCalledTimes(1);
        expect(loggerSpy).toBeCalledWith('Message received: messageId', {
            body: {
                bccAddresses: ['e*****5@e******e.com', 'e*****6@e******e.com'],
                body: 'body',
                ccAddresses: ['e*****3@e******e.com', 'e*****4@e******e.com'],
                subject: 'subject',
                toAddresses: ['e*****1@e******e.com', 'e*****2@e******e.com'],
                uniqueId: 'uniqueId',
            },
            context: 'handler',
            messageId: 'messageId',
        });
    });

    it('should log errors and rethrow', async () => {
        expect.assertions(3);
        (processMessage as any as jest.Mock).mockImplementationOnce(() => {
            throw 'Oops!';
        });
        const loggerSpy = jest.spyOn(logger, 'error');

        try {
            await handler({
                Records: [
                    {
                        messageId: 'messageId',
                        body: JSON.stringify({
                            toAddresses: ['email1@example.com'],
                            ccAddresses: [],
                            bccAddresses: [],
                            subject: 'subject',
                            body: 'body',
                            uniqueId: 'uniqueId',
                        }),
                    },
                ],
            } as Request);
        } catch (error: any) {
            expect(error).toEqual('Oops!');
        }

        expect(loggerSpy).toBeCalledTimes(1);
        expect(loggerSpy).toBeCalledWith('Error: Oops!', { context: 'handler', error: 'Oops!' });
    });

    it('should replace missing uniqueId with messageId', async () => {
        await handler({
            Records: [
                {
                    messageId: 'messageId',
                    body: JSON.stringify({
                        toAddresses: ['email1@example.com'],
                        ccAddresses: [],
                        bccAddresses: [],
                        subject: 'subject',
                        body: 'body',
                    }),
                },
            ],
        } as Request);

        expect(processMessage).toBeCalledWith({
            bccAddresses: [],
            body: 'body',
            ccAddresses: [],
            subject: 'subject',
            toAddresses: ['email1@example.com'],
            uniqueId: 'messageId',
        });
    });

    it('should call process for each message', async () => {
        await handler({
            Records: [
                {
                    messageId: 'messageId1',
                    body: JSON.stringify({
                        toAddresses: ['email1@example.com'],
                        ccAddresses: [],
                        bccAddresses: [],
                        subject: 'subject',
                        body: 'body',
                        uniqueId: 'uniqueId',
                    }),
                },
                {
                    messageId: 'messageId2',
                    body: JSON.stringify({
                        toAddresses: ['email2@example.com'],
                        ccAddresses: [],
                        bccAddresses: [],
                        subject: 'subject',
                        body: 'body',
                        uniqueId: 'uniqueId',
                    }),
                },
            ],
        } as Request);

        expect(processMessage).toBeCalledTimes(2);
        expect(processMessage).nthCalledWith(1, { bccAddresses: [], body: 'body', ccAddresses: [], subject: 'subject', toAddresses: ['email1@example.com'], uniqueId: 'uniqueId' });
        expect(processMessage).nthCalledWith(2, { bccAddresses: [], body: 'body', ccAddresses: [], subject: 'subject', toAddresses: ['email2@example.com'], uniqueId: 'uniqueId' });
    });
});
