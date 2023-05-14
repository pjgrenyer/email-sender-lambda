export interface Data {
    key: string;
    value: any;
    lookupId?: string;
}

export interface Message {
    toAddresses?: string[];
    ccAddresses?: string[];
    bccAddresses?: string[];
    subject?: string;
    html?: string;
    templateId?: string;
    data?: Data[];
    uniqueId: string;
}

export interface RequestRecord {
    messageId: string;
    body: string;
}

export interface Request {
    Records: Array<RequestRecord>;
}
