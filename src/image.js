export function loadImage(src) {
  if (!src) {
    throw 'Source image missing'
  }

  const img = new Image()
  img.style.opacity = '0'

  return new Promise(function (resolve, reject) {
    function _resolve() {
      img.style.opacity = '1'
      resolve(img)
      // setTimeout(function () {
      //   resolve(img)
      // }, 1)
    }

    img.onload = function () {
      _resolve()
    }
    img.onerror = function (ev) {
      img.style.opacity = 1
      reject(ev)
      // setTimeout(function () {
      //   reject(ev)
      // }, 1)
    }
    img.src = src
  })
}

export function naturalImageDimensions(img) {
  const w = img.naturalWidth
  const h = img.naturalHeight
  return { width: w, height: h }
}
