import React,{useState,useEffect} from 'react'
import Navbar from './components/Navbar/Nvbar'
import { FaSearch, FaStar} from 'react-icons/fa'
import Footer from './components/Footer/Footer'

export default function User (){
    const[oldpassword,setOldpassword] = useState('')
    const[newpassword,setNewpassword] = useState('')
    const[confirmpassword,setConfirmpassword] = useState('')
    const[error,setError] = useState('')
    const[success,setSuccess] = useState('')
    const[isLoading,setIsLoading] = useState(false)
    const[stores,setStores] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [rating, setRating] = useState(0)
    const [userRatings, setUserRatings] = useState([])

    useEffect(()=>{
        fetchAllStores()
        fetchUserRatings()
    },[])

    useEffect(()=>{
        if(success){
            const timer = setTimeout(()=>{
                setSuccess()
            },3000)
            return(()=> clearTimeout(timer))
        }
    })
    const handleUpdatePassword = async(e) =>{
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        // Validate passwords match
        if(newpassword !== confirmpassword) {
            setError('New password and confirm password do not match')
            setIsLoading(false)
            return
        }

        try{
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3050/users/updatepassword',{
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'token': ` ${token}`
                },
                body: JSON.stringify({
                    oldpassword,
                    newpassword
                })
            })
            const data = await response.json()
            if(response.ok){
                setSuccess(data.message || 'Password updated successfully')
                setOldpassword('')
                setNewpassword('')
                setConfirmpassword('')
            }else{
                setError(data.message || 'Password update failed')
            }
        }catch(error){
            setError('Error connecting to server')
            console.error('Error connecting to backend:', error)
        }finally{
            setIsLoading(false)
        }
    }
    const fetchAllStores = async() => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3050/stores/getallstores', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            })
            const result = await response.json()
            if(result.success) {
                setStores(result.data)
            } else {
                setError(result.message || 'Failed to fetch stores')
            }
        } catch(error) {
            console.error('Error fetching stores:', error)
            setError('Error fetching stores')
        }
    }

    const filterStores = async (query) => {
        if (!query) {
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
                    storename: query,
                    address: query
                })
            })
            const data = await response.json()
            console.log('Filter response:', data)
            
            if (data.success) {
                setStores(data.data)
                if (data.data && data.data.length > 0) {
                    setSuccess('Stores found successfully')
                } else {
                    setSuccess('No stores found matching the search')
                }
            } else {
                setSuccess(data.message || 'Failed to search stores')
            }
        } catch (error) {
            console.error('Error searching stores:', error)
            setError('Error searching stores')
        }
    }

    const fetchUserRatings = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3050/ratings/getuserratings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            })
            const result = await response.json()
            if (result.success) {
                setUserRatings(result.data)
            } else {
                setError(result.message || 'Failed to fetch user ratings')
            }
        } catch (error) {
            console.error('Error fetching user ratings:', error)
            setError('Error fetching user ratings')
        }
    }

    const handleRating = async(storeId) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3050/ratings/submitrating/${storeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({
                    rating
                })
            })
            const result = await response.json()
            if(result.success) {
                setSuccess(result.message || 'Rating submitted successfully')
                // Refresh both stores and user ratings
                fetchAllStores()
                fetchUserRatings()
            } else {
                setError(result.message || 'Failed to submit rating')
            }
        } catch(error) {
            console.error('Error rating store:', error)
            setError('Error rating store')
        }
    }

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setError('');
        setSuccess('');
        filterStores(value);
    };

    return (
        <>
         <Navbar role="user"/>
          <div className='user page '>
             <div className='container-fluid mt-5 px-5 '>
                <div className='row g-4'>
                    <div className='col-md-3 shadow-sl p-4 rounded-4 ' style={{backgroundColor: '#ffff',height:'55vh'}}>
                        <div className='' style={{backgroundColor: '#ffff'}}>
                              <div style={{backgroundColor: '#ffff'}}>
                                    <h5 className='mb-0'style={{backgroundColor: '#ffff'}}>Update Password</h5>
                                    <p className='mb-0' style={{color: '#8f97af',backgroundColor: '#ffff'}}>Change your account password below.</p>
                              </div>
                                {error && <div className='alert alert-danger mt-3'>{error}</div>}
                                {success && <div className='alert alert-success mt-3'>{success}</div>}
                              <form onSubmit={handleUpdatePassword} style={{backgroundColor: '#ffff'}}>
                                  <div className='updateform mt-3' style={{backgroundColor: '#ffff'}}>
                                      <div style={{backgroundColor: '#ffff'}}>
                                          <p style={{backgroundColor: '#ffff'}} className='mb-0'>Old Password</p>
                                             <input type="password" className='form-control' placeholder='Old Password' value={oldpassword} onChange={(e)=>setOldpassword(e.target.value)} required/>
                                      </div>
                                   </div>
                                   <div className='updateform mt-3' style={{backgroundColor: '#ffff'}}>
                                       <div style={{backgroundColor: '#ffff'}}>
                                           <p style={{backgroundColor: '#ffff'}} className='mb-0'>New Password</p>
                                              <input type="password" className='form-control' placeholder='New Password' value={newpassword} onChange={(e)=>setNewpassword(e.target.value)} required/>
                                       </div>
                                   </div>
                                   <div className='updateform mt-3' style={{backgroundColor: '#ffff'}}>
                                       <div style={{backgroundColor: '#ffff'}}>
                                           <p style={{backgroundColor: '#ffff'}} className='mb-0'>Confirm Password</p>
                                              <input type="password" className='form-control' placeholder='Confirm Password' value={confirmpassword} onChange={(e)=>setConfirmpassword(e.target.value)} required/>
                                       </div>
                                   </div>
                                   <div className='updateform mt-3' style={{backgroundColor: '#ffff'}}>
                                       <div style={{backgroundColor: '#ffff'}}>
                                           <button className="btn btn-dark w-100" type='submit' disabled={isLoading}> {isLoading ? 'Updating Password...' : 'Update Password'} </button>
                                       </div>
                                    </div>
                              </form>
                        </div>
                    </div>
                    <div className='col-md-9 px-5'>
                        <div className=' shadow-sl p-4 rounded-4' style={{backgroundColor: '#ffff'}}>  
                        <div className='row align-items-end' style={{ backgroundColor: '#ffff' }}>
                            <div className='col-md-6' style={{ backgroundColor: '#ffff' }}>
                                <div style={{ backgroundColor: '#ffff' }}>
                                <h2 style={{ backgroundColor: '#ffff' }}>Stores</h2>
                                <p style={{ backgroundColor: '#ffff' }}>Browse and rate your favorite stores.</p>
                                </div>
                            </div>
                            <div className='col-md-6 text-end' style={{ backgroundColor: '#ffff' }}>
                                <div style={{ backgroundColor: '#ffff' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder= "Search by Name or Address"
                                    style={{ maxWidth: '300px', display: 'inline-block' }}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            </div>
                               <div className='container mt-3'style={{ backgroundColor: '#ffff' }}>
                               {stores.map((store, index) => (
                                <div className='row mb-3' key={store.id} style={{ backgroundColor: '#ffff' }}>
                                    <div className='col-md-6' style={{ backgroundColor: '#ffff' }}>
                                    <div style={{ backgroundColor: '#ffff' }}>
                                        <h5 className='mb-1' style={{ backgroundColor: '#ffff' }}>{store.storename}</h5>
                                        <p className='mb-1' style={{ backgroundColor: '#ffff', color: '#727d89' }}>{store.storeaddress}</p>
                                        <p className='mb-1' style={{ backgroundColor: '#ffff', color: '#727d89' }}>
                                        Overall Rating: <FaStar color='black' style={{ backgroundColor: '#ffff' }} /> {store.overallrating}
                                        </p>
                                    </div>
                                    </div>
                                    <div className='col-md-6 text-end' style={{ backgroundColor: '#ffff' }}>
                                    <div style={{ backgroundColor: '#ffff' }}>
                                        <h6 style={{ backgroundColor: '#ffff' }}>
                                        Your Rating: <FaStar style={{ backgroundColor: '#ffff' }} /> {
                                            userRatings.find(r => r.storeid === store.id)?.rating || 'Not rated'
                                        }{' '}
                                        <button className="btn btn-outline-secondary btn-sm">Edit</button>
                                        </h6>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-end gap-2" style={{ backgroundColor: '#ffff' }}>
                                        <label className="mb-0" style={{ backgroundColor: '#ffff' }}>Rate:</label>
                                        <select className="form-select form-select-sm" style={{ width: '70px' }} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <option key={val} value={val}>{val}</option>
                                        ))}
                                        </select>
                                        <button className="btn btn-dark btn-sm" onClick={() => handleRating(store.id)}>Submit</button>
                                    </div>
                                    </div>
                                </div>
                                ))}

                               </div>
                            </div>
                            <hr color='black'/>
                        </div>
                    </div>
                </div>
             </div>
             <Footer/>
          </div>
        </>
    )
}
