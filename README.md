# gulf-codemirror
Convenient [gulf](http://github.com/marcelklehr/gulf#readme) wrapper for [codemirror](http://codemirror.net)

## Install

```
npm install gulf-codemirror
```

## Usage

```js
var bindEditor = require('gulf-codemirror')

var cm = CodeMirror(document.body)
var doc = bindEditor(cm)

masterStream.pipe(doc.masterLink()).pipe(masterStream)
```

## API
### bindEditor(cm:CodeMirrorInstance, [storageAdapter])
  * `cm` -- a codemirror instance to be wired up with gulf
  * `storageAdapter` -- a gulf storage adapter (optional; defaults to the in-memory Adapter)
  * *returns* the `gulf.EditableDocument` (see [the gulf docs](http://github.com/marcelklehr/gulf#readme))


## Legal
(c) 2015 by Marcel Klehr

GNU Lesser General Public License