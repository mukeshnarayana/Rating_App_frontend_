import React from 'react'
import User from './User'
import Owner from './Owner'
import Admin from './Admin'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import {BrowserRouter,Routes,Route} from 'react-router-dom' 


export default function App(){
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/user' element={<User/>}/>
            <Route path='/owner' element={<Owner/>}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
         </Routes>
      </BrowserRouter>
   )
}