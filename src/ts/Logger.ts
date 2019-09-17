import {LogLevel} from '@/types';

enum Level {
  debug = 'debug',
  warn = 'warn',
  error = 'error',
}

export interface Option {
  level: Level;
}

export default class Logger {
  public static logLevel: LogLevel | null = null;

  public static debug(...logs: any) {
    Logger.log(logs, {
      level: Level.debug,
    });
  }

  public static warn(...logs: any) {
    Logger.log(logs, {
      level: Level.warn,
    });
  }

  public static error(...logs: any) {
    Logger.log(logs, {
      level: Level.error,
    });
  }

  private static log(logs: any[], option: Option) {
    logs.forEach((log: any) => {
      switch (option.level) {
        case Level.debug:
          if (process.env.NODE_ENV === 'development' || Logger.logLevel === Level.debug) {
            window.console.dir(log);
          }
          break;
        case Level.warn:
          window.console.warn(log);
          break;
        case Level.error:
          window.console.error(log);
          break;
      }
    });
  }
}
