import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5005/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Login successful');
        console.log('Token:', data.token);

        // 将 token 存储到 localStorage 中
        localStorage.setItem('token', data.token);

        // 跳转到 Dashboard 页面
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred during login');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <br></br>
        <button type="submit" className="submit-button">Login</button>
        <Link to="/register">
          <button type="button" className="register-button">Register</button>
        </Link>
        <button type="button" className="back-button" onClick={() => navigate(-1)}>Go Back</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
