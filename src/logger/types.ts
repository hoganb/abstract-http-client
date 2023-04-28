import type { LogLevel } from './logLevels';

// Winston logger is actually a logger, and a NodeJS.ReadableStream
// https://github.com/winstonjs/winston#awaiting-logs-to-be-written-in-winston
export type Logger = {
  end(): void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  log: (
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>
  ) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  on(
    eventName: string | symbol,
    listener: (...args: unknown[]) => void
  ): Logger;
};
