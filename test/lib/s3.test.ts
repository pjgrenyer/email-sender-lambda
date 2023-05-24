import { getS3Object } from './../../src/lib/s3';

const mockSend = jest.fn();
const mockDestroy = jest.fn();

jest.mock('@aws-sdk/client-s3', () => {
    class mockGetObjectCommand {
        private _params: any;

        constructor(params: any) {
            this._params = params;
        }
    }

    class mockS3Client {
        private _region: string;

        constructor(params: any) {
            this._region = params.region;
        }
        public send = mockSend;
        public destroy = mockDestroy;
    }
    return {
        S3Client: mockS3Client,
        GetObjectCommand: mockGetObjectCommand,
    };
});

describe('S3', () => {
    it('should get object', async () => {
        (mockSend as any as jest.Mock).mockResolvedValue({
            Body: {
                transformToString: () => 'Body',
            },
        });

        const respose = await getS3Object('bucket', 'key');
        expect(respose).toEqual('Body');

        expect(mockSend).toBeCalledTimes(1);
        expect(mockSend).toBeCalledWith({ _params: { Bucket: 'bucket', Key: 'key' } });
        expect(mockDestroy).toBeCalledTimes(1);
    });
});
