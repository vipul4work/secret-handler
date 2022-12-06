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
  "dbRead" : {
    "stage": "stage/db/read",
    "prod": "prod//db/read"
  },
  "dbWrite" : {
    "stage": "stage/db/write",
    "prod": "prod//db/write"
  },
}

//Examples
await SecretsHandler.init([setDbDataSource], "aws-secrets-mappings.json");
SecretsHandler.secrets().dbWrite.host
SecretsHandler.secrets().Read.host
```