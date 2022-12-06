import { isEmpty } from "lodash";
import * as fs from "fs";

export class SecretContant {
  private static defaultFile = "./secrets_mappings.json";
  private static configKeys = { secrets: {}, env: {} };

  static config(filepath?: any) {
    SecretContant.initConfig(filepath);
    return SecretContant.configKeys;
  }

  static initConfig(filepath?: any) {
    filepath = filepath || SecretContant.defaultFile;
    const env: string = process.env.ENV || "stage";
    if (isEmpty(SecretContant.configKeys.env) && isEmpty(SecretContant.configKeys.secrets)) {
      const rawData = fs.existsSync(filepath) ? JSON.parse(
        fs.readFileSync(filepath || SecretContant.defaultFile).toString("utf-8")
      ) : {};

      SecretContant.configKeys.secrets = rawData[env].secrets;
      SecretContant.configKeys.env = { ...rawData.default_env, ...rawData[env].env }
    }
  }
}