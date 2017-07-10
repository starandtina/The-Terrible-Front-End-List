const path = require('path')
const glob = require('glob')
const cons = require('consolidate')
const fs = require('fs')
const marked = require('marked')
const pygmentize = require('pygmentize-bundled')

const convertMarkdownToHTML = file => {
  const readme = fs.readFileSync(file, 'utf8').replace(/\.md/g, '.html')
  const basename = path.basename(file, '.md')
  const outputFileName = basename === 'README' ? 'index' : basename

  const writeFile = (err, html) => {
    if (err) throw err
    fs.writeFile(`docs/${outputFileName}.html`, html, () => {})
  }

  const consTemplate = (err, content) => {
    if (err) throw err
    cons['lodash']('scripts/index.tpl.html', { content: content }, writeFile)
  }

  marked.setOptions({
    smartypants: true,
    highlight: (code, lang, callback) =>
      // prettier-ignore
      pygmentize({ lang: lang, format: 'html' }, code, (err, result) =>
        callback(err, result.toString())
      ),
  })

  marked(readme, consTemplate)
}

const mds = glob.sync('./*.md')

mds.forEach(md => convertMarkdownToHTML(md))
