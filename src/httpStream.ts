import {LogflareHttpClient, LogflareUserOptionsI} from "logflare-transport-core"
import PinoLogflareOptionsI from "./localOptions"
import * as streams from "./streams"

const pumpify = require("pumpify")

interface Options extends LogflareUserOptionsI {
  size?: number;
}

function createWriteStream(options: Options, localOptions?: PinoLogflareOptionsI) {
  const {size = 1} = options

  const parseJsonStream = streams.parseJsonStream()
  const toLogEntryStream = streams.toLogEntryStream(localOptions)
  const batchStream = streams.batchStream(size)
  const writeStream = new LogflareHttpClient(options).insertStream()

  return pumpify(
    parseJsonStream,
    toLogEntryStream,
    batchStream,
    writeStream
  )
}

export default createWriteStream
