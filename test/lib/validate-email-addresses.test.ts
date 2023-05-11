import { validateEmailAddresses } from './../../src/lib/validate-email-addresses';

describe('validate email addresses', () => {
    it('should not throw if all emails are valid', () => {
        expect(() => validateEmailAddresses(['to@example.co.uk'], ['cc@example.co.uk'], ['bcc@example.com'])).not.toThrowError();
    });

    it('should throw an error if no valid email addresses are found', () => {
        expect(() => validateEmailAddresses(['invalid'], [], [])).toThrowError('One or more emails are invalid: invalid');
    });

    it('should throw an error even if only one email is invalid', () => {
        expect(() => validateEmailAddresses(['to@example.co.uk'], ['invalid email'], [])).toThrowError('One or more emails are invalid: invalid email');
    });

    it('should throw an error if email contains invalid character', () => {
        expect(() => validateEmailAddresses(['haven’t@example.co.uk'], [], [])).toThrowError('One or more emails are invalid: haven’*@e******e.co.uk');
    });

    it('should throw an error even if only one email is invalid', () => {
        expect(() => validateEmailAddresses(['to@example.co.uk'], ['invalid email'], [])).toThrowError('One or more emails are invalid: invalid email');
    });

    it('should throw an error if email contains invalid character', () => {
        expect(() => validateEmailAddresses(['haven’t@example.co.uk'], [], [])).toThrowError('One or more emails are invalid: haven’*@e******e.co.uk');
    });
});
