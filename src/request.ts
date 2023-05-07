export interface RequestRecord {
    messageId: string;
    body: string;
}

export interface Request {
    Records: Array<RequestRecord>;
}
