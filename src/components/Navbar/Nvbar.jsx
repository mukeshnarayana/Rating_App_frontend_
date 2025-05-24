import React, { useState, useEffect } from 'react'
import './Nav.css'
import { Person, BoxArrowRight } from 'react-bootstrap-icons';
import { Modal } from 'react-bootstrap';


export default function Navbar ({role}) {
   const [showProfileModal, setShowProfileModal] = useState(false);
   const [user, setUser] = useState(null);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const handleClose = () => setShowProfileModal(false);
   const handleShow = () => setShowProfileModal(true);
  

   useEffect(() => {
      if (success) {
          const timer = setTimeout(() => {
              setSuccess('')
          }, 3000)
          return () => clearTimeout(timer)
      }
  }, [success])
   useEffect(() => {
       const fetchuser = async() => {
            try {
               const token = localStorage.getItem('token');
               const userid = localStorage.getItem('userid');
               if (!token || !userid) {
                   setError('No token or user ID found');
                   return;
               }

               const response = await fetch(`http://localhost:3050/users/getuser/${userid}`, {
                   method: 'GET',
                   headers: {
                       'content-type': 'application/json',
                       'token': token
                   }
               });
               const result = await response.json();
               if (result.success) {
                  setUser(result.data);
                  setSuccess('User data fetched successfully');
               } else {
                  setError(result.message || 'Failed to fetch user data');
               }
            } catch(error) {
               console.error('Error fetching user data:', error);
               setError('Error fetching user data');
            }
       };
       
       fetchuser();
   }, []); // Empty dependency array to run only once on mount

   const handlelogout = async()=>{
      try{
          const token = localStorage.getItem('token');
          if (!token) {
              console.error('No token found');
              window.location.href = '/login';
              return;
          }
          
          await fetch('http://localhost:3050/users/logout',{
              method: 'POST',
              headers:{
                  'Content-Type': 'application/json',
                  'token': token// Ensure no extra spaces
              }
          })
      }catch(error){
         console.error('Logout Error:',error)
      }
      // Clear the token from localStorage
      localStorage.removeItem("token");
      // Redirect to login page
      window.location.href = '/login';
   }

     return (
        <>
          <nav className='navbar' style={{backgroundColor: '#ffff'}}>
            <div className='navbar-brand' style={{backgroundColor: '#ffff'}}>
                Store Rating
            </div>
             <ul style={{backgroundColor: '#ffff'}}>
                 <li style={{backgroundColor: '#f3f4f6', width: '10vh'}} className='text-center'>{role}</li>
                 <li style={{backgroundColor: '#ffff'}} onClick={handleShow}>
                    <Person size={18} className="me-1" style={{backgroundColor: '#ffff'}}/>
                    Profile
                </li>
                 <li onClick={handlelogout} style={{backgroundColor: '#ffff'}}>
                   <button className="btn btn-outline btn-sm"><BoxArrowRight size={18} className="me-1" style={{backgroundColor: '#ffff'}}/>Logout</button>
                </li>
             </ul>
          </nav>

          <Modal
            show={showProfileModal}
            onHide={handleClose}
            centered
            className="profile-modal"
            dialogClassName="modal-dialog modal-dialog-centered"
          >
            <Modal.Header closeButton>
              <Modal.Title>Profile Information</Modal.Title>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
            </Modal.Header>
            <Modal.Body>
              <div className="profile-content">
                 {user ? (
                   <>
                     <div>
                          <h4>Name</h4>
                          <p style={{fontStyle:'italic'}}>{user.name}</p>
                     </div>
                     <div>
                          <h4>Email</h4>
                          <p style={{fontStyle:'italic'}}>{user.email}</p>
                     </div>
                     <div>
                          <h4>Address</h4>
                          <p style={{fontStyle:'italic'}}>{user.address}</p>
                     </div>
                     <div>
                          <h4>Role</h4>
                          <p style={{fontStyle:'italic'}}>{user.role}</p>
                     </div>
                   </>
                 ) : (
                   <p>Loading user data...</p>
                 )}
              </div>
            </Modal.Body>
          </Modal>
        </>
     )
}