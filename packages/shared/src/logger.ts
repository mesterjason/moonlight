type LogLevel = 'INFO' | 'WARNING' | 'ERROR';

const LOG_LEVELS: Record<LogLevel, number> = {
  INFO: 0,
  WARNING: 1,
  ERROR: 2,
};

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'INFO';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('INFO')) {
      console.log(formatMessage('INFO', message, meta));
    }
  },

  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('WARNING')) {
      console.warn(formatMessage('WARNING', message, meta));
    }
  },

  error(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('ERROR')) {
      console.error(formatMessage('ERROR', message, meta));
    }
  },
};
