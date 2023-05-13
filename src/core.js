/** last changed: 2019.8.23 */

Shuang.core.model = class Model {
  constructor(question, answer) {
    this.question = question
    this.answer = answer

    this.view = {
      question: '',
      answer: ''
    }
  }

  // getHint: return key
  getHint(val) {
    return this.answer
  }
  
  beforeJudge() {
    return
    this.scheme.clear()
    const schemeName = Shuang.app.setting.config.scheme
    const schemeDetail = Shuang.resource.scheme[schemeName].detail
    const pinyin = this.sheng + this.yun
    if (schemeDetail.other[pinyin]) {
      if (Array.isArray(schemeDetail.other[pinyin])) {
        schemeDetail.other[pinyin].forEach(other => this.scheme.add(other))
      } else {
        this.scheme.add(schemeDetail.other[pinyin])
      }
    } else {
      for (const s of schemeDetail.sheng[this.sheng]) {
        for (const y of schemeDetail.yun[this.yun]) {
          this.scheme.add(s + y)
        }
      }
      if (this.yun === 'u' && 'jqxy'.includes(this.sheng)) {
        for (const s of schemeDetail.sheng[this.sheng]) {
          for (const y of schemeDetail.yun.v) {
            this.scheme.add(s + y)
          }
        }
      }
    }
  }
  
  // return 1 if val is right but not complete yet
  // return 2 if val is right and complete
  // return 0 if val is wrong
  judge(val) {
    // compare val with this.answer
    // when val == this.answer return 2
    // when this.answer and val has same prefix, return 1
    // else return 0
    if (val === this.answer) {
      return 2
    } else if (val.startsWith(this.answer)) {
      return 1
    } else {
        return 0
    }
}

  static getNextChar() {
    const mode = Shuang.app.setting.config.mode
    const poolKey = Shuang.app.modeList[mode].poolKey
    const pool = Shuang.resource.pool[poolKey]
    const cur = Shuang.resource.pool[poolKey].data[Math.floor(Math.random() * Shuang.resource.pool[poolKey].data.length)]
    const schemeName = Shuang.app.setting.config.scheme
    switch (pool.type) {
        case 'yun':
            return new Model(cur, Shuang.resource.scheme[schemeName].detail.yun[cur])
        case 'sheng':
            return new Model(cur, Shuang.resource.scheme[schemeName].detail.sheng[cur])
        case '无韵':
            return new Model(cur, Shuang.resource.scheme[schemeName].detail.other[cur])
        default:
            break;
    }
  }
  
  static isSame(a, b) {
    return a.sheng === b.sheng && a.yun === b.yun
  }
}
