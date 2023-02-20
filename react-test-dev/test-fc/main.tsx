import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
function App() {
  const [num, setNum] = useState(100)
  window.setNum = setNum
  // return <div>{num}</div>
  // return num === 3 ? <Child /> : <div>{num}</div>
  return <div onClick={() => setNum(num + 1)}>{num}</div>
}

function Child() {
  return <h3>child</h3>
}

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(<App />)
