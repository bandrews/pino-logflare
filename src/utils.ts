import _ from "lodash"
import {isObject, isString} from "lodash"
import PinoLogflareOptionsI from "./localOptions"

function levelToStatus(level: number) {
  if (level === 10 || level === 20) {
    return "debug"
  }
  if (level === 40) {
    return "warning"
  }
  if (level === 50) {
    return "error"
  }
  if (level >= 60) {
    return "critical"
  }
  return "info"
}

interface pinoBrowserLogEventI {
  ts: number,
  messages: string[],
  bindings: object[],
  level: {value: number, label: string}
}

const formatPinoBrowserLogEvent = (logEvent: pinoBrowserLogEventI) => {
  const {ts, messages, bindings, level: {value: levelValue}} = logEvent
  const level = levelToStatus(levelValue)
  const timestamp = ts
  const objMessages = _.filter(messages, isObject)
  const strMessages = _.filter(messages, isString)
  const logEntry = strMessages.join(" ")
  const defaultMetadata = {
    url: window.document.URL,
    level: level,
    browser: true
  }
  const bindingsAndMessages = bindings.concat(objMessages)
  const metadata = _.reduce(bindingsAndMessages, (acc, el) => {
    return Object.assign(acc, el)
  }, defaultMetadata)

  return {
    metadata,
    log_entry: logEntry,
    timestamp,
  }
}

function toLogEntry(item: Record<string, any>) {
  const status = levelToStatus(item.level)
  const message = item.msg || status
  const host = item.hostname
  const service = item.service
  const pid = item.pid
  const stack = item.stack
  const type = item.type
  const timestamp = item.time || new Date().getTime()

  const cleanedItem = _.omit(item, ["time", "level", "msg", "hostname", "service", "pid", "stack", "type"])
  const context = _.pickBy({host, service, pid, stack, type}, x => x)
  return {
    metadata: {
      ...cleanedItem,
      context,
      level: status,
    },
    message,
    timestamp,
  }
}

// This function mutates the log entry in place to implement the -i option that
// filters metadata out before sending it to Logflare.
// It also returns a copy of 'item' to allow convenient chaining of calls.
function filterMetadata(item: Record<string, any>, options?: PinoLogflareOptionsI) {
  if (options && options.useIncludeFeature && options.includeFields && options.extraMetadataFieldName) {
    if (item && isObject(item.metadata)) {
      let otherContext = _.omit(item.metadata, options.includeFields)
      item.metadata = {..._.pick(item.metadata, options.includeFields)}
      if (isObject(otherContext) && Object.keys(otherContext).length > 0) {
        item.metadata[options.extraMetadataFieldName] = JSON.stringify(otherContext)
      }
    }
  }
  return item
}
export {toLogEntry, formatPinoBrowserLogEvent, filterMetadata, pinoBrowserLogEventI}
