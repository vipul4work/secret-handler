import { isEmpty } from "lodash";
import { config } from "dotenv";
import * as fs from "fs";
config()
export class SecretContant {
  private static defaultFile = "./secrets_mappings.json";
  private static configKeys = { secrets: {}, env: {} };

  static config(filepath?: any) {
    SecretContant.initConfig(filepath);
    return SecretContant.configKeys;
  }

  static initConfig(filepath?: any) {
    filepath = filepath || SecretContant.defaultFile;
    const env: string = process.env.ENV || "dev";
    if (isEmpty(SecretContant.configKeys.env) && isEmpty(SecretContant.configKeys.secrets)) {
      const rawData = fs.existsSync(filepath) ? JSON.parse(
        fs.readFileSync(filepath || SecretContant.defaultFile).toString("utf-8")
      ) : {};

      for (let key in rawData[env]) {
        const keyConfig = rawData[env][key];
        if (keyConfig.type == "secret") {
          SecretContant.configKeys.secrets[key] = keyConfig.key; 
        } else if (keyConfig.type == "parameter") {
          SecretContant.configKeys.env[key] = keyConfig;
        }
      }
    }
  }
}
