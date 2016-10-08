# gulf-editor-codemirror
[Gulf](http://github.com/gulf/gulf#readme) bindings for [codemirror](http://codemirror.net)

(This version is compatible with gulf v5, only. For gulf v4 see the package `gulf-codemirror` on npm)

## Install

```
npm install --save gulf-editor-codemirror
```

## Usage

```js
const CodemirrorDocument = require('gulf-editor-codemirror')

var cm = CodeMirror(document.body)
var doc = new CodemirrorDocument({
  editorInstance: cm
})

masterStream.pipe(doc.masterLink()).pipe(masterStream)
```

## API
### class CodemirrorDocument({editorInstance:CodeMirror, ...}) extends gulf.EditableDocument
  * `editorInstance` -- a codemirror instance to be wired up with gulf
  * `storageAdapter` -- (optional) a gulf storage adapter. Default is `gulf.MemoryAdapter`
  * `ottype` -- (optional) the ottype to use. Default is `ot-text`.


## Legal
(c) 2015-2016 by Marcel Klehr

GNU Lesser General Public License
