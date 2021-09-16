import { Interface } from '@ethersproject/abi'
import MULTICALL2_ABI from './Multicall2.json'
import ERC20 from './ERC20.json'
import ERC20Mock from './ERC20Mock.json'

const ERC20Interface = new Interface(ERC20.abi)
const ERC20MockInterface = new Interface(ERC20Mock.abi)

export { MULTICALL2_ABI, ERC20, ERC20Interface, ERC20Mock, ERC20MockInterface }
