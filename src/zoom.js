import {
  addClass,
  css,
  CSS_TRANS_ORG,
  CSS_TRANSFORM,
  Transform,
  TransformOrigin
} from './style.js'
import { dispatchChange, fix } from './help.js'
import { naturalImageDimensions } from './image.js'
import { _getVirtualBoundaries } from './position.js'

export function _initializeZoom() {
  this._currentZoom = 1

  function change() {
    _onZoom.call(this, {
      value: parseFloat(this.elements.zoomer.value),
      origin: new TransformOrigin(this.elements.preview),
      viewportRect: this.elements.viewport.getBoundingClientRect(),
      transform: Transform.parse(this.elements.preview)
    })
  }

  function scroll(event) {
    let delta

    if (event.wheelDelta) {
      delta = event.wheelDelta / 1200 // wheelDelta min: -120 max: 120 // max x 10 x 2
    } else if (event.deltaY) {
      delta = event.deltaY / 1060 // deltaY min: -53 max: 53 // max x 10 x 2
    } else if (event.detail) {
      delta = event.detail / -60 // delta min: -3 max: 3 // max x 10 x 2
    } else {
      delta = 0
    }

    const targetZoom = this._currentZoom + delta * this._currentZoom

    event.preventDefault()
    _setZoomerVal.call(this, targetZoom)
    change.call(this)
  }

  this.elements.zoomer.addEventListener('input', change.bind(this)) // this is being fired twice on keypress
  this.elements.zoomer.addEventListener('change', change.bind(this))

  this.elements.boundary.addEventListener('mousewheel', scroll.bind(this))
  this.elements.boundary.addEventListener('DOMMouseScroll', scroll.bind(this))
}

function _setZoomerVal(v) {
  const z = this.elements.zoomer
  const val = fix(v, 4)
  z.value = Math.max(
    parseFloat(z.min),
    Math.min(parseFloat(z.max), val)
  ).toString()
}

function _onZoom(ui) {
  const transform = ui ? ui.transform : Transform.parse(this.elements.preview)
  const vpRect = ui
    ? ui.viewportRect
    : this.elements.viewport.getBoundingClientRect()
  const origin = ui ? ui.origin : new TransformOrigin(this.elements.preview)

  function applyCss() {
    const transCss = {}
    transCss[CSS_TRANSFORM] = transform.toString()
    transCss[CSS_TRANS_ORG] = origin.toString()
    css(this.elements.preview, transCss)
  }

  this._currentZoom = ui ? ui.value : this._currentZoom
  transform.scale = this._currentZoom
  applyCss.apply(this)

  // keep preview inside the viewport
  if (true) {
    const boundaries = _getVirtualBoundaries.call(this, vpRect)
    const transBoundaries = boundaries.translate
    const oBoundaries = boundaries.origin

    if (transform.x >= transBoundaries.maxX) {
      origin.x = oBoundaries.minX
      transform.x = transBoundaries.maxX
    }

    if (transform.x <= transBoundaries.minX) {
      origin.x = oBoundaries.maxX
      transform.x = transBoundaries.minX
    }

    if (transform.y >= transBoundaries.maxY) {
      origin.y = oBoundaries.minY
      transform.y = transBoundaries.maxY
    }

    if (transform.y <= transBoundaries.minY) {
      origin.y = oBoundaries.maxY
      transform.y = transBoundaries.minY
    }
  }
  applyCss.apply(this)
  // _debouncedOverlay.call(this)
  // _triggerUpdate.call(this)
}

export function _updateZoomLimits(initial) {
  let minZoom = 0
  const maxZoom = 1.5
  let initialZoom
  let defaultInitialZoom
  const zoomer = this.elements.zoomer
  const scale = parseFloat(zoomer.value)
  const boundaryData = this.elements.boundary.getBoundingClientRect()
  const imgData = naturalImageDimensions(
    this.elements.preview,
    this.data.orientation
  )
  const vpData = this.elements.viewport.getBoundingClientRect()

  const minW = vpData.width / imgData.width
  const minH = vpData.height / imgData.height
  minZoom = Math.max(minW, minH)

  zoomer.min = fix(minZoom, 4)
  zoomer.max = fix(maxZoom, 4)

  // defaultInitialZoom = Math.max((boundaryData.width / imgData.width), (boundaryData.height / imgData.height))
  // _setZoomerVal.call(this, defaultInitialZoom)

  if (!initial && (scale < zoomer.min || scale > zoomer.max)) {
    _setZoomerVal.call(this, scale < zoomer.min ? zoomer.min : zoomer.max)
  } else if (initial) {
    defaultInitialZoom = Math.max(
      boundaryData.width / imgData.width,
      boundaryData.height / imgData.height
    )
    // initialZoom = this.data.boundZoom !== null ? this.data.boundZoom : defaultInitialZoom
    initialZoom = defaultInitialZoom
    _setZoomerVal.call(this, initialZoom)
  }

  dispatchChange(zoomer)
}
