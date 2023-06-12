import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:5001/login', data);
      if (response.status === 200) {
        console.log(response)
        sessionStorage.setItem('token', response.data.jwtToken);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('loggedIn', 'true');
        navigate('/dashboard', { state: { userRole: response.data.user.userName } });
      } else {
        // Handle other status codes here (e.g., show error messages)
      }
    } catch (error) {
      console.log(error);
    }    
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('loggedIn', 'false');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className='login-screen'>
      <div class="center-box">
          <div class="animated-border-box-glow"></div>
            <div class="animated-border-box">
                <form action='' className='login-form' onSubmit={handleSubmit}>
                  <div className='login-email'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className='login-password'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <button type='submit' className='login-btn'>Login</button>
                </form>
            </div>
        </div>
    </div>
  );
}

export default Login;
