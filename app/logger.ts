import chalk from "chalk";

function createLogger(name: string) {
  function format(type: string, message: string) {
    return `${chalk.gray(
      new Date().toISOString()
    )} [${type}/${name}] ${message}`;
  }

  return {
    log(message: string) {
      console.log(format(chalk.white("log"), message));
    },

    info(message: string) {
      console.log(format(chalk.blue("info"), message));
    },

    warn(message: string) {
      console.warn(format(chalk.yellow("warn"), message));
    },

    error(message: string) {
      console.error(format(chalk.red("error"), message));
    },
  };
}

export default createLogger;
