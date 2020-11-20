import React, { Component } from 'react'
import styles from './styles.module.css'
import PropTypes from 'prop-types'
import {
  css,
  CSS_TRANS_ORG,
  CSS_TRANSFORM,
  Transform,
  TransformOrigin
} from './style'
import { _centerImage, _updateCenterPoint } from './position'
import { _initializeZoom, _updateZoomLimits } from './zoom'
import { _initializeDraggable } from './drag'
import { _result } from './result'

// export const ExampleComponent = ({ text }) => {
//   return <div className={styles.test}>Example Component: {text}</div>
// }

export default class PhotoScissor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //
    }

    this.data = {}
    this.data.url = this.props.image

    this.elements = {}
    this.elements.boundary = React.createRef()
    this.elements.preview = React.createRef()
    this.elements.viewport = React.createRef()
    this.elements.overlay = React.createRef()
    this.elements.zoomer = React.createRef()

    this._currentZoom = 1

    this.onImageLoad = this.onImageLoad.bind(this)
    this.crop = this.crop.bind(this)
  }

  static propTypes = {
    text: PropTypes.string,
    image: PropTypes.string,
    viewportWidth: PropTypes.number,
    viewportHeight: PropTypes.number,
    boundaryWidth: PropTypes.number,
    boundaryHeight: PropTypes.number,
    showSlider: PropTypes.bool
  }

  componentDidMount() {
    this.elements.boundary = this.elements.boundary.current
    this.elements.preview = this.elements.preview.current
    this.elements.viewport = this.elements.viewport.current
    this.elements.overlay = this.elements.overlay.current
    this.elements.zoomer = this.elements.zoomer.current

    _initializeDraggable.call(this)
    _initializeZoom.call(this)
    // if (this.options.enableResize) {
    //   _initializeResize.call(this)
    // }
  }

  onImageLoad() {
    this.updatePropertiesFromImage()
  }

  updatePropertiesFromImage() {
    const initialZoom = 1
    const cssReset = {}
    const transformReset = new Transform(0, 0, initialZoom)
    const originReset = new TransformOrigin()

    cssReset[CSS_TRANSFORM] = transformReset.toString()
    cssReset[CSS_TRANS_ORG] = originReset.toString()
    cssReset.opacity = 1
    css(this.elements.preview, cssReset)

    const imgData = this.elements.preview.getBoundingClientRect()

    this._originalImageWidth = imgData.width
    this._originalImageHeight = imgData.height

    _centerImage.call(this)
    _updateCenterPoint.call(this)
    _updateZoomLimits.call(this, true)
  }

  crop() {
    return _result.call(this, 'blob')
  }

  render() {
    const viewportWidth = this.props.viewportWidth
      ? this.props.viewportWidth
      : 100
    const viewportHeight = this.props.viewportHeight
      ? this.props.viewportHeight
      : 100
    const boundaryWidth = this.props.boundaryWidth
      ? this.props.boundaryWidth
      : 200
    const boundaryHeight = this.props.boundaryHeight
      ? this.props.boundaryHeight
      : 200
    return (
      <div className={styles.scissorContainer}>
        <div
          className={styles.scBoundary}
          ref={this.elements.boundary}
          style={{
            width: boundaryWidth + 'px',
            height: boundaryHeight + 'px'
          }}
        >
          <img
            className={styles.scImage}
            ref={this.elements.preview}
            src={this.props.image}
            style={{
              transform: this.state.transform,
              transformOrigin: this.state.transformOrigin
            }}
            onLoad={this.onImageLoad}
          />
          <div
            className={styles.scViewport}
            ref={this.elements.viewport}
            style={{
              width: viewportWidth + 'px',
              height: viewportHeight + 'px'
            }}
          />
          <div className={styles.scOverlay} ref={this.elements.overlay} />
        </div>
        <div className={styles.scSliderWrap} hidden={!this.props.showSlider}>
          <input
            className={styles.scSlider}
            ref={this.elements.zoomer}
            type='range'
            step='0.0001'
            defaultValue='1'
          />
        </div>
      </div>
    )
  }
}
