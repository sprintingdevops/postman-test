class Config {
  public static get BASE_URL() {
    return process.env.BASE_URL;
  }

  public static get AUTH() {
    return process.env.AUTH;
  }

  public static get VERBOSE(): boolean {
    return Config.getBoolVal(process.env.VERBOSE_LOGGING, false);
  }

  public static get LOG_TO_FILES() {
    return Config.getBoolVal(process.env.LOG_TO_FILES, false);
  }

  public static get LOG_TO_CONSOLE() {
    return Config.getBoolVal(process.env.LOG_TO_CONSOLE, true);
  }

  public static get HIDDEN_FIELDS() {
    if (process.env.HIDDEN_FIELDS === undefined) {
      return [];
    }
    return process.env.HIDDEN_FIELDS.split(',');
  }

  private static getBoolVal(val: string | undefined, defaultVal: boolean) {
    if (val === undefined) return defaultVal;
    return ['true', '1'].includes(val.toLocaleLowerCase());
  }
}

export default Config;
