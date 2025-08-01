import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatesAPI, votingSettingsAPI } from '../services/api.ts';
import { Candidate, VotingSettings, VotingStatus } from '../types/index.ts';
import CountdownTimer from '../components/CountdownTimer.tsx';

const Admin: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    photoUrl: ''
  });
  const [editData, setEditData] = useState({
    id: '',
    name: '',
    position: '',
    photoUrl: ''
  });
  const [votingSettings, setVotingSettings] = useState<VotingSettings | null>(null);
  const [votingStatus, setVotingStatus] = useState<VotingStatus | null>(null);
  const [showVotingForm, setShowVotingForm] = useState(false);
  const [votingFormData, setVotingFormData] = useState({
    votingDeadline: '',
    votingTitle: 'Student Council Election',
    votingDescription: 'Vote for your preferred candidates'
  });
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('Admin component - User data:', userData);
    console.log('Admin component - Token exists:', !!token);
    
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      if (user.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
    } else {
      // No user data, redirect to login
      navigate('/login');
      return;
    }
    
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [candidatesResponse, resultsResponse, settingsResponse, statusResponse] = await Promise.all([
        candidatesAPI.getAllCandidates(),
        candidatesAPI.getResults(),
        votingSettingsAPI.getVotingSettings(),
        votingSettingsAPI.getVotingStatus()
      ]);
      
      console.log('Candidates response:', candidatesResponse);
      console.log('Results response:', resultsResponse);
      console.log('Settings response:', settingsResponse);
      console.log('Status response:', statusResponse);
      
      // Ensure candidates is always an array
      const candidatesData = Array.isArray(candidatesResponse) ? candidatesResponse : 
                           candidatesResponse?.candidates || candidatesResponse?.data || [];
      
      // Ensure results is always an array
      const resultsData = Array.isArray(resultsResponse) ? resultsResponse : 
                         resultsResponse?.results || resultsResponse?.candidates || resultsResponse?.data || [];
      
      console.log('Processed candidates:', candidatesData);
      console.log('Processed results:', resultsData);
      
      setCandidates(candidatesData);
      setResults(resultsData);
      setVotingSettings(settingsResponse);
      setVotingStatus(statusResponse);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      // Set empty arrays on error to prevent map errors
      setCandidates([]);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    setSuccess('');

    try {
      const response = await candidatesAPI.addCandidate(formData);
      setSuccess(response.message || 'Candidate added successfully!');
      setFormData({ name: '', position: '', photoUrl: '' });
      fetchData();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add candidate');
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setEditData({
      id: candidate._id,
      name: candidate.name,
      position: candidate.position,
      photoUrl: candidate.photoUrl || ''
    });
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(true);
    setError('');
    setSuccess('');

    try {
      const response = await candidatesAPI.updateCandidate(editData.id, {
        name: editData.name,
        position: editData.position,
        photoUrl: editData.photoUrl
      });
      setSuccess('Candidate updated successfully!');
      setEditing(false);
      setEditData({ id: '', name: '', position: '', photoUrl: '' });
      fetchData();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update candidate');
    }
  };

  const handleDelete = async (candidateId: string) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    setDeleting(candidateId);
    setError('');
    setSuccess('');

    try {
      await candidatesAPI.deleteCandidate(candidateId);
      setSuccess('Candidate deleted successfully!');
      fetchData();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete candidate');
    } finally {
      setDeleting(null);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditData({ id: '', name: '', position: '', photoUrl: '' });
    setError('');
    setSuccess('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleVotingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVotingFormData({
      ...votingFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateVotingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await votingSettingsAPI.updateVotingSettings(votingFormData);
      setSuccess('Voting settings updated successfully!');
      setShowVotingForm(false);
      fetchData();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update voting settings');
    }
  };

  const handleToggleVoting = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await votingSettingsAPI.toggleVoting();
      setSuccess(response.message);
      fetchData();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to toggle voting status');
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
        top: '8%',
        left: '8%',
        width: '18px',
        height: '18px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '12%',
        width: '16px',
        height: '16px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        animation: 'float 9s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '15%',
        width: '22px',
        height: '22px',
        background: 'rgba(255, 255, 255, 0.25)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>

      <div className="glass" style={{
        maxWidth: '1400px',
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
              🏛️ Admin Dashboard
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem'
            }}>
              Welcome, {user?.name}! Manage candidates and view live results.
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

        {/* Voting Deadline Management */}
        <div className="glass" style={{
          marginBottom: '30px',
          padding: '25px',
          animation: 'slideIn 0.8s ease-out'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
              ⏰ Voting Deadline Management
            </h2>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setShowVotingForm(!showVotingForm)}
                style={{
                  background: 'rgba(255, 193, 7, 0.2)',
                  border: '2px solid rgba(255, 193, 7, 0.5)',
                  borderRadius: '25px',
                  padding: '10px 20px',
                  color: '#FFC107',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 193, 7, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 193, 7, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {showVotingForm ? 'Cancel' : '⚙️ Configure Deadline'}
              </button>
              
              <button
                onClick={handleToggleVoting}
                style={{
                  background: votingStatus?.canVote ? 'rgba(220, 53, 69, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                  border: `2px solid ${votingStatus?.canVote ? 'rgba(220, 53, 69, 0.5)' : 'rgba(76, 175, 80, 0.5)'}`,
                  borderRadius: '25px',
                  padding: '10px 20px',
                  color: votingStatus?.canVote ? '#DC3545' : '#4CAF50',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = votingStatus?.canVote ? 'rgba(220, 53, 69, 0.3)' : 'rgba(76, 175, 80, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = votingStatus?.canVote ? 'rgba(220, 53, 69, 0.2)' : 'rgba(76, 175, 80, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {votingStatus?.canVote ? '🛑 Disable Voting' : '✅ Enable Voting'}
              </button>
            </div>
          </div>

          {/* Current Status */}
          {votingStatus && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
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
            </div>
          )}

          {/* Countdown Timer */}
          {votingStatus && votingStatus.timeRemaining > 0 && (
            <CountdownTimer 
              deadline={votingStatus.votingDeadline}
              onExpired={() => fetchData()}
            />
          )}

          {/* Voting Settings Form */}
          {showVotingForm && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '25px',
              marginTop: '20px'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '1.4rem',
                fontWeight: '600',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                ⚙️ Configure Voting Settings
              </h3>

              <form onSubmit={handleUpdateVotingSettings}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    color: 'white',
                    fontSize: '1rem',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Voting Title
                  </label>
                  <input
                    type="text"
                    name="votingTitle"
                    placeholder="Enter voting title"
                    value={votingFormData.votingTitle}
                    onChange={handleVotingFormChange}
                    className="input-field"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    color: 'white',
                    fontSize: '1rem',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Voting Description
                  </label>
                  <textarea
                    name="votingDescription"
                    placeholder="Enter voting description"
                    value={votingFormData.votingDescription}
                    onChange={handleVotingFormChange}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '15px',
                      color: 'white',
                      fontSize: '16px',
                      width: '100%',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{
                    color: 'white',
                    fontSize: '1rem',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Voting Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="votingDeadline"
                    value={votingFormData.votingDeadline}
                    onChange={handleVotingFormChange}
                    className="input-field"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '15px'
                }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    Update Settings
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowVotingForm(false)}
                    style={{
                      flex: 1,
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
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Messages */}
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

        {success && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#4CAF50',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {success}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginTop: '30px'
        }}>
          {/* Add Candidate Form */}
          <div className="glass" style={{
            padding: '25px',
            animation: 'slideIn 0.8s ease-out'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ➕ Add New Candidate
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Candidate Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={formData.position}
                  onChange={handleChange}
                  className="input-field"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <input
                  type="url"
                  name="photoUrl"
                  placeholder="Photo URL (Optional)"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={adding}
              >
                {adding ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner" style={{ marginRight: '10px', width: '20px', height: '20px' }}></div>
                    Adding Candidate...
                  </div>
                ) : (
                  'Add Candidate'
                )}
              </button>
            </form>
          </div>

          {/* Edit Candidate Form */}
          {editing && (
            <div className="glass" style={{
              padding: '25px',
              animation: 'slideIn 0.8s ease-out',
              marginTop: '30px'
            }}>
              <h2 style={{
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                ✏️ Edit Candidate
              </h2>

              <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Candidate Name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="input-field"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    name="position"
                    placeholder="Position"
                    value={editData.position}
                    onChange={handleEditChange}
                    className="input-field"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <input
                    type="url"
                    name="photoUrl"
                    placeholder="Photo URL (Optional)"
                    value={editData.photoUrl}
                    onChange={handleEditChange}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '15px'
                }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    disabled={editing}
                  >
                    {editing ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="spinner" style={{ marginRight: '10px', width: '20px', height: '20px' }}></div>
                        Updating...
                      </div>
                    ) : (
                      'Update Candidate'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      flex: 1,
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
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Live Results */}
          <div className="glass" style={{
            padding: '25px',
            animation: 'slideIn 0.8s ease-out 0.2s'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              📊 Live Results
            </h2>

            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {Array.isArray(results) && results.map((result, index) => (
                <div
                  key={result._id}
                  className="card"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '15px',
                    animation: `slideIn 0.6s ease-out ${index * 0.1}s`,
                    border: index === 0 ? '2px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: index === 0 ? '2px solid gold' : '2px solid rgba(255, 255, 255, 0.3)'
                      }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤'}
                      </div>
                      <div>
                        <h3 style={{
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: '600',
                          marginBottom: '5px'
                        }}>
                          {result.name}
                        </h3>
                        <p style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.9rem'
                        }}>
                          {result.position}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div className="vote-count" style={{
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '5px'
                      }}>
                        {result.votes}
                      </div>
                      <div style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem'
                      }}>
                        {result.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${result.percentage}%`,
                        background: index === 0 ? 'linear-gradient(90deg, #FFD700, #FFA500)' : 
                                  index === 1 ? 'linear-gradient(90deg, #C0C0C0, #A9A9A9)' :
                                  index === 2 ? 'linear-gradient(90deg, #CD7F32, #B8860B)' :
                                  'linear-gradient(90deg, #4CAF50, #45a049)'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {(!Array.isArray(results) || results.length === 0) && (
              <div style={{
                textAlign: 'center',
                padding: '30px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.1rem'
              }}>
                No voting results available yet.
              </div>
            )}
          </div>
        </div>

        {/* All Candidates List */}
        <div className="glass" style={{
          marginTop: '30px',
          padding: '25px',
          animation: 'slideIn 0.8s ease-out 0.4s'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            👥 All Candidates
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {Array.isArray(candidates) && candidates.map((candidate, index) => (
              <div
                key={candidate._id}
                className="card glass"
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  animation: `slideIn 0.6s ease-out ${index * 0.1}s`
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 15px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
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

                <h3 style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {candidate.name}
                </h3>
                
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  marginBottom: '15px'
                }}>
                  {candidate.position}
                </p>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px',
                  marginBottom: '15px'
                }}>
                  <div className="vote-count" style={{
                    color: 'white',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    marginBottom: '3px'
                  }}>
                    {candidate.votes}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.8rem'
                  }}>
                    votes
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => handleEdit(candidate)}
                    style={{
                      background: 'rgba(255, 193, 7, 0.2)',
                      border: '1px solid rgba(255, 193, 7, 0.5)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#FFC107',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 193, 7, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 193, 7, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ✏️ Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(candidate._id)}
                    disabled={deleting === candidate._id}
                    style={{
                      background: 'rgba(220, 53, 69, 0.2)',
                      border: '1px solid rgba(220, 53, 69, 0.5)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#DC3545',
                      cursor: deleting === candidate._id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      opacity: deleting === candidate._id ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (deleting !== candidate._id) {
                        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deleting !== candidate._id) {
                        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {deleting === candidate._id ? (
                      <>
                        <div className="spinner" style={{ width: '12px', height: '12px' }}></div>
                        Deleting...
                      </>
                    ) : (
                      '🗑️ Delete'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {candidates.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '30px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.1rem'
            }}>
              No candidates added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin; 