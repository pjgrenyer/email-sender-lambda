import dotenv from 'dotenv';
dotenv.config();

import { Level, Logger, TransportFactory, transports, processors } from 'tripitaka';
const { context, timestamp, json, human } = processors;

const logLevel = Level.lookup(process.env.LOG_LEVEL?.toUpperCase() as string);

const buildTransports = (): Array<TransportFactory> => {
    const ts: Array<TransportFactory> = [transports.stream({ threshold: logLevel })];
    return ts;
};

const logger = new Logger({
    level: logLevel,
    processors: [context(), timestamp(), process.env.NODE_ENV === 'production' ? json() : human()],
    transports: buildTransports(),
});

export default logger;
