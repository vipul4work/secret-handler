import { isEmpty } from "lodash";
import fs from "fs";

export class SecretContant {
  private static defaultFile = "./secrets_mappings.json";
  private static configKeys = {};

  static config(filepath?: any) {
    const env: string = process.env.ENV || "local";
    if (isEmpty(SecretContant.configKeys)) {
      const rawData = JSON.parse(
        fs.readFileSync(filepath || SecretContant.defaultFile).toString("utf-8")
      );
      for (const key in rawData) {
        SecretContant.configKeys[key] = env == "local"
          ? key
          : rawData[key][env];
      }
    }
    return SecretContant.configKeys;
  }
}
