import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
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
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '18px',
        height: '18px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        animation: 'float 9s ease-in-out infinite'
      }}></div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        {/* Hero Section */}
        <div className="glass" style={{
          maxWidth: '800px',
          padding: '60px 40px',
          marginBottom: '40px',
          animation: 'slideIn 1s ease-out'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            🗳️
          </div>
          
          <h1 style={{
            color: 'white',
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'fadeIn 1.2s ease-out'
          }}>
            VoteCast
          </h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.4rem',
            fontWeight: '300',
            marginBottom: '40px',
            lineHeight: '1.6',
            animation: 'fadeIn 1.4s ease-out'
          }}>
            Secure, transparent, and modern online voting system.<br />
            Cast your vote with confidence and see real-time results.
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeIn 1.6s ease-out'
          }}>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
              style={{
                padding: '15px 40px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
            >
              Get Started
            </button>
            
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '30px',
                padding: '15px 40px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          width: '100%',
          animation: 'slideIn 1.8s ease-out'
        }}>
          <div className="glass card" style={{
            padding: '30px',
            textAlign: 'center',
            animation: 'slideIn 2s ease-out'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px',
              animation: 'float 4s ease-in-out infinite'
            }}>
              🔒
            </div>
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              Secure Voting
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              Advanced encryption and authentication ensure your vote is secure and private.
            </p>
          </div>

          <div className="glass card" style={{
            padding: '30px',
            textAlign: 'center',
            animation: 'slideIn 2.2s ease-out'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px',
              animation: 'float 4s ease-in-out infinite 1s'
            }}>
              📊
            </div>
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              Live Results
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              Watch real-time voting results with beautiful visualizations and animations.
            </p>
          </div>

          <div className="glass card" style={{
            padding: '30px',
            textAlign: 'center',
            animation: 'slideIn 2.4s ease-out'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px',
              animation: 'float 4s ease-in-out infinite 2s'
            }}>
              ⚡
            </div>
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              Instant Access
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              Vote from anywhere, anytime with our responsive and user-friendly interface.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          padding: '30px',
          textAlign: 'center',
          animation: 'fadeIn 2.6s ease-out'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem',
            marginBottom: '10px'
          }}>
            Built with ❤️ for secure democratic voting
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                padding: '8px 20px',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                padding: '8px 20px',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 