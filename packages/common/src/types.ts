import type { ExternalProvider } from '@ethersproject/providers'
import type { ethers } from 'ethers'
import type EventEmitter from 'eventemitter3'
import type { BigNumber } from 'ethers'
import type { TypedData as EIP712TypedData } from 'eip-712'
export type { TypedData as EIP712TypedData } from 'eip-712'

/**
 * Types for request patching methods. Ethereum RPC request is mapped to
 * the implementation that will replace the original.
 * If a method is not supported set it to `null`
 * and the appropriate error will get called.
 */
export type RequestPatch = {
  eth_accounts?:
    | ((args: {
        baseRequest: EIP1193Provider['request']
      }) => Promise<ProviderAccounts>)
    | null
  eth_getBalance?:
    | ((args: { baseRequest: EIP1193Provider['request'] }) => Promise<Balance>)
    | null
  eth_requestAccounts?:
    | ((args: {
        baseRequest: EIP1193Provider['request']
      }) => Promise<ProviderAccounts>)
    | null
  eth_chainId?:
    | ((args: { baseRequest: EIP1193Provider['request'] }) => Promise<string>)
    | null
  eth_signTransaction?:
    | ((args: {
        baseRequest: EIP1193Provider['request']
        params: EthSignTransactionRequest['params']
      }) => Promise<string>)
    | null
  eth_sign?:
    | ((args: {
        baseRequest: EIP1193Provider['request']
        params: EthSignMessageRequest['params']
      }) => Promise<string>)
    | null
  eth_signTypedData?:
    | ((args: {
        baseRequest: EIP1193Provider['request']
        params: EIP712Request['params']
      }) => Promise<string>)
    | null
  wallet_switchEthereumChain?:
    | ((args: {
        baseRequest: EIP1193Provider['request']
        params: EIP3326Request['params']
      }) => Promise<null>)
    | null
  wallet_addEthereumChain?:
    | ((args: {
        baseRequest: EIP1193Provider['request']
        params: EIP3085Request['params']
      }) => Promise<null>)
    | null
}

export interface EventCallback {
  connect?: <T = ProviderInfo>(info: T) => ProviderInfo
  disconnect?: <T = ProviderRpcError>(error: T) => ProviderRpcError
  message?: <T = ProviderMessage>(message: T) => ProviderMessage
  chainChanged?: <T = ChainId>(chainId: T) => ChainId
  accountsChanged?: <T = ProviderAccounts>(accounts: T) => ProviderAccounts
}

// eslint-disable-next-line max-len
export type AccountSelectAPI = (
  options: SelectAccountOptions
) => Promise<Account>

export type SelectAccountOptions = {
  basePaths: BasePath[] // the paths to display in the base path selector
  assets: Asset[] // the selectable assets to scan for a balance
  chains: Chain[] // the selectable chains/networks to scan for balance
  scanAccounts: ScanAccounts
  walletIcon: string
}

export type BasePath = {
  label: string // eg - Ethereum Ledger Live
  value: DerivationPath
}

export type DerivationPath = string // eg - m/44'/60'

export type Asset = {
  label: string // eg - ETH
  address?: string // if is a token, address to query contract
}

export type ScanAccounts = (options: ScanAccountsOptions) => Promise<Account[]>

export type ScanAccountsOptions = {
  derivationPath: DerivationPath
  chainId: Chain['id']
  asset: Asset
}

export type AccountAddress = string

export type Account = {
  address: AccountAddress
  derivationPath: DerivationPath
  balance: {
    asset: Asset['label']
    value: BigNumber
  }
}

export type AccountsList = {
  all: Account[]
  filtered: Account[]
}

export interface AppMetadata {
  /* App name */
  name: string

  /* SVG icon string, with height set to 100% */
  icon: string

  /* Description of app*/
  description?: string

  /* Url to a getting started guide for app */
  gettingStartedGuide?: string

  /* Url that points to more information about app */
  explore?: string

  /** When no injected wallets detected, recommend the user to install some*/
  recommendedInjectedWallets?: RecommendedInjectedWallets[]
}

export type RecommendedInjectedWallets = {
  name: string
  url: string
}

/**
 * A method that takes `WalletHelpers` and
 * returns an initialised `WalletModule` or array of `WalletModule`s.
 */
export type WalletInit = (
  helpers: WalletHelpers
) => WalletModule | WalletModule[] | null

export type WalletHelpers = {
  device: Device
}

export type WalletExclusions = {
  // A provider label mapped to a list of excluded platforms
  // or a boolean indicating if it should be included.
  [key in ProviderLabel | string]?: Platform[] | boolean
}

export interface InjectedWalletOptions {
  // A list of injected wallets to include that
  // are not included by default here: ./packages/injected/
  custom?: InjectedWalletModule[]
  // A mapping of a provider label to a list of filtered platforms
  // or a boolean indicating if it should be included or not.
  // By default all wallets listed in ./packages/injected/
  // are included add them to here to remove them.
  filter?: WalletExclusions
}

