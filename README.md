Usage
```js
// Load the module
// nodeJs
var { SecretsHandler } = require('env-secrets-handler');

// typescript
import { SecretsHandler } from "env-secrets-handler";

// init the secrets
await SecretsHandler.init(initFunctions, mapping_filepath);

// initFunctions = list of init functions to be reloaded after secrets are initialized
// mapping_filepath = mappings.json file
//sample mappings.json file => default filepath "secrets_mappings.json"
{
  "stage": {
    "dbRead": {
      "type": "secret",
      "key": "stage/db/read"
    },
    "logLevel": {
      "type": "parameter",
      "key": "LOG_LEVEL",
      "defaultValue": "all"
    }
  },
  "prod": {
    "dbRead": {
      "type": "secret",
      "key": "prod/db/read"
    },
    "logLevel": {
      "type": "parameter",
      "key": "LOG_LEVEL",
      "defaultValue": "all"
    }
  },
  "dev": {
    "dbRead": {
      "type": "parameter",
      "key": "dbRead",
      "isJSON": true,
      "defaultValue": {
        "host": "localhost",
        "port": "3306",
        "username": "dev",
        "password": "dev"
      }
    },
    "logLevel": {
      "type": "parameter",
      "key": "LOG_LEVEL",
      "defaultValue": "all"
    }
  }
}

//Examples
await SecretsHandler.init([setDbDataSource], "aws-secrets-mappings.json");
SecretsHandler.secrets().dbWrite.host
SecretsHandler.secrets().dbRead.host
SecretsHandler.get("dbRead")
```