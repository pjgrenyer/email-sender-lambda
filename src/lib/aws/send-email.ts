import nodemailer from 'nodemailer';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const aws = require('@aws-sdk/client-ses');

import logger from './../../lib/logger';
import { maskEmailAddresses } from '../email-mask';

const SMTP_FROM = process.env.SMTP_FROM as string;
const AWS_REGION = process.env.AWS_REGION as string;

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: AWS_REGION,
    defaultProvider,
});

const transporter = nodemailer.createTransport({
    SES: { ses, aws },
});

const sendEmail = async (to: string[], cc: string[], bcc: string[], subject: string, body: string, uniqueId: string, from?: string): Promise<string> => {
    const message = {
        from: from ?? SMTP_FROM,
        to: to.join(','),
        cc: cc.join(','),
        bcc: bcc.join(','),
        subject: subject,
        html: body,
        uniqueId,
    };
    logger.info(`Sending email: ${uniqueId}`, {
        ...message,
        to: maskEmailAddresses(message.to.split(','))?.join(','),
        cc: maskEmailAddresses(message.cc.split(','))?.join(','),
        bcc: maskEmailAddresses(message.bcc.split(','))?.join(','),
        from: maskEmailAddresses(message.from.split(','))?.join(','),
    });
    const response = await transporter.sendMail(message);
    return response?.response;
};

export default sendEmail;
