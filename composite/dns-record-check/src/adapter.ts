import { ExecuteWithConfig, ExecuteFactory, Config } from '@chainlink/types'
import { Validator } from '@chainlink/external-adapter'
import { Requester } from '@chainlink/external-adapter'
import { adapters } from '@chainlink/ea/'
import { DNSQueryResponse, DNSAnswer } from '@chainlink/ea/dist/dns-query/src/types'
import { makeConfig } from './config'

const inputParams = {
  record: true,
}

const execute: ExecuteWithConfig<Config> = async (input, config) => {
  const validator = new Validator(input, inputParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const { record } = validator.validated.data

  const dnsExecute = adapters.dnsquery.makeExecute(config)
  const dnsResponse = await dnsExecute(input)
  const dnsData: DNSQueryResponse = { ...dnsResponse.data }
  const foundRecord = dnsData.Answer.find((ans: DNSAnswer) => ans.data.includes(record))

  return Requester.success(jobRunID, {
    status: 200,
    data: {
      result: !!foundRecord,
    },
  })
}

export const makeExecute: ExecuteFactory<Config> = (config?: Config) => (input) =>
  execute(input, config || makeConfig())
