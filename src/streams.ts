import {filterMetadata, toLogEntry} from "./utils"
import batch2 from "batch2"
import split2 from "split2"
import through2 from "through2"
import fastJsonParse from "fast-json-parse"
import PinoLogflareOptionsI from "./localOptions"

function batchStream(size: number) {
  return batch2.obj({size})
}

function parseJsonStream() {
  return split2((str: string) => {
    const result = fastJsonParse(str)
    if (result.err) return
    return result.value
  })
}

function toLogEntryStream(localOptions?: PinoLogflareOptionsI) {
  return through2.obj((chunk, enc, cb) => {
    let entry = toLogEntry(chunk)
    filterMetadata(entry, localOptions)
    cb(null, entry)
  })
}

export {
  batchStream,
  parseJsonStream,
  toLogEntryStream,
}
