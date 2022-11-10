const winston = require('winston');
const morgan = require('morgan');
const os = require('os');
const DailyRotateFile = require('winston-daily-rotate-file');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const dailyRotateOpts = {
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
};

const esTransportOpts = {
    level: 'silly',
    clientOpts: {
        node: 'http://localhost:9200',
        auth:{
            username:"elastic",
            password:"exkRkmMfk+R7Xky80PP4"
        }
    }
};

const logger = winston.createLogger({
    level: 'silly',
    // format: winston.format.json(),
    // defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
        
        // daily roatation
        new DailyRotateFile(dailyRotateOpts),

        // ship logs to elasticsearch
        new ElasticsearchTransport(esTransportOpts),
    ],
});

const httpEsTransportOpts = {
    ...esTransportOpts,
    indexPrefix: "http-logs"
};

const httpLogger = winston.createLogger({
    level: 'silly',
    // format: winston.format.json(),
    // defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
        
        // daily roatation
        new DailyRotateFile(dailyRotateOpts),

        // ship logs to elasticsearch
        new ElasticsearchTransport(httpEsTransportOpts),
    ],
});

// morgan - custom tokens
morgan.token('hostname', os.hostname);
morgan.token('pid', () => process.pid);
morgan.token('auth-user', (req) => req?.user ?? {});

const jsonFormatter = (tokens, req, res) => {
    return JSON.stringify({
        'remoteAddress': tokens['remote-addr'](req, res),
        'time': tokens['date'](req, res, 'iso'),
        'method': tokens['method'](req, res),
        'url': tokens['url'](req, res),
        'httpVersion': tokens['http-version'](req, res),
        'statusCode': tokens['status'](req, res),
        'contentLength': tokens['res'](req, res, 'content-length'),
        'referrer': tokens['referrer'](req, res),
        'userAgent': tokens['user-agent'](req, res),
        'hostname': tokens['hostname'](req, res),
        'pid': tokens['pid'](req, res),
        "user": tokens['auth-user'](req, res)
    });
};

// exports
module.exports = logger;
module.exports.jsonStream = {
    write: function(message, encoding) {
        httpLogger.http("HTTP Log", JSON.parse(message));
    }
};
module.exports.morganFormat = {
    json: jsonFormatter
}
