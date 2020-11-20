import { css, CSS_TRANSFORM, CSS_USERSELECT, Transform } from './style.js'
import { _updateCenterPoint } from './position.js'

export function _initializeDraggable() {
  let isDragging = false
  let originalX
  let originalY
  let originalDistance
  let vpRect
  let transform
  let mouseMoveEv
  let mouseUpEv

  function assignTransformCoordinates(deltaX, deltaY) {
    const previewRect = this.elements.preview.getBoundingClientRect()
    const top = transform.y + deltaY
    const left = transform.x + deltaX

    if (
      vpRect.top > previewRect.top + deltaY &&
      vpRect.bottom < previewRect.bottom + deltaY
    ) {
      transform.y = top
    }

    if (
      vpRect.left > previewRect.left + deltaX &&
      vpRect.right < previewRect.right + deltaX
    ) {
      transform.x = left
    }
  }

  function keyDown(ev) {
    // const LEFT_ARROW  = 37,
    //     UP_ARROW    = 38,
    //     RIGHT_ARROW = 39,
    //     DOWN_ARROW  = 40;
    //
    // if (ev.shiftKey && (ev.keyCode === UP_ARROW || ev.keyCode === DOWN_ARROW)) {
    //   let zoom
    //   if (ev.keyCode === UP_ARROW) {
    //     zoom = parseFloat(this.elements.zoomer.value) + parseFloat(this.elements.zoomer.step)
    //   }
    //   else {
    //     zoom = parseFloat(this.elements.zoomer.value) - parseFloat(this.elements.zoomer.step)
    //   }
    //   this.setZoom(zoom)
    // }
    // else if (this.options.enableKeyMovement && (ev.keyCode >= 37 && ev.keyCode <= 40)) {
    //   ev.preventDefault();
    //   var movement = parseKeyDown(ev.keyCode);
    //
    //   transform = Transform.parse(this.elements.preview);
    //   document.body.style[CSS_USERSELECT] = 'none';
    //   vpRect = this.elements.viewport.getBoundingClientRect();
    //   keyMove(movement);
    // }
    //
    // function parseKeyDown(key) {
    //   switch (key) {
    //     case LEFT_ARROW:
    //       return [1, 0];
    //     case UP_ARROW:
    //       return [0, 1];
    //     case RIGHT_ARROW:
    //       return [-1, 0];
    //     case DOWN_ARROW:
    //       return [0, -1];
    //   }
    // }
  }

  // function keyMove(movement) {
  //   let deltaX = movement[0],
  //       deltaY = movement[1],
  //       newCss = {}
  //
  //   assignTransformCoordinates(deltaX, deltaY)
  //
  //   newCss[CSS_TRANSFORM] = transform.toString()
  //   css(this.elements.preview, newCss)
  //   _updateOverlay.call(this)
  //   document.body.style[CSS_USERSELECT] = ''
  //   _updateCenterPoint.call(this)
  //   _triggerUpdate.call(this)
  //   originalDistance = 0
  // }

  function mouseDown(ev) {
    // if (ev.button !== undefined && ev.button !== 0) return

    ev.preventDefault()
    if (isDragging) return
    isDragging = true
    originalX = ev.pageX
    originalY = ev.pageY

    transform = Transform.parse(this.elements.preview)
    window.addEventListener('mousemove', (mouseMoveEv = mouseMove.bind(this)))
    window.addEventListener('mouseup', (mouseUpEv = mouseUp.bind(this)))
    document.body.style[CSS_USERSELECT] = 'none'
    vpRect = this.elements.viewport.getBoundingClientRect()
  }

  function mouseMove(ev) {
    ev.preventDefault()
    const pageX = ev.pageX
    const pageY = ev.pageY

    const deltaX = pageX - originalX
    const deltaY = pageY - originalY
    const newCss = {}

    assignTransformCoordinates.call(this, deltaX, deltaY)

    newCss[CSS_TRANSFORM] = transform.toString()
    css(this.elements.preview, newCss)
    // _updateOverlay.call(this);
    originalY = pageY
    originalX = pageX
  }

  function mouseUp() {
    isDragging = false
    window.removeEventListener('mousemove', mouseMoveEv)
    window.removeEventListener('mouseup', mouseUpEv)
    document.body.style[CSS_USERSELECT] = ''
    _updateCenterPoint.call(this)
    // _triggerUpdate.call(this)
    originalDistance = 0
  }

  this.elements.overlay.addEventListener('mousedown', mouseDown.bind(this))
  // this.elements.viewport.addEventListener('keydown', keyDown.bind(this))
  // this.elements.overlay.addEventListener('touchstart', mouseDown.bind(this))
}
