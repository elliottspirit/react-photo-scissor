import { clone, deepExtend, fix, num } from './help.js'
import { addClass, css } from './style.js'

const RESULT_DEFAULTS = {
  type: 'canvas',
  format: 'png',
  quality: 1
}
const RESULT_FORMATS = ['jpeg', 'webp', 'png']

function _get() {
  const imgData = this.elements.preview.getBoundingClientRect()
  const vpData = this.elements.viewport.getBoundingClientRect()
  let x1 = vpData.left - imgData.left
  let y1 = vpData.top - imgData.top
  const widthDiff = (vpData.width - this.elements.viewport.offsetWidth) / 2 // border
  const heightDiff = (vpData.height - this.elements.viewport.offsetHeight) / 2
  let x2 = x1 + this.elements.viewport.offsetWidth + widthDiff
  let y2 = y1 + this.elements.viewport.offsetHeight + heightDiff
  let scale = this._currentZoom

  if (scale === Infinity || isNaN(scale)) {
    scale = 1
  }

  x1 = Math.max(0, x1 / scale)
  y1 = Math.max(0, y1 / scale)
  x2 = Math.max(0, x2 / scale)
  y2 = Math.max(0, y2 / scale)

  return {
    points: [fix(x1), fix(y1), fix(x2), fix(y2)],
    zoom: scale
  }
}

export function _result(options) {
  const data = _get.call(this)
  const opts = deepExtend(clone(RESULT_DEFAULTS), clone(options))
  const resultType =
    typeof options === 'string' ? options : opts.type || 'base64'
  const size = opts.size || 'viewport'
  const format = opts.format
  const quality = opts.quality
  const vpRect = this.elements.viewport.getBoundingClientRect()
  const ratio = vpRect.width / vpRect.height

  if (size === 'viewport') {
    data.outputWidth = vpRect.width
    data.outputHeight = vpRect.height
  } else if (typeof size === 'object') {
    if (size.width && size.height) {
      data.outputWidth = size.width
      data.outputHeight = size.height
    } else if (size.width) {
      data.outputWidth = size.width
      data.outputHeight = size.width / ratio
    } else if (size.height) {
      data.outputWidth = size.height * ratio
      data.outputHeight = size.height
    }
  }

  if (RESULT_FORMATS.indexOf(format) > -1) {
    data.format = 'image/' + format
    data.quality = quality
  }

  data.url = this.data.url

  const prom = new Promise((resolve) => {
    switch (resultType.toLowerCase()) {
      case 'canvas':
        resolve(_getCanvas.call(this, data))
        break
      case 'base64':
        resolve(_getBase64Result.call(this, data))
        break
      case 'blob':
        _getBlobResult.call(this, data).then(resolve)
        break
      default:
        resolve(_getHtmlResult.call(this, data))
        break
    }
  })
  return prom
}

function _getCanvas(data) {
  const points = data.points
  const left = num(points[0])
  const top = num(points[1])
  const right = num(points[2])
  const bottom = num(points[3])
  const width = right - left
  const height = bottom - top
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  // const startX = 0
  // const startY = 0
  const canvasWidth = data.outputWidth || width
  const canvasHeight = data.outputHeight || height

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  // if (data.backgroundColor) {
  //   ctx.fillStyle = data.backgroundColor
  //   ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  // }

  // By default assume we're going to draw the entire
  // source image onto the destination canvas.
  let sx = left
  let sy = top
  let sWidth = width
  let sHeight = height
  let dx = 0
  let dy = 0
  let dWidth = canvasWidth
  let dHeight = canvasHeight

  //
  // Do not go outside of the original image's bounds along the x-axis.
  // Handle translations when projecting onto the destination canvas.
  //

  // The smallest possible source x-position is 0.
  if (left < 0) {
    sx = 0
    dx = (Math.abs(left) / width) * canvasWidth
  }

  // The largest possible source width is the original image's width.
  if (sWidth + sx > this._originalImageWidth) {
    sWidth = this._originalImageWidth - sx
    dWidth = (sWidth / width) * canvasWidth
  }

  //
  // Do not go outside of the original image's bounds along the y-axis.
  //

  // The smallest possible source y-position is 0.
  if (top < 0) {
    sy = 0
    dy = (Math.abs(top) / height) * canvasHeight
  }

  // The largest possible source height is the original image's height.
  if (sHeight + sy > this._originalImageHeight) {
    sHeight = this._originalImageHeight - sy
    dHeight = (sHeight / height) * canvasHeight
  }

  // console.table({ left, right, top, bottom, canvasWidth, canvasHeight, width, height, startX, startY, circle, sx, sy, dx, dy, sWidth, sHeight, dWidth, dHeight })

  ctx.drawImage(
    this.elements.preview,
    sx,
    sy,
    sWidth,
    sHeight,
    dx,
    dy,
    dWidth,
    dHeight
  )
  return canvas
}

function _getHtmlResult(data) {
  const points = data.points
  const div = document.createElement('div')
  const img = document.createElement('img')
  const width = points[2] - points[0]
  const height = points[3] - points[1]

  addClass(div, 'scissor-result')
  div.appendChild(img)
  css(img, {
    left: -1 * points[0] + 'px',
    top: -1 * points[1] + 'px'
  })
  img.src = data.url
  css(div, {
    width: width + 'px',
    height: height + 'px'
  })

  return div
}

function _getBase64Result(data) {
  return _getCanvas.call(this, data).toDataURL(data.format, data.quality)
}

function _getBlobResult(data) {
  return new Promise((resolve) => {
    _getCanvas.call(this, data).toBlob(
      function (blob) {
        resolve(blob)
      },
      data.format,
      data.quality
    )
  })
}
