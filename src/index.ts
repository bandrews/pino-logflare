import createHttpWriteStream from "./httpStream"
import createConsoleWriteStream from "./consoleStream"
import { pinoBrowserLogEventI, formatPinoBrowserLogEvent, filterMetadata } from "./utils"
import { LogflareHttpClient, LogflareUserOptionsI } from "logflare-transport-core"
import PinoLogflareOptionsI from "./localOptions"

const isBrowser = typeof window !== 'undefined'
  && typeof window.document !== 'undefined'

const isNode = typeof process !== 'undefined'
  && process.versions != null
  && process.versions.node != null

const createPinoBrowserSend = (options: LogflareUserOptionsI, localOptions?: PinoLogflareOptionsI) => {
  const client = new LogflareHttpClient({ ...options, fromBrowser: true })

  return (level: number, logEvent: pinoBrowserLogEventI) => {
    let logflareLogEvent = formatPinoBrowserLogEvent(logEvent)
    filterMetadata(logflareLogEvent, localOptions);
    client.postLogEvents([logflareLogEvent])
  }
}

const logflarePinoVercel = (options: LogflareUserOptionsI, localOptions?: PinoLogflareOptionsI) => {
  return {
    stream: createConsoleWriteStream(options, localOptions),
    send: createPinoBrowserSend(options),
  }
}

const createWriteStream = createHttpWriteStream

export { createWriteStream, logflarePinoVercel, createPinoBrowserSend, createConsoleWriteStream, createHttpWriteStream }
