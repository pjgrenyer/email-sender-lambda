import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const AWS_REGION = process.env.AWS_REGION as string;

export const getS3Object = async (bucket: string, key: string): Promise<string | undefined> => {
    const client = new S3Client({ region: AWS_REGION });
    try {
        const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
        const response = await client.send(getObjectCommand);
        return await response.Body?.transformToString('utf-8');
    } finally {
        client.destroy();
    }
};
