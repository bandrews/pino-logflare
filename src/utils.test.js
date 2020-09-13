import { formatPinoBrowserLogEvent, filterMetadata } from './utils'
import _ from 'lodash'

describe("utils", () => {
  it("correctly formats pino browser log event", async (done) => {
    const pinoBrowserLogEvent = {
      ts: 1593372837388,
      messages: ["a message", "from pino", "logger"],
      bindings: [{child1: "value1"}, {child2: "value2"}, {child3: "value3"}],
      level: {value: 30, label: "info"}
    }

    const formatted = formatPinoBrowserLogEvent(pinoBrowserLogEvent)

    expect(formatted).toEqual({
      metadata: {
        url: 'http://localhost/',
        level: 'info',
        child1: 'value1',
        child2: 'value2',
        child3: 'value3',
        browser: true
      },
      log_entry: 'a message from pino logger',
      timestamp: 1593372837388
    }
    )
    done()
  })

  it("correctly logs metadata for string and object messages", async (done) => {
    const pinoBrowserLogEvent = {
      ts: 1593372837388,
      messages: [{c: 3}, "a message", "from pino logger", {b: 2}], bindings: [{a: 1}], level: {value: 30}
    }
    const formatted = formatPinoBrowserLogEvent(pinoBrowserLogEvent)

    expect(formatted).toEqual({
      metadata: {
        url: 'http://localhost/',
        level: 'info',
        a: 1,
        b: 2,
        c: 3,
        browser: true
      },
      log_entry: 'a message from pino logger',
      timestamp: 1593372837388
    }
    )
    done()
  })

  it("correctly passes through metadata unmodified when settings aren't specified", async (done) => {
    const originalItem = {
      message: "message",
      timestamp: 1593372837388,
      metadata: {
        url: 'http://localhost',
        level: 'info',
        a: 1,
        b: 2,
        c: 3,
        browser: true
      }
    }

    let item = _.cloneDeep(originalItem)
    let result = filterMetadata(item, undefined)

    expect(result).toEqual(originalItem)
    done()
  })

  it("correctly passes through metadata with invalid settings", async (done) => {
    const originalItem = {
      message: "message",
      timestamp: 1593372837388,
      metadata: {
        url: 'http://localhost',
        level: 'info',
        a: 1,
        b: 2,
        c: 3,
        browser: true
      }
    }

    const options = {
      useIncludeFeature: true,
      includeFields: 4
    }

    let item = _.cloneDeep(originalItem)
    let result = filterMetadata(item, options)

    expect(result).toEqual(originalItem)
    done()
  })

  it("correctly filters out metadata with valid settings", async (done) => {
    const originalItem = {
      message: "message",
      timestamp: 1593372837388,
      metadata: {
        url: 'http://localhost',
        level: 'info',
        a: 1,
        b: 2,
        c: 3,
        browser: true
      }
    }

    const options = {
      useIncludeFeature: true,
      includeFields: ["level", "url", "browser", "extra", "b"],
      extraMetadataFieldName: "extra"
    }

    let item = _.cloneDeep(originalItem)
    let result = filterMetadata(item, options)

    expect(result).toEqual({
      message: "message",
      timestamp: 1593372837388,
      metadata: {
        url: 'http://localhost',
        level: 'info',
        b: 2,
        browser: true,
        extra: "{\"a\":1,\"c\":3}"
      }
    }
    )

    done()
  })
})

