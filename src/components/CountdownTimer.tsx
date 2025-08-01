import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadline: string;
  onExpired?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, onExpired, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpired?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline, onExpired]);

  if (isExpired) {
    return (
      <div className={`countdown-timer expired ${className}`}>
        <div style={{
          background: 'rgba(220, 53, 69, 0.2)',
          border: '2px solid rgba(220, 53, 69, 0.5)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          color: '#DC3545',
          fontWeight: '600',
          fontSize: '1.1rem'
        }}>
          ⏰ Voting has ended
        </div>
      </div>
    );
  }

  return (
    <div className={`countdown-timer ${className}`}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '600',
          marginBottom: '15px'
        }}>
          ⏰ Voting Ends In
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          {timeLeft.days > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '10px 15px',
              minWidth: '60px'
            }}>
              <div style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                lineHeight: '1'
              }}>
                {timeLeft.days}
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.8rem',
                marginTop: '2px'
              }}>
                Days
              </div>
            </div>
          )}
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '10px 15px',
            minWidth: '60px'
          }}>
            <div style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1'
            }}>
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
              marginTop: '2px'
            }}>
              Hours
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '10px 15px',
            minWidth: '60px'
          }}>
            <div style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1'
            }}>
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
              marginTop: '2px'
            }}>
              Minutes
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '10px 15px',
            minWidth: '60px'
          }}>
            <div style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1'
            }}>
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
              marginTop: '2px'
            }}>
              Seconds
            </div>
          </div>
        </div>
        
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          marginTop: '10px'
        }}>
          Deadline: {new Date(deadline).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer; 