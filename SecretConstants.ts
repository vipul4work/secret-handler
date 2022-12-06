import { isEmpty } from "lodash";
import * as fs from "fs";

export class SecretContant {
  private static defaultFile = "./secrets_mappings.json";
  private static configKeys = {};

  static config(filepath?: any) {
    SecretContant.initConfig(filepath);
    return SecretContant.configKeys;
  }

  static initConfig(filepath?: any) {
    filepath = filepath || SecretContant.defaultFile;
    const env: string = process.env.ENV || "dev";
    if (isEmpty(SecretContant.configKeys)) {
      const rawData = fs.existsSync(filepath) ? JSON.parse(
        fs.readFileSync(filepath || SecretContant.defaultFile).toString("utf-8")
      ) : {};
      for (const key in rawData) {
        SecretContant.configKeys[key] = (env == "dev")
          ? key
          : rawData[key][env];
      }
    }
  }
}
