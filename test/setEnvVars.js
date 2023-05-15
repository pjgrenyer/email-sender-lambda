process.env.SMTP_FROM = 'from@example.com';
process.env.DYNAMODB_TABLE_NAME = 'SendEmailLambda';
process.env.TEMPLATE_BUCKET_NAME = 'email-sender-lambda';
process.env.TEMPLATE_BUCKET_PATH = 'templates';

jest.setTimeout(30000);
