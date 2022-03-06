import type { CallResult, Call } from '../types/call/CallTypes'
import { CallFactory } from '../classes/CallFactory'

export async function useCall(call: Call): Promise<CallResult> {
  const oneCall = (await useCalls([call]))[0]
  return oneCall
}

export async function useCalls(calls: Call[]): Promise<CallResult[]> {
  const callme = CallFactory.getCallInstance()
  const results = await callme.executeCall(calls)
  const values = results.map((result) => {
    return (
      result?.value
        ? { value: result?.value, error: undefined }
        : {
            value: result?.value,
            error: result?.value ?? new Error('Error retrieving value'),
          }
    ) as CallResult
  })

  return values
}
