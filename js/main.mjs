import parseColor from 'https://cdn.skypack.dev/parse-color'
import hljs from 'https://cdn.skypack.dev/highlight.js/lib/core'
import hljsLangHtml from 'https://cdn.skypack.dev/highlight.js/lib/languages/xml'
import hljsLangCss from 'https://cdn.skypack.dev/highlight.js/lib/languages/css'
import hljsLangJavascript from 'https://cdn.skypack.dev/highlight.js/lib/languages/javascript'
import unescape from 'https://cdn.skypack.dev/unescape'
import katex from 'https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/katex.mjs'
import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/contrib/auto-render.mjs"

const practiceCheckers = {
  htmlTagsPractice(target) {
    const testDiv = document.createElement('div')
    testDiv.innerHTML = target.value

    let childrenNames = []
    for (const child of testDiv.children) {
      childrenNames.push(child.tagName)
    }
    
    if (childrenNames.length !== 3 
      || childrenNames[0] !== 'HEADER'
      || childrenNames[1] !== 'MAIN'
      || childrenNames[2] !== 'FOOTER') {
      return [false, 'should contain a header, a main and a footer']
    }

    if (testDiv.children[0].children.length !== 1
      || testDiv.children[0].children[0].tagName !== 'H1') {
      return [false, 'header should contain an h1']
    }

    if (testDiv.children[1].children.length !== 2
      || testDiv.children[1].children[0].tagName !== 'ARTICLE'
      || testDiv.children[1].children[1].tagName !== 'ARTICLE') {
      return [false, 'main should contain 2 articles']
    }

    return [true, 'Correct!']
  },
  devTools1Practice(target) {
    const ul = target.querySelector('ul')
    if (ul === null) {
      return [false, 'You wrongly removed ul. Try again.', true]
    }
    if (ul.children[1]?.innerText === 'Tacos') {
      return [true, 'Correct!']
    } else if (ul.children[1]?.innerText === 'French fries') {
      return [false, 'Replace the second item with "tacos".']
    } else {
      return [false, 'Try again.', true]
    }
  },
  devTools2Practice(target) {
    const text1 = target.querySelector('#devTools2T1'),
          text2 = target.querySelector('#devTools2T2')
    if ((!text1) || (!text2)) {
      return [false, 'Do not edit the HTML code. Try again.', true]
    }

    if (parseColor(window.getComputedStyle(text1).color).keyword !== 'red') {
      return [false, 'The second sentence should be red.']
    }
    if (window.getComputedStyle(text2).display !== 'none') {
      return [false, 'The third sentence should not be displayed.']
    }
    return [true, 'Correct!']
  },
  devTools3Practice(target) {
    if (target.value == 4) {
      return [true, 'Correct!']
    } else {
      return [false, 'Wrong answer. 4 fonts are loaded.']
    }
  },
  devTools4Practice(target) { // Judging code for Practice 4 of Devtools
    if (target.value == 'foo') {
      return [true, 'Correct!']
    } else {
      return [false, 'Wrong answer.']
    }
  },
  jsNullishPractice(target) {
    const testCases = [
      [[null], undefined],
      [[new Date()], undefined],
      [[new Date(), {}], undefined],
      [[new Date(), {dimension: 3}], undefined],
      [[new Date(), {distance: 'minkovski', dimension: 3}], undefined],
      [[new Array()], undefined],
      [[[5, 12]], 13],
      [[[5, 12], {}], 13],
      [[[5, 12], {distance: 'manhattan'}], 17],
      [[[5, 12], {distance: 'minkovski'}], 13],
      [[[5, 12], {distance: 'minkovski', dimension: 3}], 12.28264235951734]
    ]
    const func = new Function('vec', 'options', target.value)
    for (const [args, ans] of testCases) {
      console.log(args, ans)
      let rv
      try {
        rv = func(...args)
      } catch (e) {
        return [false, `Failed on ${JSON.stringify(args)}, ${e}`]
      }
      if (ans !== rv) { // we just forget about floating point issues
        return [false, `Failed on ${JSON.stringify(args)}, ${ans} expected but ${rv} found`]
      }
    }
    return [true, 'Correct']
  }
}

const practiceReset = {}

for (const k of Object.keys(practiceCheckers)) {
  const currentPractice = document.getElementById(k)
  const submitBtn = currentPractice.querySelector('button')
  const target = currentPractice.querySelector('.target')
  const hintElement = currentPractice.querySelector('.hint')
  practiceReset[k] = target.innerHTML
  submitBtn.addEventListener('click', () => {
    const [result, hint, reset] = (practiceCheckers[k])(target)
    if (result) {
      hintElement.classList.remove('hint--error')
      hintElement.classList.add('hint--ok')
    } else {
      hintElement.classList.add('hint--error')
      hintElement.classList.remove('hint--ok')
    }
    hintElement.innerText = hint
    if (reset) {
      target.innerHTML = practiceReset[k]
    }
  })
}
function renderHljsInElement(ele) {
  hljs.registerLanguage('html', hljsLangHtml)
  hljs.registerLanguage('css', hljsLangCss)
  hljs.registerLanguage('javascript', hljsLangJavascript)

  for (const language of ['html', 'css', 'javascript']) {
    ele.querySelectorAll(`pre.hljs.lang-${language}`).forEach(x => {
      const highlighted = hljs.highlight(unescape(x.innerHTML), { language }).value
      x.innerHTML = highlighted
    })
  }
}

renderHljsInElement(document.body)
renderMathInElement(document.body)