import { useState } from 'react'
import {Routes,Route} from "react-router-dom"
import Login from './components/login'
import Register from './components/register'
import Summarise from './components/summarise'
import ProtectedRoute from './components/protected-route'

// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
      <Routes>
           <Route path='/' element={<Login/>}/>  
           <Route path='/login' element={<Login/>}/>
           <Route path='/register' element={<Register/>}/>
           <Route path='/summarise' element={<ProtectedRoute><Summarise/></ProtectedRoute>}/>
      </Routes>

    </>
  )
}

export default App
