import formatISO from 'date-fns/formatISO';
import winston from 'winston';

export const logTransports = (): winston.transport[] => [
  transports.console(),
  transports.file(),
];

const isoFormat: { format: 'basic' } = { format: 'basic' };
const transports = {
  console: () =>
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  file: () =>
    new winston.transports.File({
      filename: `${formatISO(Date.now(), isoFormat)}.log`,
      dirname: 'logs',
      format: winston.format.json(),
    }),
};
