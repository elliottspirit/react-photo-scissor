# react-photo-scissor

> A React photo scissor!

[![NPM](https://img.shields.io/npm/v/react-photo-scissor.svg)](https://www.npmjs.com/package/react-photo-scissor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-photo-scissor
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'react-photo-scissor'
import 'react-photo-scissor/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
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

## License

MIT © [elliottspirit](https://github.com/elliottspirit)
