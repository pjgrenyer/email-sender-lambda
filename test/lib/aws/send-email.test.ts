import sendEmail from './../../../src/lib/aws/send-email';
import nodemailer from 'nodemailer';
const aws = require('@aws-sdk/client-ses');
jest.mock('@aws-sdk/client-ses', () => {
    class SES {}

    return {
        SES,
    };
});

const mockSendEmail = jest.fn();

jest.mock('nodemailer', () => {
    return {
        createTransport: (transporter: any) => {
            return { sendEmail: async () => mockSendEmail };
        },
    };
});

console.log(nodemailer.createTransport());

describe('Send email', () => {
    it('should populate all fields', async () => {
        await sendEmail([], [], [], '', '', '');
    });
});
