import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.ts';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.message);
      setEmail('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '15px',
        height: '15px',
        background: 'rgba(255, 255, 255, 0.15)',
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
        maxWidth: '500px',
        width: '100%',
        padding: '40px',
        animation: 'slideIn 0.8s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '10px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            🔐 Forgot Password
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
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

        {message && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#4CAF50',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              color: 'white',
              fontSize: '1rem',
              marginBottom: '8px',
              display: 'block'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="input-field"
              style={{ width: '100%' }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" style={{ marginRight: '10px', width: '20px', height: '20px' }}></div>
                Sending Reset Link...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              padding: '10px 20px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Login
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '1.1rem',
            marginBottom: '10px'
          }}>
            📧 What happens next?
          </h3>
          <ul style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            textAlign: 'left',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>We'll send a secure reset link to your email</li>
            <li>The link will expire in 15 minutes</li>
            <li>Click the link to set a new password</li>
            <li>You can then log in with your new password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 