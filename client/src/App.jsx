import React from 'react'
import './App.css'
import Routing from './routes/Routes'
import PwaInstallButton from '@/components/PwaInstallButton'

const App = () => {
  return (
    <div className="App">
      <PwaInstallButton />
      <Routing />
    </div>
  )
}

export default App