export interface APIKey {
  apiKey: string
}

export type Device = {
  os: DeviceOS
  type: DeviceType
  browser: DeviceBrowser
}

export interface WalletModule {
  // The label of the wallet
  label: ProviderLabel | string
  /**
   * Gets the icon of the wallet
   * @returns
   */
  getIcon: () => Promise<string>
  /**
   * @returns the wallet interface associated with the module
   */
  getInterface: (helpers: GetInterfaceHelpers) => Promise<WalletInterface>
}

export type GetInterfaceHelpers = {
  chains: Chain[]
  appMetadata: AppMetadata | null
  BigNumber: typeof ethers.BigNumber
  EventEmitter: typeof EventEmitter
}

export interface InjectedWalletModule extends WalletModule {
  injectedNamespace: InjectedNameSpace
  checkProviderIdentity: (helpers: { provider: any; device: Device }) => boolean
  platforms: Platform[]
}

export type Platform = DeviceOSName | DeviceBrowserName | DeviceType | 'all'

export type DeviceOS = {
  name: DeviceOSName
  version: string
}

export type DeviceBrowser = {
  name: DeviceBrowserName
  version: string
}

export type DeviceOSName =
  | 'Windows Phone'
  | 'Windows'
  | 'macOS'
  | 'iOS'
  | 'Android'
  | 'Linux'
  | 'Chrome OS'

export type DeviceBrowserName =
  | 'Android Browser'
  | 'Chrome'
  | 'Chromium'
  | 'Firefox'
  | 'Microsoft Edge'
  | 'Opera'
  | 'Safari'

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

export type ChainId = string

export type RpcUrl = string

export type WalletInterface = {
  provider: EIP1193Provider
}

export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export interface ProviderMessage {
  type: string
  data: unknown
}

export interface ProviderInfo {
  chainId: ChainId
}

/**
 * An array of addresses
 */
export type ProviderAccounts = AccountAddress[]

export type ProviderEvent =
  | 'connect'
  | 'disconnect'
  | 'message'
  | 'chainChanged'
  | 'accountsChanged'

export interface SimpleEventEmitter {
  on(
    event: ProviderEvent,
    listener:
      | ConnectListener
      | DisconnectListener
      | MessageListener
      | ChainListener
      | AccountsListener
  ): void
  removeListener(
    event: ProviderEvent,
    listener:
      | ConnectListener
      | DisconnectListener
      | MessageListener
      | ChainListener
      | AccountsListener
  ): void
}

export type ConnectListener = (info: ProviderInfo) => void
export type DisconnectListener = (error: ProviderRpcError) => void
export type MessageListener = (message: ProviderMessage) => void
export type ChainListener = (chainId: ChainId) => void
export type AccountsListener = (accounts: ProviderAccounts) => void

/**
 * The hexadecimal representation of the users
 */
export type Balance = string

export interface TransactionObject {
  data?: string
  from: string
  gas?: string
  gasLimit?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  to: string
  value?: string
  nonce?: string
}

interface BaseRequest {
  params?: never
}

export interface EthAccountsRequest extends BaseRequest {
  method: 'eth_accounts'
}

export interface EthChainIdRequest extends BaseRequest {
  method: 'eth_chainId'
}

export interface EthSignTransactionRequest {
  method: 'eth_signTransaction'
  params: [TransactionObject]
}

type Address = string
type Message = string
export interface EthSignMessageRequest {
  method: 'eth_sign'
  params: [Address, Message]
}

// request -> signTypedData_v3`
export interface EIP712Request {
  method: 'eth_signTypedData'
  params: [Address, EIP712TypedData]
}

export interface EthBalanceRequest {
  method: 'eth_getBalance'
  params: [string, (number | 'latest' | 'earliest' | 'pending')?]
}

export interface EIP1102Request extends BaseRequest {
  method: 'eth_requestAccounts'
}

export interface EIP3085Request {
  method: 'wallet_addEthereumChain'
  params: AddChainParams[]
}

export interface EIP3326Request {
  method: 'wallet_switchEthereumChain'
  params: [{ chainId: ChainId }]
}

export type AddChainParams = {
  chainId: ChainId
  chainName?: string
  nativeCurrency: {
    name?: string
    symbol?: string
    decimals: number
  }
  rpcUrls: string[]
}

