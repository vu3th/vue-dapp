import { Ref } from 'vue'

export type AggregateCallResult =
  | {
      value: Ref
      success: boolean
      key: string
    }
  | undefined
