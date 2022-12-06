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
    // all secrets are json formatted
    "secrets": {
      "dbRead": "stage/db/read",
    },
    "env": {}
  },
  "prod": {
    "secrets": {
      "dbRead": "prod/db/read",
    },
    "env": {}
  },
  "dev": {
    "secrets": {},
    // value is type of key
    // if json it will do json.parse else it will return as string
    "env": {
      "dbRead": "json",
      "dbWrite": "json",
      "redis": "json"
    }
  },
  "default_env": {
    "PORT": "string",
    "BULL_SEERVER_PORT": "string",
    "LOG_LEVEL": "string",
    "ENV": "string"
  }
}

//Examples
await SecretsHandler.init([setDbDataSource], "aws-secrets-mappings.json");
SecretsHandler.secrets().dbWrite.host
SecretsHandler.secrets().Read.host
```