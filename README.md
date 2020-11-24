# react-photo-scissor

> A React photo scissor!

[![NPM](https://img.shields.io/npm/v/react-photo-scissor.svg)](https://www.npmjs.com/package/react-photo-scissor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-photo-scissor
```

## Usage

```jsx
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
```

### Options

| Name  | Type | Default | Required |
| ------------- | ------------- | ------------- | ------------- |
| image          | string  |      | true
| viewportWidth  | number  | 100  |
| viewportHeight | number  | 100  |
| boundaryWidth  | number  | 200  |
| boundaryHeight | number  | 200  |
| showSlider     | bool    | true |

### Methods

##### function crop(type)

Result type default is blob, value can be 'canvas', 'base64', 'blob', 'html'

## License

MIT © [elliottspirit](https://github.com/elliottspirit)
