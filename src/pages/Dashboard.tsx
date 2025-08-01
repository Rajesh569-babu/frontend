import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatesAPI, votingSettingsAPI } from '../services/api.ts';
import { Candidate, VotingStatus } from '../types/index.ts';
import CountdownTimer from '../components/CountdownTimer.tsx';

const Dashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingStatus, setVotingStatus] = useState<VotingStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('Dashboard - User data:', userData);
    console.log('Dashboard - Token exists:', !!token);
    
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setHasVoted(user.hasVoted);
      
      // Redirect admin users to admin page
      if (user.role === 'admin') {
        navigate('/admin');
        return;
      }
    } else {
      // No user data, redirect to login
      navigate('/login');
      return;
    }
    
    fetchCandidates();
  }, [navigate]);

  const fetchCandidates = async () => {
    try {
      const [candidatesResponse, statusResponse] = await Promise.all([
        candidatesAPI.getAllCandidates(),
        votingSettingsAPI.getVotingStatus()
      ]);
      
      // Handle both direct array response and nested data structure
      const candidatesData = Array.isArray(candidatesResponse) ? candidatesResponse : 
                           candidatesResponse?.candidates || candidatesResponse?.data || [];
      setCandidates(candidatesData);
      setVotingStatus(statusResponse);
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      setError('Failed to fetch candidates');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId: string) => {
    if (hasVoted) {
      setError('You have already voted!');
      return;
    }

    // Check if voting is allowed
    if (votingStatus && !votingStatus.canVote) {
      setError(votingStatus.message || 'Voting is currently disabled');
      return;
    }

    setVoting(candidateId);
    setError('');

    try {
      const response = await candidatesAPI.castVote(candidateId);
      setHasVoted(true);
      
      // Update candidate votes with animation
      setCandidates(prev => prev.map(candidate => {
        if (candidate._id === candidateId) {
          return { ...candidate, votes: (candidate.votes || 0) + 1 };
        }
        return candidate;
      }));

      // Show success message
      setError('Vote cast successfully!');
      setTimeout(() => {
        setError('');
      }, 3000);
    } catch (error: any) {
      console.error('Voting error:', error);
      setError(error.response?.data?.message || 'Failed to cast vote');
    } finally {
      setVoting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Floating particles */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '15px',
        height: '15px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        width: '20px',
        height: '20px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>

      <div className="glass" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px',
        animation: 'slideIn 0.8s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              🗳️ Voting Dashboard
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem'
            }}>
              Welcome, {user?.name}! {hasVoted ? 'You have voted.' : 'Cast your vote below.'}
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              padding: '12px 25px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Logout
          </button>
        </div>

        {error && (
          <div style={{
            background: hasVoted ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 0, 0, 0.1)',
            border: hasVoted ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: hasVoted ? '#4CAF50' : '#ff6b6b',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {error}
          </div>
        )}

        {/* Voting Status and Countdown */}
        {votingStatus && (
          <div className="glass" style={{
            marginBottom: '30px',
            padding: '20px',
            animation: 'slideIn 0.8s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>
                  {votingStatus.votingTitle}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem'
                }}>
                  {votingStatus.votingDescription}
                </p>
              </div>
              
              <div style={{
                textAlign: 'right'
              }}>
                <div style={{
                  color: votingStatus.canVote ? '#4CAF50' : '#DC3545',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>
                  {votingStatus.canVote ? '🟢 Voting Active' : '🔴 Voting Disabled'}
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem'
                }}>
                  {votingStatus.message}
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            {votingStatus.timeRemaining > 0 && (
              <CountdownTimer 
                deadline={votingStatus.votingDeadline}
                onExpired={() => fetchCandidates()}
              />
            )}
          </div>
        )}

        {/* Candidates Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginTop: '30px'
        }}>
                      {Array.isArray(candidates) && candidates.map((candidate, index) => (
            <div
              key={candidate._id}
              className="card glass"
              style={{
                padding: '25px',
                textAlign: 'center',
                animation: `slideIn 0.8s ease-out ${index * 0.1}s`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Candidate Photo */}
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                {candidate.photoUrl ? (
                  <img
                    src={candidate.photoUrl}
                    alt={candidate.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  '👤'
                )}
              </div>

              {/* Candidate Info */}
              <h3 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                {candidate.name}
              </h3>
              
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem',
                marginBottom: '20px',
                fontWeight: '500'
              }}>
                {candidate.position}
              </p>

              {/* Vote Count with Animation */}
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px'
              }}>
                <div className="vote-count" style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: '700',
                  marginBottom: '5px'
                }}>
                  {candidate.votes}
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem'
                }}>
                  votes
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar" style={{ marginBottom: '20px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${Array.isArray(candidates) && candidates.length > 0 ? (candidate.votes / Math.max(...candidates.map(c => c.votes || 0)) * 100) : 0}%`
                  }}
                ></div>
              </div>

              {/* Vote Button */}
              {!hasVoted ? (
                <button
                  onClick={() => handleVote(candidate._id)}
                  disabled={voting === candidate._id}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  {voting === candidate._id ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="spinner" style={{ marginRight: '10px', width: '20px', height: '20px' }}></div>
                      Casting Vote...
                    </div>
                  ) : (
                    'Vote'
                  )}
                </button>
              ) : (
                <div style={{
                  background: 'rgba(76, 175, 80, 0.2)',
                  border: '2px solid rgba(76, 175, 80, 0.5)',
                  borderRadius: '25px',
                  padding: '12px',
                  color: '#4CAF50',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  ✓ Voted
                </div>
              )}
            </div>
          ))}
        </div>

        {(!Array.isArray(candidates) || candidates.length === 0) && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.2rem'
          }}>
            No candidates available for voting.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 