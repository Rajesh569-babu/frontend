import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.ts';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email: formData.email, password: formData.password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Navigate based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Floating particles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '20px',
        height: '20px',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '15px',
        height: '15px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '25px',
        height: '25px',
        background: 'rgba(255, 255, 255, 0.25)',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite'
      }}></div>

      <div className="glass" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        textAlign: 'center',
        animation: 'slideIn 0.8s ease-out'
      }}>
        <div style={{
          marginBottom: '30px',
          animation: 'fadeIn 1s ease-out'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '10px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            🗳️ VoteCast
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            fontWeight: '300'
          }}>
            Secure Online Voting System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 1.2s ease-out' }}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              style={{ width: '100%' }}
              autoComplete="email"
              autoFocus
              required
            />
          </div>

          <div style={{ marginBottom: '10px', position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              style={{ width: '100%', paddingRight: '50px' }}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div style={{
            textAlign: 'right',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'underline'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              color: '#ff6b6b',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" style={{ marginRight: '10px' }}></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          animation: 'fadeIn 1.5s ease-out'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            marginBottom: '10px'
          }}>
            Don't have an account?
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              padding: '10px 25px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 