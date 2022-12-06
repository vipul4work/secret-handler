import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { config } from "dotenv";
import { SecretContant } from "./SecretConstants";
config();

export class SecretsHandler {
  private static client = new SecretsManagerClient({
    region: "ap-south-1",
  });

  private static configs: any = {};

  static secrets() {
    return SecretsHandler.configs;
  }

  private static async refreshConfigKeys() {

    for (const key in SecretContant.config().env) {
      const value = (SecretContant.config().env[key] == "json") ? JSON.parse(process.env[key]) : process.env[key] || "";
      SecretsHandler.configs[key] = value;
    }

    for (const key in SecretContant.config().secrets) {
      SecretsHandler.configs[key] = await SecretsHandler.fetchSecretFromAWS(
        SecretContant.config().secrets[key]
      );
    }
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