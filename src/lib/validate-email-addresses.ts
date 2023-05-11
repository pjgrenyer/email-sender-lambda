import Joi from 'joi';

export const validateEmailAddresses = (toAddresses: string[], ccAddresses: string[], bccAddresses: string[]) => {
    const allEmails = [...toAddresses, ...ccAddresses, ...bccAddresses];

    allEmails.forEach((email) => {
        if (!isValidEmail(email)) throw Error('One or more emails are invalid.');
    });
};

const isValidEmail = (email: string) => {
    const emailSchema = Joi.string().email({ allowUnicode: false });
    const { error } = emailSchema.validate(email);
    if (error) {
        return false;
    }

    return !containsInvalidEmailChar(email);
};

const emailRegex = /^[0-9a-zA-Z@.!#$%&'*+/=?^_`{|}~-]+$/;
const containsInvalidEmailChar = (email: string) => !emailRegex.test(email);
