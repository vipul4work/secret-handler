import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { config } from "dotenv";
import { isEmpty } from "lodash";
import { SecretContant } from "./SecretConstants";
config();

export class SecretsHandler {
  private static client = new SecretsManagerClient({
    region: "ap-south-1",
  });

  private static configs: any = SecretsHandler.refreshConfigKeysDefault();

  static secrets() {
    return SecretsHandler.configs;
  }

  static get(key: string) {
    return SecretsHandler.configs[key];
  }

  private static async refreshConfigKeys() {

    for (const key in SecretContant.config().env) {
      const keyConfig = SecretContant.config().env[key];
      SecretsHandler.configs[key] = SecretsHandler.getValueFromEnv(keyConfig);
    }

    for (const key in SecretContant.config().secrets) {
      SecretsHandler.configs[key] = await SecretsHandler.fetchSecretFromAWS(
        SecretContant.config().secrets[key]
      );
    }
  }

  private static refreshConfigKeysDefault() {
    let config = {};
    for (const key in SecretContant.config().env) {
      const keyConfig = SecretContant.config().env[key];
      config[key] = SecretsHandler.getValueFromEnv(keyConfig);
    }

    for (const key in SecretContant.config().secrets) {
      config[key] = JSON.parse(process.env[key] || "{}")
    }
    return config;
  }

  private static getValueFromEnv(keyConfig: any) {
    let value = (keyConfig.isJSON) ? JSON.parse(process.env[keyConfig.key] || "{}") : process.env[keyConfig.key] || "";
    if (isEmpty(value)) {
      value = keyConfig.defaultValue;
    }
    return value;
  }

  static async init(initializers = [], filepath = null) {
    SecretContant.initConfig(filepath);
    await SecretsHandler.refreshConfigKeys();
    for (const func of initializers) {
      await (func as any)();
    }
  }

  private static async fetchSecretFromAWS(secretId: string) {
    const response = await SecretsHandler.client.send(
      new GetSecretValueCommand({
        SecretId: secretId,
        VersionStage: "AWSCURRENT",
      })
    );
    return JSON.parse(response.SecretString || "{}");
  }
}
