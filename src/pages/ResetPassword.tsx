import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api.ts';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setError('Invalid reset link. Please request a new password reset.');
        setVerifying(false);
        return;
      }

      try {
        await authAPI.verifyResetToken(email, token);
        setTokenValid(true);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Invalid or expired reset link. Please request a new password reset.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.resetPassword({
        email: email!,
        token: token!,
        password: formData.password
      });
      
      setMessage(response.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="glass" style={{
          padding: '40px',
          textAlign: 'center'
        }}>
          <div className="spinner" style={{ marginBottom: '20px' }}></div>
          <p style={{
            color: 'white',
            fontSize: '1.1rem'
          }}>
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="glass" style={{
          maxWidth: '500px',
          width: '100%',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '2rem',
            marginBottom: '20px'
          }}>
            ❌ Invalid Reset Link
          </h1>
          
          <div style={{
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#ff6b6b'
          }}>
            {error}
          </div>
          
          <button
            onClick={() => navigate('/forgot-password')}
            className="btn-primary"
            style={{ marginRight: '10px' }}
          >
            Request New Reset Link
          </button>
          
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              padding: '10px 20px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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
            🔐 Reset Password
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Enter your new password below.
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
            <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              Redirecting to login page...
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'white',
              fontSize: '1rem',
              marginBottom: '8px',
              display: 'block'
            }}>
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your new password"
              className="input-field"
              style={{ width: '100%' }}
              required
              minLength={6}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              color: 'white',
              fontSize: '1rem',
              marginBottom: '8px',
              display: 'block'
            }}>
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              className="input-field"
              style={{ width: '100%' }}
              required
              minLength={6}
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
                Resetting Password...
              </div>
            ) : (
              'Reset Password'
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
            🔒 Password Requirements
          </h3>
          <ul style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            textAlign: 'left',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Password must be at least 6 characters long</li>
            <li>Use a combination of letters, numbers, and symbols</li>
            <li>Make sure both password fields match</li>
            <li>Your new password will be active immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 