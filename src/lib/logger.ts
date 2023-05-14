import dotenv from 'dotenv';
dotenv.config();

import { Level, Logger, TransportFactory, transports, processors, ProcessorFactory } from 'tripitaka';
import { datadogProcessor, datadogTransport } from 'tripitaka-datadog';
import { sumoLogicTransport } from 'tripitaka-sumologic';
import { sumoLogicProcessor } from 'tripitaka-sumologic';
import { v4 } from 'uuid';
const { context, timestamp, json, human } = processors;

const logLevel = Level.lookup(process.env.LOG_LEVEL?.toUpperCase() as string);

// eslint-disable-next-line no-console
const onError = (error: any) => console.log(`Sumo Error! ${error}`);

const buildProcessors = (): Array<ProcessorFactory> => {
    const ps: Array<ProcessorFactory> = [context(), timestamp()];

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production' && process.env.DATADOG_API_KEY) {
        ps.push(datadogProcessor());
    } else if (process.env.NODE_ENV === 'production' && process.env.SUMO_ENDPOINT) {
        ps.push(sumoLogicProcessor());
    } else {
        ps.push(process.env.NODE_ENV === 'production' ? json() : human());
    }

    return ps;
};

const buildTransports = (): Array<TransportFactory> => {
    const ts: Array<TransportFactory> = [transports.stream({ threshold: logLevel })];

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production' && process.env.DATADOG_API_KEY) {
        ts.push(
            datadogTransport({
                apiKey: process.env.DATADOG_API_KEY as string,
                hostname: process.env.DATADOG_API_HOST as string,
                service: process.env.DATADOG_SERVICE as string,
                ddsource: process.env.DATADOG_SOURCE as string,
                ddtags: process.env.DATADOG_TAGS as string,
                intakeRegion: 'eu',
                threshold: logLevel,
            })
        );
        /* istanbul ignore next */
    } else if (process.env.NODE_ENV === 'production' && process.env.SUMO_ENDPOINT) {
        ts.push(
            sumoLogicTransport(
                {
                    endpoint: process.env.SUMO_ENDPOINT,
                    sourceName: process.env.SUMO_SERVICE_NAME,
                    clientUrl: process.env.SUMO_CLIENT_URL,
                    hostName: process.env.SUMO_HOST_NAME,
                    sourceCategory: process.env.SUMO_SOURCE_CATEGORY,
                    sessionKey: v4(),
                    onError,
                },
                { threshold: logLevel }
            )
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
