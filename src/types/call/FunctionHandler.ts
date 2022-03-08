export declare type FunctionEmptyVoid = () => void
export declare type FunctionEmptyReturn = () => any
export declare type FunctionArgVoid = (...args: any[]) => void
export declare type FunctionArgReturn = (...args: any[]) => any
export declare type FunctionHandler =
  | FunctionEmptyVoid
  | FunctionEmptyReturn
  | FunctionArgVoid
  | FunctionArgReturn
