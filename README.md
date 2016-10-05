# gulf-editor-codemirror
[Gulf](http://github.com/marcelklehr/gulf#readme) bindings for [codemirror](http://codemirror.net)

(This version is compatible with gulf v5, only. For gulf v4 see the package `gulf-codemirror` on npm)

## Install

```
npm install --save gulf gulf-editor-codemirror ot-text
```

## Usage

```js
const gulf = require('gulf')
const textOT = require('ot-text').type
const CodemirrorDocument = require('gulf-editor-codemirror')

var cm = CodeMirror(document.body)
var doc = new CodemirrorDocument({
  storageAdapter: new gulf.MemoryAdapter
, ottype: textOT
, editorInstance: cm
})

masterStream.pipe(doc.masterLink()).pipe(masterStream)
```

## API
### class CodemirrorDocument({editorInstance:CodeMirror, ...}) extends gulf.EditableDocument
  * `editorInstance` -- a codemirror instance to be wired up with gulf
  * `storageAdapter` -- a gulf storage adapter (optional; defaults to the in-memory Adapter)
  * `ottype` -- the ottype to use, this will usually be `ot-text` from npm.
  * *returns* the `gulf.EditableDocument` (see [the gulf docs](http://github.com/marcelklehr/gulf#readme))


## Legal
(c) 2015-2016 by Marcel Klehr

GNU Lesser General Public License
