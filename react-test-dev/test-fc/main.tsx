import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
function App() {
  const [num] = useState(100)
  return <div>{num}</div>
}

function Child() {
  return <h3>child</h3>
}

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(<App />)
