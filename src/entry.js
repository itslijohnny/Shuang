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
    history: [],
    statistics: {
        count: 0,
        startAt: 0,
        batchSize: 50,
        kpm: 0,
    }
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
