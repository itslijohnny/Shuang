/** last changed: 2020.5.3 */

/** States **/
const Shuang = {
  resource: {
    dict: {},
    schemeList: {},
    scheme: {},
    keyboardLayoutList: {},
    keyboardLayout: {},
  },
  core: {
    model: {},
    current: null,
    order: {
      shengIndex: 0,
      yunIndex: 0
    },
    history: []
  },
  app: {
    setting: {
      config: {},
      reload() { }
    },
    staticJS: 0,
    modeList: [],
    action: {}
  }
}

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
