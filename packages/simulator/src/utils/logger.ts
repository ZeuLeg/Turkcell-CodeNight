export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;

  public setLevel(level: LogLevel) {
    this.level = level;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  public debug(message: string, meta?: any) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message, meta));
    }
  }

  public info(message: string, meta?: any) {
    if (this.level <= LogLevel.INFO) {
      console.info(this.formatMessage('INFO', message, meta));
    }
  }

  public warn(message: string, meta?: any) {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message, meta));
    }
  }

  public error(message: string, meta?: any) {
    if (this.level <= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', message, meta));
    }
  }
}

export const logger = new Logger();
