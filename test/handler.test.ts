import { processMessage } from '../src/process-message';
import { handler } from './../src/index';
import { Request } from './../src/request';

jest.mock('../src/process-message');

describe('handler', () => {
    it('should not call processMessage if there are no messages', async () => {
        await handler({ Records: [] } as Request);
        expect(processMessage).not.toBeCalled();
    });
});
