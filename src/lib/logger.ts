import dotenv from 'dotenv';
dotenv.config();

import { Level, Logger, TransportFactory, transports, processors, ProcessorFactory } from 'tripitaka';
import { datadogProcessor, datadogTransport } from 'tripitaka-datadog';
const { context, timestamp, json, human } = processors;

const logLevel = Level.lookup(process.env.LOG_LEVEL?.toUpperCase() as string);

const buildProcessors = (): Array<ProcessorFactory> => {
    const ps: Array<ProcessorFactory> = [context(), timestamp()];

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production' && process.env.DATADOG_API_HOST) {
        ps.push(json());
    } else {
        ps.push(process.env.NODE_ENV === 'production' ? json() : human());
    }

    return ps;
};

const buildTransports = (): Array<TransportFactory> => {
    const ts: Array<TransportFactory> = [transports.stream({ threshold: logLevel })];

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production' && process.env.DATADOG_API_HOST) {
        ts.push(
            datadogTransport({
                apiKey: process.env.DATADOG_API_KEY as string,
                hostname: process.env.DATADOG_API_HOST as string,
                service: process.env.DATADOG_SERVICE as string,
                ddsource: process.env.DATADOG_SOURCE as string,
                ddtags: process.env.DATADOG_TAGS as string,
                intakeRegion: 'eu',
                threshold: Level.INFO,
            })
        );
    }

    return ts;
};

const logger = new Logger({
    level: logLevel,
    processors: buildProcessors(),
    transports: buildTransports(),
});

export default logger;
