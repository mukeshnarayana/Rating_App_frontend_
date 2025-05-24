import React,{useEffect,useState} from 'react';
import Navbar from './components/Navbar/Nvbar';
import './Admin.css';
import { FaUsers, FaStore, FaStar, FaUserPlus} from 'react-icons/fa'; // FontAwesome icons
import Footer from './components/Footer/Footer'

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
  const [filterName, setFilterName] = useState('')
  const [filterAddress, setFilterAddress] = useState('')
  const [stores,setStores] = useState([])
  const [users,setUsers] = useState([])
  const [filterusername,setFilterUserName] = useState('')
  const [filteruseremail,setFilterUserEmail] = useState('')
  const [filteruserrole,setFilterUserRole] = useState('')
  const [storename,setStoreName] = useState('')
  const [storeaddress,setStoreAddress] = useState('')
  const [ownerid,setOwnerId] = useState('')

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
              setSuccess(data.message || 'Failed to load data')
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

  const handleAddStore = async(e) => {
     e.preventDefault()
     setIsLoading(true)
     setError('')
     setSuccess('')
     try{
       const token = localStorage.getItem('token')
       const response = await fetch('http://localhost:3050/stores/addstore',{
          method: 'POST',
          headers:{
             'Content-Type': 'application/json',
             'token': token
          },
          body: JSON.stringify({
              storename,
              storeaddress,
              ownerid
          })
       })
       const data = await response.json()
       if(data.success){
          setSuccess(data.data.message)
          setStoreName('')
          setStoreAddress('')
          setOwnerId('')
       }else{
         setSuccess(data.message || 'Failed to add store')
       }

     }catch(error){
        console.error('Error adding store:',error)
        setError('Error adding stores')
     }finally{
        setIsLoading(false)
     }
  }

  useEffect(()=>{
     fetchAllStores()
     fetchAllusers()
  },[])

  const fetchAllStores = async()=>{
       try{
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:3050/stores/getallstores',{
             method: 'GET',
             headers:{
                'token': token
             }
          })
          const result = await response.json()
          console.log('API Response:', result)
          if(result.success){
             setStores(result.data)
          } else {
             setError(result.message || 'Failed to fetch stores')
          }
       }catch(error){
          console.error('Error fetching stores:',error)
          setError('Error fetching stores')
       }
   }
  const fetchAllusers = async()=>{
      try{
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:3050/users/getallusers',{
              method: 'GET',
              headers: {
                  'token': token
              }
          })
          const result = await response.json()
          if(result.success){
              setUsers(result.data)
          }else{
             setSuccess(result.message || 'Failed to fetch users')
          }
      }catch(error){
         console.error('Error fetching users:',error)
         setError('Error fetching users')
      }
  }
  const filterStores = async (newName, newAddress) => {
    if (!newName && !newAddress) {
      fetchAllStores();
      return;
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3050/stores/getstorebyname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          storename: newName || '',
          address: newAddress || ''
        })
      })
      const data = await response.json()
      console.log('Filter response:', data)
      
      if (data.success) {
        setStores(data.data)
        if (data.data && data.data.length > 0) {
          setSuccess('Stores found successfully')
        } else {
          setSuccess('No stores found matching the filter')
        }
      } else {
        setSuccess(data.message || 'Failed to filter stores')
      }
    } catch (error) {
      console.error('Error filtering stores:', error)
      setError('Error filtering stores')
    }
  }

  const handleFilterNameChange = (e) => {
    const value = e.target.value;
    setFilterName(value);
    setError('');
    setSuccess('');
    filterStores(value, '', filterAddress);
  };

  const handleFilterAddressChange = (e) => {
    const value = e.target.value;
    setFilterAddress(value);
    setError('');
    setSuccess('');
    filterStores(filterName, '', value);
  };


  const filterusers = async(newusername, newuseremail, newuserrole) => {
      if(!newusername && !newuseremail && !newuserrole) {
          fetchAllusers();
          return;
      }
      try{
         const token = localStorage.getItem('token')
         const response = await fetch('http://localhost:3050/users/getuserbyfilter',{
            method: 'POST',
            headers:{
               'Content-Type': 'application/json',
               'token': token
            },
            body: JSON.stringify({
               name: newusername || '',
               email: newuseremail || '',
               role: newuserrole || ''
            })
         })
         const data = await response.json()
         if(data.success){
            setUsers(data.data)
            if(data.data && data.data.length > 0){
                setSuccess(data.message || 'Users found successfully')
            }else{
               setSuccess(data.message || 'No users found matching the filter')
            }
         } else {
            setSuccess(data.message || 'Failed to filter users')
         }
      }catch(error){
         console.error('Error filtering users:',error)
         setError('Error filtering users')
      }
  }

  const handleFilterUserNameChange = (e) => {
     const value = e.target.value
     setFilterUserName(value);
     setError('');
     setSuccess('');
     filterusers(value,filteruseremail,filteruserrole)
  }
  const handleFilterUserEmailChange = (e) => {
      const value = e.target.value 
      setFilterUserEmail(value);
      setError('');
      setSuccess('');
      filterusers(filterusername,value,filteruserrole)
  }
  const handleFilterUserRoleChange = (e) => {
      const value = e.target.value 
      setFilterUserRole(value)
      setError('')
      setSuccess('')
      filterusers(filterusername,filteruseremail,value)
  }

  if(error) return <div className="text-danger">{error}</div>
  if(!count) return <div>Loading...</div>
  const { totalusers, totalstores, totalratings } = count.data || { totalusers: 0, totalstores: 0, totalratings: 0 }
   
  return (
    <>
    <Navbar role="Admin"/>
    <div className="admin-page">
      <div className="container mt-5">
        <div className="row text-center g-4">
          {/* Total Users */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 rounded-4 align-items-center" >
              <FaUsers size={30} className=" mb-2" style={{backgroundColor: '#ffff'}} />
              <h6 className="text-muted" style={{backgroundColor: '#ffff'}}>Total Users</h6>
              <h4 className="fw-bold" style={{backgroundColor: '#ffff'}}>{totalusers}</h4>
            </div>
          </div>

          {/* Total Stores */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 rounded-4 align-items-center">
              <FaStore size={30} className=" mb-2 " style={{backgroundColor: '#ffff'}}/>
              <h6 className="text-muted " style={{backgroundColor: '#ffff'}}>Total Stores</h6>
              <h4 className="fw-bold " style={{backgroundColor: '#ffff'}}>{totalstores}</h4>
            </div>
          </div>

          {/* Total Ratings */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 rounded-4 align-items-center">
              <FaStar size={30} className=" mb-2 " style={{backgroundColor: '#ffff'}}/>
              <h6 className="text-muted " style={{backgroundColor: '#ffff'}}>Total Ratings</h6>
              <h4 className="fw-bold " style={{backgroundColor: '#ffff'}}>{totalratings}</h4>
            </div>
          </div>
        </div>
      </div>   
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className='adduser'>
         <h5><FaUserPlus size={20}/>  Add New User</h5>
      </div>
      <div className="userform shadow-sl p-4 rounded-4">
        <div className="adduserform " style={{backgroundColor: '#ffff'}}>
          <form  style={{backgroundColor: '#ffff'}}>
            <div className="row mb-3"  style={{backgroundColor: '#ffff'}}>
              <div className="col-md-3"  style={{backgroundColor: '#ffff'}}>
                <input type="text" placeholder="Name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="col-md-3"  style={{backgroundColor: '#ffff'}}>
                <input type="email" placeholder="Email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div className="col-md-3"  style={{backgroundColor: '#ffff'}}>
                <input type="text" placeholder="Address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)}/>
              </div>
              <div className="col-md-3"  style={{backgroundColor: '#ffff'}}>
                <input type="password" placeholder="Password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className='col-md-3  mt-3'  style={{backgroundColor: '#ffff'}}>
                  <input type='text' placeholder='Role' className='form-control' value={role} onChange={(e) => setRole(e.target.value)}/>
              </div>
            </div>
            <button type="submit" className="btn btn-dark fw-bold" onClick={handleAddUser} disabled={isloading} >{isloading ? 'Adding...' : 'Add User'}</button>
          </form>
        </div>
      </div>
      <div className='adduser'>
         <h5><FaStore size={20}/>  Add New Store</h5>
      </div>
      <div className="userform shadow-sl p-4 rounded-4">
        <div className="adduserform " style={{backgroundColor: '#ffff'}}>
          <form  style={{backgroundColor: '#ffff'}}>
            <div className="row mb-3"  style={{backgroundColor: '#ffff'}}>
              <div className="col-md-3"  style={{backgroundColor: '#ffff'}}>
                <input type="text" placeholder="Store Name" className="form-control" value={storename} onChange={(e)=> setStoreName(e.target.value)} />
              </div>
              <div className="col-md-3"  style={{backgroundColor: '#ffff'}}>
                <input type="text" placeholder="Store Address" className="form-control" value={storeaddress} onChange={(e) => setStoreAddress(e.target.value)}/>
              </div>
              <div className="col-md-3"  style={{backgroundColor: '#ffff'}}>
                <input type="number" placeholder="Owner Id" className="form-control" value={ownerid} onChange={(e) => setOwnerId(e.target.value)}/>
              </div>
            </div>
            <button type="submit" className="btn btn-dark fw-bold" onClick={handleAddStore} disabled={isloading} >{isloading ? 'Adding...' : 'Add Store'}</button>
          </form>
        </div>
      </div>
      <div className='adduser'>
         <h5><FaStore size={20}/>  Stores</h5>
      </div>
      <div className='filterstores'>
         <div className='filterstoresform'>
            <form style={{backgroundColor: '#ffff'}} >
               <div className='row mb-3' style={{backgroundColor: '#ffff'}}>
                  <div className='col mb-4' style={{backgroundColor: '#ffff'}}>
                    <input 
                      type="text" 
                      placeholder="Store Name" 
                      className="form-control" 
                      value={filterName} 
                      onChange={handleFilterNameChange}
                    />
                  </div>
                  <div className='col mb-4' style={{backgroundColor: '#ffff'}}>
                    <input 
                      type="text" 
                      placeholder="Store Address" 
                      className="form-control" 
                      value={filterAddress} 
                      onChange={handleFilterAddressChange}
                    />
                  </div>
               </div>
            </form>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className='text-center'>Store Name</th>
                      <th className='text-center'>Address</th>
                      <th className='text-center'>Average Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                        {stores.length > 0 ? (
                      stores.map((store) => (
                        <tr key={store.id}>
                          <td className='text-center'>{store.storename}</td>
                          <td className='text-center'>{store.storeaddress}</td>
                          <td className='text-center'>{store.overallrating}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">No store data found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
         </div>
      </div>
      <div className='adduser'>
         <h5><FaUsers size={30}/>  Users</h5>
      </div>
      <div className='filterstores'>
         <div className='filterstoresform'>
            <form style={{backgroundColor: '#ffff'}} >
               <div className='row mb-3' style={{backgroundColor: '#ffff'}}>
                  <div className='col mb-4' style={{backgroundColor: '#ffff'}}>
                    <input 
                      type="text" 
                      placeholder="Filter By Name" 
                      className="form-control" 
                      value={filterusername}
                      onChange={handleFilterUserNameChange}
                    />
                  </div>
                  <div className='col mb-4' style={{backgroundColor: '#ffff'}}>
                    <input 
                      type="text" 
                      placeholder="Filter By Email" 
                      className="form-control" 
                      value={filteruseremail}
                      onChange={handleFilterUserEmailChange}
                    />
                  </div>
                  <div className='col mb-4'style={{backgroundColor: '#ffff'}}>
                    <input
                      type='text'
                      placeholder='Filter By Role'
                      className='form-control'
                      value={filteruserrole}
                      onChange={handleFilterUserRoleChange}
                    />
                     
                  </div>
               </div>
            </form>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className='text-center'>Name</th>
                      <th className='text-center'>Email</th>
                      <th className='text-center'>Address</th>
                      <th className='text-center'>Role</th>
                      <th className='text-center'>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                       {users.length > 0 ? (
                         users.map((user)=>(
                           <tr key={user.id}>
                              <td className='text-center'>{user.name}</td>
                              <td className='text-center'>{user.email}</td>
                              <td className='text-center'>{user.address}</td>
                              <td className='text-center'>{user.role}</td>
                              <td className='text-center'>{user.overall_rating}</td>

                           </tr>
                         ))
                       ):(
                          <tr>
                            <td colSpan="5" className="text-center text-muted">No user data found</td>
                          </tr>
                       )}
                        
                  </tbody>
                </table>
            </div>                   
         </div>
      </div>

      <Footer/>
    </div>
    </>
  );
}
