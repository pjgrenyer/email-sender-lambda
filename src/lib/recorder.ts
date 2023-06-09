import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { maskEmailAddresses } from './email-mask';

const AWS_REGION = process.env.AWS_REGION as string;

export const recordEmail = async (to: string[], cc: string[], bcc: string[], uniqueId: string, subject?: string, html?: string, templateId?: string, data?: any) => {
    if (!process.env.DYNAMODB_TABLE_NAME) {
        return;
    }
    const client = new DynamoDBClient({ region: AWS_REGION });
    try {
        const params = {
            Item: {
                RecordType: {
                    S: 'Email',
                },
                UniqueId: {
                    S: uniqueId,
                },
                To: {
                    S: maskEmailAddresses(to)?.join(',') ?? '',
                },
                Cc: {
                    S: maskEmailAddresses(cc)?.join(',') ?? '',
                },
                Bcc: {
                    S: maskEmailAddresses(bcc)?.join(',') ?? '',
                },
                Subject: {
                    S: subject ?? '',
                },
                Html: {
                    S: html ?? '',
                },
                TemplateId: {
                    S: templateId ?? '',
                },
                Data: {
                    S: data ? JSON.stringify(data) : '',
                },
            },
            ReturnConsumedCapacity: 'TOTAL',
            TableName: process.env.DYNAMODB_TABLE_NAME,
        };

        const command = new PutItemCommand(params);
        return await client.send(command);
    } finally {
        client.destroy();
    }
};

export const recordEmailResponse = async (uniqueId: string, response: string) => {
    if (!process.env.DYNAMODB_TABLE_NAME) {
        return;
    }
    const client = new DynamoDBClient({ region: AWS_REGION });
    try {
        const params = {
            ExpressionAttributeNames: {
                '#R': 'Response',
            },
            ExpressionAttributeValues: {
                ':r': {
                    S: response,
                },
            },
            Key: {
                RecordType: {
                    S: 'Email',
                },
                UniqueId: {
                    S: uniqueId,
                },
            },
            ReturnConsumedCapacity: 'TOTAL',
            TableName: process.env.DYNAMODB_TABLE_NAME,
            UpdateExpression: 'SET #R = :r',
        };

        const command = new UpdateItemCommand(params);
        return await client.send(command);
    } finally {
        client.destroy();
    }
};
