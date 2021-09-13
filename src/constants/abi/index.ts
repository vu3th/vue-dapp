import { Interface } from '@ethersproject/abi'
import ERC20 from './ERC20.json'
import ERC20Mock from './ERC20Mock.json'

const ERC20Interface = new Interface(ERC20.abi)

export { ERC20, ERC20Interface }

const ERC20MockInterface = new Interface(ERC20Mock.abi)

export { ERC20Mock, ERC20MockInterface }

import MULTICALL2_ABI from './Multicall2.json'
export { MULTICALL2_ABI }
