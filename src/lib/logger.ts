import dotenv from 'dotenv';
dotenv.config();

import { Level, Logger, TransportFactory, transports, processors, ProcessorFactory } from 'tripitaka';
import { datadogProcessor, datadogTransport } from 'tripitaka-datadog';
const { context, timestamp, json, human } = processors;

const logLevel = Level.lookup(process.env.LOG_LEVEL?.toUpperCase() as string);

const buildProcessors = (): Array<ProcessorFactory> => {
    const ps: Array<ProcessorFactory> = [context(), timestamp()];

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production' && process.env.DD_HOSTNAME) {
        ps.push(datadogProcessor());
    } else {
        ps.push(process.env.NODE_ENV === 'production' ? json() : human());
    }

    return ps;
};

const buildTransports = (): Array<TransportFactory> => {
    const ts: Array<TransportFactory> = [transports.stream({ threshold: logLevel })];

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production' && process.env.DD_HOSTNAME) {
        ts.push(
            datadogTransport({
                apiKey: process.env.DD_API_KEY as string,
                hostname: process.env.DD_HOSTNAME as string,
                service: process.env.DD_SERVICE as string,
                ddsource: process.env.DD_SOURCE as string,
                ddtags: process.env.DD_HOSTNAME as string,
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
