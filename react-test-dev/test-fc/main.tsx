import React from 'react'
import ReactDOM from 'react-dom/client'
function App() {
  return (
    <div>
      <Child />
    </div>
  )
}

function Child() {
  return <h3>child</h3>
}

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(<App />)
