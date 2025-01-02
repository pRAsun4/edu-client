import { Route, Routes } from 'react-router-dom'
import './Main.css'
// import { InnerLayout } from './layout/InnerLayout'
import { Settings } from './pages/Settings'

function App() {

  return (
    <>
      <Routes>
        <Route path='/settings' element={< Settings />} />
      </Routes>
    </>
  )
}

export default App
