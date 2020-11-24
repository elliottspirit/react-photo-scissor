import React from 'react'
import image from './629.jpg'

import PhotoScissor from 'react-photo-scissor'
import 'react-photo-scissor/dist/index.css'

const App = () => {
  const scissorRef = React.createRef()

  function onCrop() {
    scissorRef.current.crop().then(result => {
      console.log(result)
    })
  }

  return (
    <div>
      <PhotoScissor
        ref={scissorRef}
        image={image}
        viewportWidth={100}
        viewportHeight={100}
        boundaryWidth={200}
        boundaryHeight={200}
      />
      <button onClick={onCrop}>Crop</button>
    </div>
  )
}

export default App
