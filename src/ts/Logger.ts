import {LogLevel} from '@/types'

enum Level {
  debug = 'debug',
}

export default class Logger {
  public static logLevel: LogLevel | null = null

  public static debug (...logs: any) {
    if (process.env.NODE_ENV === 'development' || Logger.logLevel === Level.debug) {
      logs.forEach((log: any) => {
        window.console.dir(log)
      })
    }
  }

  public static warn (...logs: any) {
    logs.forEach((log: any) => {
      window.console.warn(log)
    })
  }

  public static error (...logs: any) {
    logs.forEach((log: any) => {
      window.console.error(log)
    })
  }
}
