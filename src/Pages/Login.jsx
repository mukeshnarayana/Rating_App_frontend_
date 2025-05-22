import React, { useState } from 'react'
import './Login.css'
import { BoxArrowRight } from 'react-bootstrap-icons'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:3050/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login success:', data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userid',data.userid)
                localStorage.setItem('userid', data.userid);

                const role = data.role?.toLowerCase(); // Protect from undefined/null
            
                if (role === 'owner') {
                    window.location.href = '/owner';
                } 
                if (role === 'admin') {
                    window.location.href = '/admin';
                } 
                if(role === 'user') {
                    window.location.href = '/user';
                }
            } else {
                setError(data.message || 'Login failed');
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            setError('Error connecting to server');
            console.error('Error connecting to backend:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className='main'>
                <div className='submain'>
                    <div className='login'>
                        <h5><BoxArrowRight size={18} className="me-1" />Login</h5>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handleLogin}>
                        <input 
                            type='email' 
                            placeholder='Email' 
                            className="form-control my-3" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input 
                            type='password' 
                            placeholder='Password' 
                            className="form-control my-3" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            className='btn btn-dark w-100' 
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}