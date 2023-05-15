import nodemailer from 'nodemailer';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const aws = require('@aws-sdk/client-ses');

import logger from './../../lib/logger';
import { maskEmailAddresses } from '../email-mask';
import { render, Data as EjsData } from 'ejs';
import { Data } from '../../request';

import { getObject } from '../s3';

const SMTP_FROM = process.env.SMTP_FROM as string;
const AWS_REGION = process.env.AWS_REGION as string;
const TEMPLATE_BUCKET_NAME = process.env.TEMPLATE_BUCKET_NAME as string;
const TEMPLATE_BUCKET_PATH = process.env.TEMPLATE_BUCKET_PATH as string;

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: AWS_REGION,
    defaultProvider,
});

const transporter = nodemailer.createTransport({
    SES: { ses, aws },
});

export const sendEmail = async (
    to: string[],
    cc: string[],
    bcc: string[],
    uniqueId: string,
    from?: string,
    subject?: string,
    body?: string,
    templateId?: string,
    data?: Data[]
): Promise<string> => {
    const message = {
        from: from ?? SMTP_FROM,
        to: to.join(','),
        cc: cc.join(','),
        bcc: bcc.join(','),
        subject: subject,
        html: !templateId ? body : await buildTemplate(templateId, data),
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

const buildTemplate = async (templateId: string, data?: Data[]): Promise<string> => {
    const template = await getTemplate(templateId);
    const context = data?.reduce((ctx, item) => ({ ...ctx, [item.key]: item.value }), {} as EjsData);
    return render(template, context);
};

const getTemplate = async (templateId: string): Promise<string> => {
    const template = await getObject(TEMPLATE_BUCKET_NAME, `${TEMPLATE_BUCKET_PATH}/${templateId}`);
    if (!template) {
        throw new Error(`Unable to get template for ID ${templateId} from ${TEMPLATE_BUCKET_NAME}/${TEMPLATE_BUCKET_PATH}.`);
    }
    return template;
};
