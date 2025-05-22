import React,{useEffect,useState} from 'react';
import Navbar from './components/Navbar/Nvbar';
import './Admin.css';
import { FaUsers, FaStore, FaStar, FaUserPlus} from 'react-icons/fa'; // FontAwesome icons

export default function Admin() {
  const [count,setCount] = useState(null)
  const [error,setError] = useState('')
  const [isloading,setIsLoading] = useState(false)
  const [success,setSuccess] = useState('')
  const [name,setName] =useState('')
  const [email,setEmail] = useState('')
  const [address,setAddress] = useState('')
  const [password,setPassword] = useState('')
  const [role,setRole] = useState('')

  useEffect(()=>{
     if(success){
       const timer = setTimeout(()=>{
          setSuccess('')
       },3000)
       return ()=> clearTimeout(timer)
     }
  },[success])

  useEffect(()=>{
     const fetchCount = async()=>{
         try{
           const token = localStorage.getItem('token')
           if (!token) {
             setError('No authentication token found')
             return
           }
           const response = await fetch('http://localhost:3050/stores/admindashboard',{
              method: 'GET',
              headers:{
                  'token': token
              }
           })
           const data = await response.json()
           if(data.success){
              setCount(data)
           }else{
              setError(data.message || 'Failed to load data')

           }
         }catch(error){
            console.error('Error fetching count:',error)
            setError('Error fetching count')
         }
     }
     fetchCount()
  },[]) 

  const handleAddUser = async(e) => {
     e.preventDefault()
     setIsLoading(true)
     setError('')
     setSuccess('')
     try{
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3050/users/adduser',{
           method: 'POST',
           headers:{
             'Content-Type': 'application/json',
             'token': token
           },
           body: JSON.stringify({
             name,
             email,
             address,
             password,
             role
           })
        })
        const data = await response.json()
        if(data.success){
           setSuccess(data.message)
           setName('')
           setEmail('')
           setAddress('')
           setPassword('')
           setRole('')
        }else{
           setSuccess(data.message || 'Failed to add user')
           console.error('Failed to add user:',data.message)
        }
     }catch(error){
        console.error('Error adding user:',error)
        setSuccess('Error adding user')
     }finally{
        setIsLoading(false)
     }

  }
  

  if(error) return <div className="text-danger">{error}</div>
  if(!count) return <div>Loading...</div>

  
  
  const { totalusers, totalstores, totalratings } = count.data || { totalusers: 0, totalstores: 0, totalratings: 0 }
   
  return (
    <div className="admin-page">
      <Navbar role="Admin"/>
      <div className="container mt-5">
        <div className="row text-center g-4">
          {/* Total Users */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 rounded-4 align-items-center">
              <FaUsers size={30} className=" mb-2 bg-light"/>
              <h6 className="text-muted bg-light">Total Users</h6>
              <h4 className="fw-bold bg-light">{totalusers}</h4>
            </div>
          </div>

          {/* Total Stores */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 rounded-4 align-items-center">
              <FaStore size={30} className=" mb-2 bg-light" />
              <h6 className="text-muted bg-light">Total Stores</h6>
              <h4 className="fw-bold bg-light">{totalstores}</h4>
            </div>
          </div>

          {/* Total Ratings */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 rounded-4 align-items-center">
              <FaStar size={30} className=" mb-2 bg-light"/>
              <h6 className="text-muted bg-light">Total Ratings</h6>
              <h4 className="fw-bold bg-light">{totalratings}</h4>
            </div>
          </div>
        </div>
      </div>   
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className='adduser'>
         <h5><FaUserPlus size={20}/>  Add New User</h5>
      </div>
      <div className="userform shadow-sm p-4 rounded-4">
        <div className="adduserform bg-light">
          <form className='bg-light'>
            <div className="row mb-3 bg-light">
              <div className="col-md-3 bg-light">
                <input type="text" placeholder="Name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="col-md-3 bg-light">
                <input type="email" placeholder="Email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div className="col-md-3 bg-light">
                <input type="text" placeholder="Address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)}/>
              </div>
              <div className="col-md-3 bg-light">
                <input type="password" placeholder="Password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className='col-md-3 bg-light mt-3'>
                  <input type='text' placeholder='Role' className='form-control' value={role} onChange={(e) => setRole(e.target.value)}/>
              </div>
            </div>
            <button type="submit" className="btn btn-dark fw-bold" onClick={handleAddUser} disabled={isloading}>{isloading ? 'Adding...' : 'Add User'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
