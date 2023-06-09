import { recordEmail, recordEmailResponse } from '../../src/lib/recorder';

const mockSend = jest.fn();
const mockDestroy = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => {
    class mockPutItemCommand {
        private _params: any;

        constructor(params: any) {
            this._params = params;
        }
    }

    class mockUpdateItemCommand {
        private _params: any;

        constructor(params: any) {
            this._params = params;
        }
    }

    class mockDynamoDBClient {
        private _region: string;

        constructor(params: any) {
            this._region = params.region;
        }
        public send = mockSend;
        public destroy = mockDestroy;
    }
    return {
        DynamoDBClient: mockDynamoDBClient,
        PutItemCommand: mockPutItemCommand,
        UpdateItemCommand: mockUpdateItemCommand,
    };
});

describe('record', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should record email with subject and html', async () => {
        await recordEmail(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'uniqueId',
            'subject',
            'html',
            undefined,
            undefined
        );
        expect(mockSend).toBeCalledTimes(1);
        expect(mockSend).toBeCalledWith({
            _params: {
                Item: {
                    Bcc: { S: 'e*****5@e******e.com,e*****6@e******e.com' },
                    Html: { S: 'html' },
                    Cc: { S: 'e*****3@e******e.com,e*****4@e******e.com' },
                    RecordType: { S: 'Email' },
                    Subject: { S: 'subject' },
                    To: { S: 'e*****1@e******e.com,e*****2@e******e.com' },
                    UniqueId: { S: 'uniqueId' },
                    TemplateId: { S: '' },
                    Data: { S: '' },
                },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: 'SendEmailLambda',
            },
        });

        expect(mockDestroy).toBeCalledTimes(1);
    });

    it('should record email with templateId and data', async () => {
        await recordEmail(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'uniqueId',
            undefined,
            undefined,
            'templateId',
            { key: 'value' }
        );
        expect(mockSend).toBeCalledTimes(1);
        expect(mockSend).toBeCalledWith({
            _params: {
                Item: {
                    Bcc: { S: 'e*****5@e******e.com,e*****6@e******e.com' },
                    Html: { S: '' },
                    Cc: { S: 'e*****3@e******e.com,e*****4@e******e.com' },
                    RecordType: { S: 'Email' },
                    Subject: { S: '' },
                    To: { S: 'e*****1@e******e.com,e*****2@e******e.com' },
                    UniqueId: { S: 'uniqueId' },
                    TemplateId: { S: 'templateId' },
                    Data: { S: '{"key":"value"}' },
                },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: 'SendEmailLambda',
            },
        });

        expect(mockDestroy).toBeCalledTimes(1);
    });

    it('should not record email if table not set', async () => {
        const tableName = process.env.DYNAMODB_TABLE_NAME;
        delete process.env.DYNAMODB_TABLE_NAME;
        try {
            await recordEmail(
                ['email1@example.com', 'email2@example.com'],
                ['email3@example.com', 'email4@example.com'],
                ['email5@example.com', 'email6@example.com'],
                'uniqueId',
                'subject',
                'html'
            );
            expect(mockSend).not.toBeCalled();
        } finally {
            process.env.DYNAMODB_TABLE_NAME = tableName;
        }
    });

    it('should record response', async () => {
        await recordEmailResponse('uniqueId', 'response');
        expect(mockSend).toBeCalledTimes(1);
        expect(mockSend).toBeCalledWith({
            _params: {
                ExpressionAttributeNames: { '#R': 'Response' },
                ExpressionAttributeValues: { ':r': { S: 'response' } },
                Key: { RecordType: { S: 'Email' }, UniqueId: { S: 'uniqueId' } },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: 'SendEmailLambda',
                UpdateExpression: 'SET #R = :r',
            },
        });

        expect(mockDestroy).toBeCalledTimes(1);
    });

    it('should not record response if table not set', async () => {
        const tableName = process.env.DYNAMODB_TABLE_NAME;
        delete process.env.DYNAMODB_TABLE_NAME;
        try {
            await recordEmailResponse('uniqueId', 'response');
            expect(mockSend).not.toBeCalled();
        } finally {
            process.env.DYNAMODB_TABLE_NAME = tableName;
        }
    });
});
