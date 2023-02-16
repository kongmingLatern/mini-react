import React from 'react'
import ReactDOM from 'react-dom/client'
function App() {
  console.log(1111)
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