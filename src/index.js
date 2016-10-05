/**
 * gulf-codemirror
 * Copyright (C) 2015-2016 Marcel Klehr <mklehr@gmx.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var gulf = require('gulf')

class CodemirrorDocument extends gulf.EditableDocument {
  constructor(opts) {
    super(opts)
    if (!opts.editorInstance) throw new Error('No codemirror instance was passed')
    this.cm = opts.editorInstance
    this.oldval = ''

    this.cm.on('change', this.collectChanges = () => this._onBeforeChange())
  }

  close() {
    super.close()
    this.cm.off('change', this.collectChanges)
  }

  _setContent(newcontent) {
    this.cm.setValue(this.oldval = newcontent)
    return Promise.resolve()
  }

  _onChange(cs) {
    // remember selection
    const oldSel = this.cm.listSelections().map((sel) => {
          return [this.cm.indexFromPos(sel.head), this.cm.indexFromPos(sel.anchor)]
        })
    const oldScrollPos = this.cm.getScrollInfo()

    // apply changes
    cm.setValue(this.oldval = this.ottype.apply(this.oldval, cs))

    // take care of selection
    var newSel = oldSel
    .map((sel) => {
      return this.ottype.transformSelection(sel, cs)
    })
    .map((transformed) => {
      return {head: this.cm.posFromIndex(transformed[0]), anchor: this.cm.posFromIndex(transformed[1])}
    })
    this.cm.setSelections(newSel)
    this.cm.scrollTo(oldScrollPos.left, oldScrollPos.top)
    
    return Promise.resolve()
  }
  
  _onBeforeChange() {
    var cs = []
      , oldval = this.oldval
      , newval = this.cm.getValue()

    // The following code is taken from shareJS:
    // https://github.com/share/ShareJS/blob/3843b26831ecb781344fb9beb1005cfdd2/lib/client/textarea.js

    if (oldval === newval) return Promise.resolve();

    var commonStart = 0;
    while (oldval.charAt(commonStart) === newval.charAt(commonStart)) {
      commonStart++;
    }
    var commonEnd = 0;
    while (oldval.charAt(oldval.length - 1 - commonEnd) === newval.charAt(newval.length - 1 - commonEnd) &&
      commonEnd + commonStart < oldval.length && commonEnd + commonStart < newval.length) {
      commonEnd++;
    }
    if (oldval.length !== commonStart + commonEnd) {
      if(commonStart) cs.push(commonStart)
      cs.push({d: oldval.length - commonStart - commonEnd });
    }
    if (newval.length !== commonStart + commonEnd) {
      if(commonStart && !cs.length) cs.push(commonStart)
      cs.push(newval.slice(commonStart, newval.length - commonEnd));
    }

    this.oldval = newval
    this.submitChange(cs)
    return Promise.resolve()
  }
}

module.exports = CodemirrorDocument
