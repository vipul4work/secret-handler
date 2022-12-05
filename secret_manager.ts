import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { config } from "dotenv";
import {SecretContant} from "./SecretConstants";
config();

export  class SecretManager {
  private static client = new SecretsManagerClient({
    region: "ap-south-1",
  });

  private static configs: any = SecretManager.refreshConfigKeysDefault();

  static config() {
    return SecretManager.configs;
  }

  private static async refreshConfigKeys() {
    for (const key in SecretContant.config()) {
      SecretManager.configs[key] = await SecretManager.fetchSecretValue(
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

  static async init(initializers = []) {
    await SecretManager.refreshConfigKeys();
    for (const func of initializers) {
      await (func as any )();
    }
  }

  private static async fetchSecretFromAWS(secretId: string) {
    const response = await SecretManager.client.send(
      new GetSecretValueCommand({
        SecretId: secretId,
        VersionStage: "AWSCURRENT",
      })
    );
    return JSON.parse(response.SecretString || "{}");
  }

  private static async fetchSecretValue(key: string) {
    const env: string = process.env.ENV || "local";
    if (env == "local") {
      return JSON.parse(process.env[key] || "{}");
    }
    return await SecretManager.fetchSecretFromAWS(key);
  }
}
