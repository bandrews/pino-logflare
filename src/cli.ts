#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')
const pinoLogflare = require('./index')

const alwaysIncludedFields = ['context', 'options', 'level']

// main cli logic
function main() {
  program
    .version(pkg.version)
    .option('-k, --key <key>', 'Logflare API Key')
    .option('-s, --source <source>', 'Default source for the logs')
    .option('-u, --url <url>', 'Logflare API URL (optional)')
    .option('-i, --include [fields...]', 'Include only specific fields in the metadata submitted to the service.  All other fields will be aggregated in a raw-string JSON blob.')
    .option('-c, --contextname <name>', 'Chooses the name of the field used for overflow metadata in the --include option.', 'data')
    .action(async (options: Record<string, any>) => {
      try {
        const config = {
          apiKey: options.key || process.env.LOGFLARE_API_KEY,
          sourceToken: options.source || process.env.LOGFLARE_SOURCE_TOKEN,
          apiBaseUrl: options.url || process.env.LOGFLARE_URL,
        }

        const localConfig = {
          useIncludeFeature: options.include !== undefined,
          includeFields: Array.isArray(options.include) ? [...alwaysIncludedFields, ...options.include] : alwaysIncludedFields,
          extraMetadataFieldName: options.contextname
        }
        
        const writeStream = pinoLogflare.createWriteStream(config, localConfig)
        process.stdin.pipe(writeStream)
        process.stdin.pipe(process.stdout)
      } catch (error) {
        console.error(error.message ?? error)
      }
    })

  program.parse(process.argv)
}

main()
