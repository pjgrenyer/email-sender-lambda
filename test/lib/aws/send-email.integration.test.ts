import sendEmail from './../../../src/lib/aws/send-email';

describe('AWS Send Email Integration Tests', () => {
    it('should send an email', async () => {
        await sendEmail(['paul.grenyer@gmail.com', 'paulgrenyer@hotmail.com', 'paul.grenyer@haven.com'], [], [], 'subject', 'body', 'paul.grenyer@gmail.com');
    });
});
