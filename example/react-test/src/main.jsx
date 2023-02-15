import React from 'react'
import ReactDOM from 'react-dom'

const jsx = (
  <div>
    <span>big-react</span>
  </div>
)
ReactDOM.createRoot(document.getElementById('root')).render(
  jsx
)
console.log('jsx', jsx)
console.log('React', React)
console.log('ReactDOM', ReactDOM)
