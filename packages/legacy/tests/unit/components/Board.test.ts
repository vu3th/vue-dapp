import { mount } from '@vue/test-utils'
import Board from '@/components/Board.vue'
import { MetaMaskConnector, Connector } from '@/connectors'
const connectors: Connector[] = [new MetaMaskConnector()]

describe('Board component', () => {
  beforeEach(() => {
    // create teleport target
    const el = document.createElement('div')
    el.id = 'modal'
    document.body.appendChild(el)
  })

  afterEach(() => {
    // clean up
    document.body.outerHTML = ''
  })
  it.skip('should work with import on demand', () => {
    // mount(Loader)
    // mount(Modal, {
    //   propsData: {
    //     modalOpen: true,
    //   },
    // })
    const wrapper = mount(Board, {
      attachTo: document.body,
      propsData: {
        connectors: connectors,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
      //   provide: {
      //     autoConnect() {
      //       return false
      //     },
      //   },
    })
    // console.warn(wrapper.getComponent(Board).html())
    expect(wrapper.getComponent(Board).html()).toContain('MetaMask')
  })
})
