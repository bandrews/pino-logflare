import { filterMetadata, toLogEntry } from "./utils"
import _ from "lodash"
import stream from "stream"
import fastJsonParse from "fast-json-parse"
import { LogflareUserOptionsI } from "logflare-transport-core"
import PinoLogflareOptionsI from "./localOptions"

const createConsoleWriteStream = (options: LogflareUserOptionsI, localOptions?: PinoLogflareOptionsI) => {
  const writeStream = new stream.Writable({
    objectMode: true,
    highWaterMark: 1,
  })

  writeStream._write = (chunk, encoding, callback) => {
    const batch = Array.isArray(chunk) ? chunk : [chunk]
    _(batch)
      .map(JSON.parse)
      .map(toLogEntry)
      .map((entry: any) => filterMetadata(entry, localOptions))
      .map(JSON.stringify)
      .forEach((x) => {
        process.stdout.write(x + '\n')
      })

    callback()
  }
  return writeStream
}

export default createConsoleWriteStream
