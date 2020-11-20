import {
  css,
  CSS_TRANS_ORG,
  CSS_TRANSFORM,
  Transform,
  TransformOrigin
} from './style'

export function _centerImage() {
  const imgDim = this.elements.preview.getBoundingClientRect()
  const vpDim = this.elements.viewport.getBoundingClientRect()
  const boundDim = this.elements.boundary.getBoundingClientRect()
  const vpLeft = vpDim.left - boundDim.left
  const vpTop = vpDim.top - boundDim.top
  const w = vpLeft - (imgDim.width - vpDim.width) / 2
  const h = vpTop - (imgDim.height - vpDim.height) / 2
  const transform = new Transform(w, h, this._currentZoom)

  css(this.elements.preview, CSS_TRANSFORM, transform.toString())
}

export function _updateCenterPoint() {
  const scale = this._currentZoom
  const previewRect = this.elements.preview.getBoundingClientRect()
  const vpRect = this.elements.viewport.getBoundingClientRect()
  const transform = Transform.parse(this.elements.preview.style[CSS_TRANSFORM])
  const previewOrigin = new TransformOrigin(this.elements.preview)
  // get the distance between preview's left top corner to viewport's center point
  // that's the point we need to anchor the image relative to the viewport
  const top = vpRect.top - previewRect.top + vpRect.height / 2
  const left = vpRect.left - previewRect.left + vpRect.width / 2
  const center = {}
  const adj = {}

  center.y = top / scale
  center.x = left / scale

  // why we need to change the transform?
  // First we need to move the center point of the image to the viewport center and then perform the scale
  // that is how the browser works

  // after we moved the translate origin, we need to keep it at the center of the viewport
  // the distance is determined by the distance we moved multiplies the rest of the scale
  // which is discarded by the mechanism of the transform

  // to make sure that translate() move the anchor point to the right position
  // to erase the side effect of combining using translate-origin and scale
  // we subtract the distance that changing origin brings
  adj.y = (center.y - previewOrigin.y) * (1 - scale)
  adj.x = (center.x - previewOrigin.x) * (1 - scale)

  transform.x -= adj.x
  transform.y -= adj.y

  const newCss = {}
  newCss[CSS_TRANS_ORG] = center.x + 'px ' + center.y + 'px'
  newCss[CSS_TRANSFORM] = transform.toString()
  css(this.elements.preview, newCss)
}

export function _getVirtualBoundaries(viewport) {
  const scale = this._currentZoom
  const vpWidth = viewport.width
  const vpHeight = viewport.height
  const centerFromBoundaryX = this.elements.boundary.clientWidth / 2
  const centerFromBoundaryY = this.elements.boundary.clientHeight / 2
  const imgRect = this.elements.preview.getBoundingClientRect()
  const curImgWidth = imgRect.width
  const curImgHeight = imgRect.height
  const halfWidth = vpWidth / 2
  const halfHeight = vpHeight / 2

  const maxX = (halfWidth / scale - centerFromBoundaryX) * -1
  const minX = maxX - (curImgWidth * (1 / scale) - vpWidth * (1 / scale))

  const maxY = (halfHeight / scale - centerFromBoundaryY) * -1
  const minY = maxY - (curImgHeight * (1 / scale) - vpHeight * (1 / scale))

  const originMinX = (1 / scale) * halfWidth
  const originMaxX = curImgWidth * (1 / scale) - originMinX

  const originMinY = (1 / scale) * halfHeight
  const originMaxY = curImgHeight * (1 / scale) - originMinY

  return {
    translate: {
      maxX: maxX,
      minX: minX,
      maxY: maxY,
      minY: minY
    },
    origin: {
      maxX: originMaxX,
      minX: originMinX,
      maxY: originMaxY,
      minY: originMinY
    }
  }
}
