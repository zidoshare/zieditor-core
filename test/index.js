import zieditor from '../src/index.js'
import '../src/lib/codemirror/lib/codemirror.css'
import '../src/styles/preview.css'
import '../src/styles/editor.css'
var node = document.getElementById('zieditor')
var previewNode = document.getElementById('zieditor-preview')
var editor = new zieditor(node, previewNode)

editor.create()

if (module.hot) {
  module.hot.accept('../src/index.js', function () {
    editor.destroyed()
    eidtor = new zieditor(node,previewNode)
    editor.create() 
  })
}