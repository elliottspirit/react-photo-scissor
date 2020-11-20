// Credits to : Andrew Dupont - http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
export function deepExtend(destination, source) {
  destination = destination || {}
  for (const property in source) {
    if (
      source[property] &&
      source[property].constructor &&
      source[property].constructor === Object
    ) {
      destination[property] = destination[property] || {}
      deepExtend(destination[property], source[property])
    } else {
      destination[property] = source[property]
    }
  }
  return destination
}

export function clone(object) {
  return deepExtend({}, object)
}

export function fix(v, decimalPoints) {
  return parseFloat(v).toFixed(decimalPoints || 0)
}

export function num(v) {
  return parseInt(v, 10)
}

export function dispatchChange(element) {
  if ('createEvent' in document) {
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('change', false, true)
    element.dispatchEvent(evt)
  }
}
