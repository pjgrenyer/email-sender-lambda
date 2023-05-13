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

    it('should record email', async () => {
        await recordEmail(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'subject',
            'body',
            'uniqueId'
        );
        expect(mockSend).toBeCalledTimes(1);
        expect(mockSend).toBeCalledWith({
            _params: {
                Item: {
                    Bcc: { S: 'e*****5@e******e.com,e*****6@e******e.com' },
                    Body: { S: 'body' },
                    Cc: { S: 'e*****3@e******e.com,e*****4@e******e.com' },
                    RecordType: { S: 'Email' },
                    Subject: { S: 'subject' },
                    To: { S: 'e*****1@e******e.com,e*****2@e******e.com' },
                    UniqueId: { S: 'uniqueId' },
                },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: 'SendEmailLambda',
            },
        });

        expect(mockDestroy).toBeCalledTimes(1);
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
});
