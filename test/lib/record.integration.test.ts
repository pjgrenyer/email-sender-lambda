import { recordEmail, recordEmailResponse } from './../../src/lib/recorder';

describe('Record integration tests', () => {
    it('should create record', async () => {
        const result = await recordEmail(
            ['email1@example.com', 'email2@example.com'],
            ['email3@example.com', 'email4@example.com'],
            ['email5@example.com', 'email6@example.com'],
            'subject',
            'body',
            'uniqueId'
        );
        expect(result).not.toBeUndefined();
    });

    it.only('should update record with response', async () => {
        const result = await recordEmailResponse('uniqueId', 'Response');
        expect(result).not.toBeUndefined();
    });
});
