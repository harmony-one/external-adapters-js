<<<<<<< HEAD
import { Execute, Implementations } from '@chainlink/types'
import blockchainCom from '@chainlink/blockchain.com-adapter'
import blockcypher from '@chainlink/blockcypher-adapter'
=======
import { Execute } from '@chainlink/types'
import blockchainCom from '@chainlink/blockchain.com'
import blockcypher from '@chainlink/blockcypher'
import blockchair from '@chainlink/blockchair'
>>>>>>> 958164f... Add to composite

export type BitcoinIndexerOptions = { type?: BitcoinIndexer }
export enum BitcoinIndexer {
  BlockchainCom = 'blockchain_com',
  Blockcypher = 'blockcypher',
  Blockchair = 'blockchair',
}
const implLookup: Implementations<BitcoinIndexer> = {
  BlockchainCom: blockchainCom,
  Blockcypher: blockcypher,
}

const isBitcoinIndexer = (envVar?: string): envVar is BitcoinIndexer =>
  Object.values(BitcoinIndexer).includes(envVar as any)

export const getBitcoinIndexer = (): BitcoinIndexer | undefined => {
  const bitcoinIndexer = process.env.BTC_INDEXER_ADAPTER
  return isBitcoinIndexer(bitcoinIndexer) ? (bitcoinIndexer as BitcoinIndexer) : undefined
}

export const getImpl = (options: BitcoinIndexerOptions): Execute => {
  const prefix = options.type?.toUpperCase()
  const impl = options.type && implLookup[options.type]
  if (!impl) throw Error(`Unknown balance adapter type: ${options.type}`)

  return (data) => {
    const config = impl.makeConfig(prefix)
    const execute = impl.makeExecute(config)
    return execute(data)
  }
}
