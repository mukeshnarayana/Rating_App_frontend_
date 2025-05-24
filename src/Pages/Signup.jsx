import React, {useState} from 'react'
import {PersonPlus} from 'react-bootstrap-icons'
import './signup.css'

export default function Signup() {
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [address, setAddress] = useState('')
   const [password, setPassword] = useState('')
   const [role, setRole] = useState('')
   const [error, setError] = useState('')
   const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async(e) =>{
      e.preventDefault()
      setIsLoading(true)
      try{
         const response = await fetch('http://localhost:3050/users/signup', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, address, password, role })
         })
         const data = await response.json()
         if(response.ok){
            console.log('User Added Successfully:', data)
            window.location.href = '/login'
         } else {
            setError(data.message || 'Signup failed')
            console.error('Signup failed:', data.message)
         }
      }
      catch(error){
         setError('Error connecting to server')
         console.error('Error connecting to backend:', error)
      } finally {
         setIsLoading(false)
      }
  }
    return(
        <>
          <div className='main'>
            <div className='submain'>
                <div className='signup' style={{backgroundColor: '#ffff'}}>
                    <h5 style={{backgroundColor: '#ffff'}}><PersonPlus size={20} className="me-2" style={{backgroundColor: '#ffff'}}/>Signup</h5>
                </div> 
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSignup} style={{backgroundColor: '#ffff'}}>
                    <input className="form-control my-3" type='text' placeholder='Name' value={name} onChange={(e)=> setName(e.target.value)} required/>
                    <input className= "form-control my-3" type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input className= "form-control my-3" type='text' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} required/>
                    <input className= "form-control my-3" type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <select 
                        className="form-control my-3"   
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="user">user</option>
                        <option value="owner">owner</option>
                        <option value="admin">admin</option>
                    </select>
                    <button 
                        className='btn btn-dark w-100' 
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Signup'}
                    </button>
                </form>
            </div>
          </div>
        </>
    )
}