# CLI

To use `pino-logflare` from the command line, you need to install it globally:

```bash
$ npm install -g pino-logflare
```

Alternatively, if you install it locally you can safely use it within `package.json` scripts.

## Example

Given an application `index.js` that logs via pino, you would use `pino-logflare` like so:

index.js
```javascript
const logger = require("pino")();

logger.info("hello world");

const child = logger.child({ property: "value" });
child.info("hello child!");
```


```bash
$ node index.js | pino-logflare --key YOUR_KEY --source YOUR_SOURCE_ID
```

Note that the key and source parameters can be omitted if the LOGFLARE_API_KEY and LOGFLARE_SOURCE_TOKEN environment variables are set.

## Usage

You can pass the following options via cli arguments or use the environment variable associated:

| Short command | Full command              | Environment variable | Description                                                          |
| ------------- | ------------------------- | -------------------- | -------------------------------------------------------------------- |
| -V            | --version                 |                      | Output the version number                                            |
| -k            | --key &lt;apikey&gt;      | LOGFLARE_API_KEY     | The API key that can be found in your Logflare account               |
| -s            | --source &lt;source&gt;   | LOGFLARE_SOURCE_TOKEN| Default source for the logs                                          |
| -i            | --include &lt;fields&gt;  |                      | Enables a reshaping feature for the metadata uploaded to Logflare.  Fields listed on the command line (separated by a space) will be included as normal, and any fields not listed will be placed in a stringified JSON blob in another overflow field (named 'data' by default).  This feature can be helpful if you are upgrading an existing application that logs many objects with inconsistent field names to Pino (or objects with identifier names that are invalid in Google Cloud Bigtable storage.)|
| -c            | --contextname &lt;name&gt;|                      | Sets the name of the field used by the --include option.  If contextname is not specified, the default is "data". |
| -h            | --help                    |                      | Output usage information                                             |

See the [API](./API.md) documentation for details.
