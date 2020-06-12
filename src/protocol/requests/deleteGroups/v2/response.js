const Decoder = require('../../../decoder')
const { failure, createErrorFromCode } = require('../../../error')
/**
 * DeleteGroups Response (Version: 2) => throttle_time_ms [results] TAG_BUFFER
 * throttle_time_ms => INT32
 * results => group_id error_code TAG_BUFFER
 *  group_id => COMPACT_STRING
 *  error_code => INT16
 */

const decodeGroup = decoder => ({
  groupId: decoder.readVarIntString(),
  errorCode: decoder.readInt16(),
})

const decode = async rawData => {
  const decoder = new Decoder(rawData)
  const throttleTimeMs = decoder.readInt32()
  const results = decoder.readArray(decodeGroup)

  for (const result of results) {
    if (failure(result.errorCode)) {
      result.error = createErrorFromCode(result.errorCode)
    }
  }
  return {
    throttleTimeMs,
    results,
  }
}

const parse = async data => {
  return data
}

module.exports = {
  decode,
  parse,
}
