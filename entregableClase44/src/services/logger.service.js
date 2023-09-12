import winston from 'winston';

export default class LoggerService {
    constructor(env) {
        this.options = {
            levels: {
                fatal: 0,
                error: 1,
                warning: 2,
                http: 3,
                info: 4,
                debug: 5,
            },
            colors: {
                fatal: 'red',
                error: 'yellow',
                warning: 'magenta',
                http: 'blue',
                info: 'white',
                debug: 'green',
            },
        };

        winston.addColors(this.options.colors);

        this.logger = this.createLogger(env);
    }

    createLogger = (env) => {
        const format = winston.format.combine(
            winston.format.colorize({ all: true }), // <-- Aquí se colorea todo el mensaje
            winston.format.simple()
        );

        switch (env) {
            case 'DEV':
                return winston.createLogger({
                    levels: this.options.levels,
                    format,
                    transports: [
                        new winston.transports.Console({
                            level: 'debug',
                        }),
                        new winston.transports.File({
                            level: 'warning',
                            filename: './errors.log',
                        }),
                    ],
                });
            case 'PROD':
                return winston.createLogger({
                    levels: this.options.levels,
                    format,
                    transports: [
                        new winston.transports.Console({ level: 'warning' }),
                        new winston.transports.File({
                            level: 'warning',
                            filename: './errors.log',
                        }),
                    ],
                });
        }
    };
}
