interface Option {
  level: string;
}

export default class Logger {
  public static info(...logs: any) {
    Logger.log(logs, {
      level: 'info',
    });
  }

  public static debug(...logs: any) {
    Logger.log(logs, {
      level: 'debug',
    });
  }

  public static warn(...logs: any) {
    Logger.log(logs, {
      level: 'warn',
    });
  }

  public static error(...logs: any) {
    Logger.log(logs, {
      level: 'error',
    });
  }

  private static log(logs: any[], option: Option) {
    if ('development' === process.env.NODE_ENV) {
      logs.forEach((log: any) => {
        switch (option.level) {
          case 'info':
          case 'debug':
            window.console.dir(log);
            break;
          case 'warn':
            window.console.warn(log);
            break;
          case 'error':
            window.console.error(log);
            break;
        }
      });
    }
  }
}
