import EventEmitter from './eventemitter3'

export default interface HTTPConnection extends EventEmitter {
  url: string
  constructor(url: string)
  formatError(
    payload: any,
    message: string,
    code?: number,
  ): {
    error: {
      message: string
      code: number
    }
    id: any
    jsonrpc: any
  }
  send(payload: any, internal?: any): Promise<any>
}
