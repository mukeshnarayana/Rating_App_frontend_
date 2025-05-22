import React from 'react'
import './Nav.css'
import { Person, BoxArrowRight } from 'react-bootstrap-icons';

export default function Navbar ({role}) {

     return (
        <>
          <nav className='navbar'>
            <div className='navbar-brand'>
                Store Rating
            </div>
             <ul >
                 <li>{role}</li>
                 <li>
                    <Person size={18} className="me-1" />
                    Profile
                </li>
                 <li>
                   <BoxArrowRight size={18} className="me-1" />
                    Logout
                </li>
             </ul>
          </nav>
        </>
     )
}