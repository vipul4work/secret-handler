import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { config } from "dotenv";
import {SecretContant} from "./SecretConstants";
config();

export  class SecretsHandler {
  private static client = new SecretsManagerClient({
    region: "ap-south-1",
  });

  private static configs: any = SecretsHandler.refreshConfigKeysDefault();

  static secrets() {
    return SecretsHandler.configs;
  }

  private static async refreshConfigKeys() {
    for (const key in SecretContant.config()) {
      SecretsHandler.configs[key] = await SecretsHandler.fetchSecretValue(
        SecretContant.config()[key]
      );
    }
  }

  private static refreshConfigKeysDefault() {
    const config = {};
    for (const key in SecretContant.config()) {
      config[key] = JSON.parse(process.env[key] || "{}");
    }
    return config;
  }

  static async init(initializers = [], filepath = null) {
    SecretContant.initConfig(filepath);
    await SecretsHandler.refreshConfigKeys();
    for (const func of initializers) {
      await (func as any )();
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

  private static async fetchSecretValue(key: string) {
    const env: string = process.env.ENV || "dev";
    if (env == "dev") {
      return JSON.parse(process.env[key] || "{}");
    }
    return await SecretsHandler.fetchSecretFromAWS(key);
  }
}
