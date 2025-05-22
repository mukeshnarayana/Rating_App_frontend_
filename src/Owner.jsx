import React,{useState, useEffect} from 'react' 
import Navbar from './components/Navbar/Nvbar'
import './Owner.css'
import profileImage from './assets/photo pic.jpg'
import { LockFill,ShopWindow,StarFill } from 'react-bootstrap-icons'
import Footer from './components/Footer/Footer'

export default function Owner() { 
     const [oldpassword,setOldpassword] = useState('')
     const [newpassword,setNewpassword] = useState('')
     const [confirmpassword,setConfirmpassword] = useState('')
     const [error,setError] = useState('')
     const [success,setSuccess] = useState('')
     const [isLoading,setIsLoading] = useState(false)
     const [info,setInfo] = useState(null)
     const [userinfo,setUserinfo] = useState(null)

     // Auto clear success message after 3 seconds
     useEffect(() => {
         if (success) {
             const timer = setTimeout(() => {
                 setSuccess('')
             }, 3000)
             return () => clearTimeout(timer)
         }
     }, [success])
     useEffect(()=>{
         const fetchdata = async()=>{
             try{
                 const token = localStorage.getItem('token')
                 console.log('Token:', token) // Debug token
                 if (!token) {
                     setError('No authentication token found')
                     return
                 }
                 const response = await fetch("http://localhost:3050/stores/ownerdashboard",{
                     headers: {
                         'token': token
                     }
                 })
                 console.log('Dashboard Response Status:', response.status) // Debug response status
                 const data = await response.json()
                 console.log('Dashboard API Response:', data) // Debug response data
                 if(data.success){
                     setInfo(data)
                     console.log('Store Details:', data.store_details) // Debug log
                 }else{
                     setError(data.message || 'Failed to load data');
                 }
             }catch (err) {
                 setError('Error connecting to server');
                 console.error(err);
             }
         }
         fetchdata()
     },[])
     useEffect(()=>{
        const fetchuserinfo = async()=>{
            try{
                const token = localStorage.getItem('token')
                const userid = localStorage.getItem('userid')
                const response = await fetch(`http://localhost:3050/users/getuser/${userid}`,{
                    method: 'GET',
                    headers:{
                        'token': token
                    }
                })
                console.log('User Info Response Status:', response.status) // Debug response status
                const data = await response.json()
                console.log('User Info Response:', data) // Debug response data
                if(data.success){
                    setUserinfo(data)
                }else{
                    setError(data.message || 'Failed to load user info')
                }
            }catch(error){
                setError('Error fetching user info')
                console.error('User info fetch error:', error)
            }
        }
        fetchuserinfo()
     },[])

     const handleUpdatePassword = async(e) =>{
         e.preventDefault()
         setError('')
         setSuccess('')
         setIsLoading(true)

         if(newpassword !== confirmpassword){
             setError('New password and confirm password do not match');
             setIsLoading(false);
             return;
         }
        

         try{
             const token = localStorage.getItem('token')
             const response = await fetch('http://localhost:3050/users/updatepassword',{
                 method: 'PUT',
                 headers:{
                     'Content-Type': 'application/json',
                     'token':`${token}`
                 },
                 body: JSON.stringify({
                     oldpassword,
                     newpassword
                 })
             })
             const data = await response.json()
             if(data.success){
                 setSuccess(data.message)
                 setOldpassword('')
                 setNewpassword('')
                 setConfirmpassword('')
             }else{
                 setError(data.message || 'Password update failed')
                 console.error('Password update failed:',data.message)
             }
         }catch(error){
             setError('Error connecting to server')
             console.error('Error connecting to backend:', error)
         }finally{
             setIsLoading(false)
         }
     }
     if (error) return <div className="text-danger">{error}</div>;
     if (!info) return <div>Loading...</div>;
     if (!userinfo) return <div>Loading user info...</div>;
     const { store_details, user_ratings } = info;
     const { data } = userinfo || { data: { name: 'Loading...', email: 'Loading...' } };

     
     return (
        <>
        <div className="owner-page">
          <Navbar role="Owner"/>
            <div className="container">
                <div className="row">
                    <div className="col-md-5 p main1">
                        <div className='main11 d-flex flex-column align-items-center'>
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="rounded-circle mb-2"
                                width="80"
                                height="80"
                                style={{ display: 'block' }}
                            />
                            <h5 className="mb-0">{data.name}</h5>
                            <small className="text-muted">{data.role}</small>
                            <p className="text-muted mb-0">{data.email}</p>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <div className='main12 px-4 py-3'>
                            <form onSubmit={handleUpdatePassword}>
                                <h6> <LockFill size={18} className="me-1" />Change Password</h6>
                                <input 
                                    type="password" 
                                    className="form-control my-3" 
                                    placeholder="Old Password" 
                                    value={oldpassword} 
                                    onChange={(e) => setOldpassword(e.target.value)}
                                    required
                                />
                                <input 
                                    type="password" 
                                    className="form-control my-3" 
                                    placeholder="New Password" 
                                    value={newpassword} 
                                    onChange={(e) => setNewpassword(e.target.value)}
                                    required
                                />
                                <input 
                                    type="password" 
                                    className="form-control my-3" 
                                    placeholder="Confirm New Password" 
                                    value={confirmpassword} 
                                    onChange={(e) => setConfirmpassword(e.target.value)}
                                    required
                                />
                                <button 
                                    className="btn btn-dark w-100" 
                                    type='submit' 
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating Password...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-6 main2">
                        <div className='container p-3  bg-white'>
                            <div className="d-flex justify-content-between align-items-start flex-wrap">
                                
                                {/* Left: Store Title and Description */}
                                <div>
                                <h5 className="d-flex align-items-center">
                                    <ShopWindow size={18} className="me-2" />
                                    {info.store_details?.storename || 'No Store Name'}
                                </h5>
                                <h6 className='text-muted'>See info and overall performance</h6>
                                </div>
                                
                                {/* Right: Ratings */}
                                <div className="d-flex">
                                <div className="me-4 text-end">
                                    <h6>Average Rating</h6>
                                    <h4 className="mb-0">{info.store_details?.average_rating} <StarFill size={20} className="text-dark" /></h4>
                                </div>
                                <div className="text-end">
                                    <h6>Total Ratings</h6>
                                    <h4 className="mb-0">{info.store_details?.total_ratings}</h4>
                                </div>
                                </div>

                            </div>
                            {/* Store Address Below */}
                            <hr />
                            <div>
                                <h6 className="fw-bold">{info.store_details?.storename}</h6>
                                <p className="text-muted mb-0">
                                   {info.store_details?.storeaddress}
                                </p>
                            </div>
                    </div>
                    <div className='main22'>
                        <div className=' p-3 bg-white'>
                             <div className='d-flex justify-content-between align-items-end flex-wrap'>
                               
                                <div className='d-flex align-items-center'>
                                   <h6 className='pt-2'>User Ratings For My Store</h6>
                                </div>
                                
                                <div className='d-flex'>
                                 <div className='text-end'>
                                     <h6 className='pt-2 text-muted'>showing all Ratings</h6>
                                 </div>
                             </div>
                             </div>
                        </div>
                        <div className="table-responsive">
                        <table className="table  table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user_ratings.map((user,index) => (
                                <tr key={index}>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_email}</td>
                                    <td>{user.rating} <StarFill size={16} className="text-dark" /></td>

                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
     )
}