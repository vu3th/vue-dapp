export type CallResult =
  | { value: any; error: undefined }
  | { value: undefined; error: Error }
  | undefined
