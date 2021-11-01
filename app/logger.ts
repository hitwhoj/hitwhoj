import chalk from "chalk";

export interface ILogger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

function createLogger(name: string): ILogger {
  function format(type: string, message: string) {
    return `${chalk.gray(
      new Date().toISOString()
    )} [${type}/${name}] ${message}`;
  }

  let log_level = 3;
  if (process.argv.indexOf("--error") > -1) log_level = 1;
  if (process.argv.indexOf("--warn") > -1) log_level = 2;
  if (process.argv.indexOf("--info") > -1) log_level = 3;
  if (process.argv.indexOf("--debug") > -1) log_level = 4;

  return {
    debug(message: string) {
      if (log_level >= 4) {
        console.debug(format(chalk.white("debug"), message));
      }
    },

    info(message: string) {
      if (log_level >= 3) {
        console.info(format(chalk.blue("info"), message));
      }
    },

    warn(message: string) {
      if (log_level >= 2) {
        console.warn(format(chalk.yellow("warn"), message));
      }
    },

    error(message: string) {
      if (log_level >= 1) {
        console.error(format(chalk.red("error"), message));
      }
    },
  };
}

export default createLogger;