export interface EIP1193Provider extends SimpleEventEmitter {
  on(event: 'connect', listener: ConnectListener): void
  on(event: 'disconnect', listener: DisconnectListener): void
  on(event: 'message', listener: MessageListener): void
  on(event: 'chainChanged', listener: ChainListener): void
  on(event: 'accountsChanged', listener: AccountsListener): void
  request(args: EthAccountsRequest): Promise<ProviderAccounts>
  request(args: EthBalanceRequest): Promise<Balance>
  request(args: EIP1102Request): Promise<ProviderAccounts>
  request(args: EIP3326Request): Promise<null>
  request(args: EIP3085Request): Promise<null>
  request(args: EthChainIdRequest): Promise<ChainId>
  request(args: EthSignTransactionRequest): Promise<string>
  request(args: EthSignMessageRequest): Promise<string>
  request(args: EIP712Request): Promise<string>
  disconnect?(): void
}

export interface MeetOneProvider extends ExternalProvider {
  wallet?: string
}

export interface BinanceProvider extends EIP1193Provider {
  bbcSignTx: () => void
  requestAccounts: () => Promise<ProviderAccounts>
  isUnlocked: boolean
}

export enum InjectedNameSpace {
  Ethereum = 'ethereum',
  Binance = 'BinanceChain',
  Web3 = 'web3',
  Arbitrum = 'arbitrum',
  XFI = 'xfi'
}

//   Arbitrum = 'arbitrum'
export interface CustomWindow extends Window {
  BinanceChain: BinanceProvider
  ethereum: InjectedProvider
  web3: ExternalProvider | MeetOneProvider
  arbitrum: InjectedProvider
  xfi: {
    ethereum: InjectedProvider
  }
}

export type InjectedProvider = ExternalProvider &
  BinanceProvider &
  MeetOneProvider &
  ExternalProvider &
  Record<string, boolean>

/**
 * The `ProviderIdentityFlag` is a property on an injected provider
 * that uniquely identifies that provider
 */
export enum ProviderIdentityFlag {
  AlphaWallet = 'isAlphaWallet',
  AToken = 'isAToken',
  Binance = 'bbcSignTx',
  Bitpie = 'isBitpie',
  BlankWallet = 'isBlank',
  Coinbase = 'isToshi',
  Detected = 'request',
  Dcent = 'isDcentWallet',
  Frame = 'isFrame',
  HuobiWallet = 'isHbWallet',
  HyperPay = 'isHyperPay',
  ImToken = 'isImToken',
  Liquality = 'isLiquality',
  MeetOne = 'wallet',
  MetaMask = 'isMetaMask',
  MyKey = 'isMYKEY',
  OwnBit = 'isOwnbit',
  Status = 'isStatus',
  Trust = 'isTrust',
  TokenPocket = 'isTokenPocket',
  TP = 'isTp',
  WalletIo = 'isWalletIO',
  XDEFI = 'isXDEFI'
}

export enum ProviderLabel {
  AlphaWallet = 'AlphaWallet',
  AToken = 'AToken',
  Binance = 'Binance Smart Wallet',
  Bitpie = 'Bitpie',
  BlankWallet = 'BlankWallet',
  Brave = 'Brave Wallet',
  Coinbase = 'Coinbase Wallet',
  Dcent = `D'CENT`,
  Detected = 'Detected Wallet',
  Frame = 'Frame',
  HuobiWallet = 'Huobi Wallet',
  HyperPay = 'HyperPay',
  ImToken = 'imToken',
  Liquality = 'Liquality',
  MeetOne = 'MeetOne',
  MetaMask = 'MetaMask',
  MyKey = 'MyKey',
  Opera = 'Opera Wallet',
  OwnBit = 'OwnBit',
  Status = 'Status Wallet',
  Trust = 'Trust Wallet',
  TokenPocket = 'TokenPocket',
  TP = 'TP Wallet',
  WalletIo = 'Wallet.io',
  XDEFI = 'XDEFI Wallet'
}

export enum ProviderRpcErrorCode {
  /** The user rejected the request. */
  RejectedRequest = '4001',

  /** The requested method and/or 
       account has not been authorized by the user. */
  Unauthorized = '4100',

  /** The Provider does not support the requested method. */
  UnsupportedMethod = '4200',

  /** The Provider is disconnected from all chains. */
  Disconnected = '4900',

  /** The Provider is not connected to the requested chain. */
  ChainDisconnected = '4901'
}

export interface Chain {
  id: ChainId
  rpcUrl: string
  label?: string
  token?: TokenSymbol // eg ETH, BNB, MATIC
}

export type TokenSymbol = string // eg ETH

export interface CustomNetwork {
  networkId: number
  genesis: GenesisBlock
  hardforks: Hardfork[]
  bootstrapNodes: BootstrapNode[]
}

export interface GenesisBlock {
  hash: string
  timestamp: string | null
  gasLimit: number
  difficulty: number
  nonce: string
  extraData: string
  stateRoot: string
}
export interface Hardfork {
  name: string
  block: number | null
}

export interface BootstrapNode {
  ip: string
  port: number | string
  network?: string
  chainId?: number
  id: string
  location: string
  comment: string
}
