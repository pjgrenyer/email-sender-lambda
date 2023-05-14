import { v4 } from 'uuid';
import { sendEmail } from './../../../src/lib/aws/send-email';
import dotenv from 'dotenv';
dotenv.config({ path: '.test.env' });

const { TO_EMAILS, CC_EMAILS, BCC_EMAILS, FROM_EMAIL } = process.env;

describe('AWS Send Email Integration Tests', () => {
    it('should send an email', async () => {
        await sendEmail(TO_EMAILS?.split(',') ?? [], CC_EMAILS?.split(',') ?? [], BCC_EMAILS?.split(',') ?? [], v4(), FROM_EMAIL, 'subject', '<h1>body</h1>', '111', [
            { key: 'user', value: { name: 'Charlotte', age: 41 } },
        ]);
    });
});
