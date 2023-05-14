export interface Message {
    toAddresses?: string[];
    ccAddresses?: string[];
    bccAddresses?: string[];
    subject: string;
    html: string;
    uniqueId: string;
}

export interface RequestRecord {
    messageId: string;
    body: string;
}

export interface Request {
    Records: Array<RequestRecord>;
}
