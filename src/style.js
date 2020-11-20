// http://jsperf.com/vanilla-css
export function css(el, styles, val) {
  if (typeof styles === 'string') {
    const tmp = styles
    styles = {}
    styles[tmp] = val
  }
  for (const prop in styles) {
    el.style[prop] = styles[prop]
  }
}

export function addClass(el, c) {
  if (el.classList) {
    el.classList.add(c)
  } else {
    el.className += ' ' + c
  }
}

export function removeClass(el, c) {
  if (el.classList) {
    el.classList.remove(c)
  } else {
    el.className = el.className.replace(c, '')
  }
}

export function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key])
  }
}

export const CSS_TRANSFORM = 'transform'
export const CSS_TRANS_ORG = 'transformOrigin'
export const CSS_USERSELECT = 'userSelect'

export function Transform(x, y, scale) {
  this.x = parseFloat(x)
  this.y = parseFloat(y)
  this.scale = parseFloat(scale)
}

Transform.parse = function (v) {
  if (v.style) {
    return Transform.parse(v.style[CSS_TRANSFORM])
  } else if (v.indexOf('matrix') > -1 || v.indexOf('none') > -1) {
    return Transform.fromMatrix(v)
  } else {
    return Transform.fromString(v)
  }
}

Transform.fromMatrix = function (v) {
  var vals = v.substring(7).split(',')
  if (!vals.length || v === 'none') {
    vals = [1, 0, 0, 1, 0, 0]
  }

  return new Transform(num(vals[4]), num(vals[5]), parseFloat(vals[0]))
}

Transform.fromString = function (v) {
  let transform
  v.replace(
    /translate3d\((-?\d+(?:\.\d+)?)px, (-?\d+(?:\.\d+)?)px, (-?\d+(?:\.\d+)?)px\) scale\((\d+(?:\.\d+)?)\)/,
    (all, x, y, z, scale) => {
      transform = new Transform(x, y, scale)
    }
  )
  return transform
}

Transform.prototype.toString = function () {
  return (
    'translate3d' +
    '(' +
    this.x +
    'px, ' +
    this.y +
    'px' +
    ', 0px' +
    ') scale(' +
    this.scale +
    ')'
  )
}

export function TransformOrigin(el) {
  if (!el || !el.style[CSS_TRANS_ORG]) {
    this.x = 0
    this.y = 0
    return
  }
  const css = el.style[CSS_TRANS_ORG].split(' ')
  this.x = parseFloat(css[0])
  this.y = parseFloat(css[1])
}

TransformOrigin.prototype.toString = function () {
  return this.x + 'px ' + this.y + 'px'
}
