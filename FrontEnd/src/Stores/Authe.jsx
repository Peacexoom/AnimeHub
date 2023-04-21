import React from 'react'
import Login from './LogInForm'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './SignUp'
import Home from '../components/Home'

function App() {  return (
        <BrowserRouter>
                <Routes>            
                    <Route path='/' element={<Login />}></Route>            
                    <Route path='/signup' element={<Signup />}></Route>            
                    <Route path='/home' element={<Home />}></Route>        
                </Routes>    
            </BrowserRouter>  )}
export default App