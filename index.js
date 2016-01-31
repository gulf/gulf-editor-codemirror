/**
 * gulf-codemirror
 * Copyright (C) 2015 Marcel Klehr <mklehr@gmx.net>
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
  , textOT = require('ot-text').type
 
module.exports = function(cm, storageAdapter) {
  var doc = new gulf.EditableDocument(storageAdapter || new gulf.MemoryAdapter, textOT)
    , oldval
  
  doc.codemirror = cm

  doc._setContents = function(newcontent, cb) {
    cm.setValue(oldval = newcontent)
    cb()
  }

  // on incoming changes
  doc._change = function(cs, cb) {
    console.log('_change:', cs)

    // remember selection
    var oldSel = cm.listSelections().map(function(sel) {
          return [cm.indexFromPos(sel.head), cm.indexFromPos(sel.anchor)]
        })
      , oldScrollPos = cm.getScrollInfo()

    // apply changes
    cm.setValue(oldval = textOT.apply(oldval, cs))

    // take care of selection
    var newSel = oldSel
    .map(function(sel) {
      return textOT.transformSelection(sel, cs)
    })
    .map(function(transformed) {
      return {head: cm.posFromIndex(transformed[0]), anchor: cm.posFromIndex(transformed[1])}
    })
    cm.setSelections(newSel)
    cm.scrollTo(oldScrollPos.left, oldScrollPos.top)
    cb()
  }
 
  // before _change() and on any edit event
  doc._collectChanges = function(cb) {
    var cs = []
      , newval = cm.getValue()

    // The following code is taken from shareJS:
    // https://github.com/share/ShareJS/blob/3843b26831ecb781344fb9beb1005cfdd2/lib/client/textarea.js

    if (oldval === newval) return cb();

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

    oldval = newval
    console.log(cs)
    this.update(cs)
    cb()
  }

  cm.on('change', genOp)
  function genOp(evt) {
    doc._collectChanges(noop)
  }

  return doc
}

function noop() {}
