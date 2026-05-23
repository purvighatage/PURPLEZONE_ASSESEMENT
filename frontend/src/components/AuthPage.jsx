import React, { useState } from 'react';

function AuthPage({ onSubmit, error }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!username.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setLocalError('Username must be at least 3 characters long');
      return;
    }

    if (isRegister) {
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters long');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setLocalError('Password must contain at least one uppercase letter');
        return;
      }
      if (!/[a-z]/.test(password)) {
        setLocalError('Password must contain at least one lowercase letter');
        return;
      }
      if (!/\d/.test(password)) {
        setLocalError('Password must contain at least one number');
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setLocalError('Password must contain at least one special character (e.g. !@#$%^&*)');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
    } else {
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(username.trim(), password, isRegister);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FFFFFF', // Clean base background
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* ==========================================
          SPLIT-SCREEN RESPONSIVE BACKGROUND
         ========================================== */}
      <div className="split-bg-container">
        <div className="split-bg-left" />
        <div className="split-bg-right" />
      </div>

      {/* ==========================================
          TOP WHITE HEADER BAR WITH LOGO
         ========================================== */}
      <div 
        style={{
          width: '100%',
          height: '60px',
          background: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2.5rem',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 100
        }}
      >
        <img 
          src="/purplezonewt 1.png" 
          alt="PurpleZone Logo" 
          style={{
            height: '24px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'hue-rotate(280deg) brightness(0.3)'
          }}
        />
      </div>

      {/* ==========================================
          THE FLOATING LOGIN CARD
         ========================================== */}
      <div 
        className="glass-panel-auth"
        style={{
          position: 'absolute',
          top: '54%', // Centers vertically
          background: '#FFFFFF', // Clean white Figma floating card
          borderRadius: '12px',
          padding: '4.5rem 3rem',
          minHeight: '540px', // Increased vertical size for premium, spacious feel
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 20px 40px -10px rgba(94, 47, 116, 0.15)', // Premium multi-layered shadow
          border: '1px solid rgba(255, 255, 255, 0.85)', // Subtle glossy rim
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}
      >
        {/* TAB-STYLE HEADER: REGISTER | LOGIN */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.75rem',
            width: '100%'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setLocalError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: isRegister ? '#5E2F74' : '#A0AEC0', // plum-violet active vs slate-gray inactive
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'color 0.25s'
            }}
          >
            Register
          </button>
          
          <span style={{ fontSize: '1.2rem', color: '#CBD5E0', userSelect: 'none' }}>|</span>

          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setLocalError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: !isRegister ? '#5E2F74' : '#A0AEC0',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'color 0.25s'
            }}
          >
            Login
          </button>
        </div>

        {/* Error Banner */}
        {(error || localError) && (
          <div 
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#EF4444',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            {localError || error}
          </div>
        )}

        {/* Form Fields */}
        <form 
          onSubmit={handleSubmit} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            flex: 1,
            gap: '2rem'
          }}
        >
          {/* Inputs Group - Centered vertically in the form area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', justifyContent: 'center', flex: 1 }}>
            
            {/* Username Flat Input */}
            <div style={{ position: 'relative' }}>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{
                  width: '100%',
                  border: 'none',
                  borderBottom: '1px solid #E2E8F0',
                  padding: '0.85rem 0.5rem', // Clean padding, no indent, matching mockup exactly
                  fontSize: '0.95rem',
                  color: '#2D3748',
                  background: 'transparent',
                  outline: 'none',
                  transition: 'border-bottom 0.25s'
                }}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #5E2F74'}
                onBlur={(e) => e.target.style.borderBottom = '1px solid #E2E8F0'}
                disabled={loading}
              />
            </div>

            {/* Password Flat Input */}
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: '100%',
                  border: 'none',
                  borderBottom: '1px solid #E2E8F0',
                  padding: '0.85rem 0.5rem',
                  fontSize: '0.95rem',
                  color: '#2D3748',
                  background: 'transparent',
                  outline: 'none',
                  transition: 'border-bottom 0.25s'
                }}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #5E2F74'}
                onBlur={(e) => e.target.style.borderBottom = '1px solid #E2E8F0'}
                disabled={loading}
              />
            </div>

            {/* Confirm Password (Only in Register Mode) */}
            {isRegister && (
              <div className="fade-in" style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1px solid #E2E8F0',
                    padding: '0.85rem 0.5rem',
                    fontSize: '0.95rem',
                    color: '#2D3748',
                    background: 'transparent',
                    outline: 'none',
                    transition: 'border-bottom 0.25s'
                  }}
                  onFocus={(e) => e.target.style.borderBottom = '2px solid #5E2F74'}
                  onBlur={(e) => e.target.style.borderBottom = '1px solid #E2E8F0'}
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Centered Submit Button - Positioned beautifully at the bottom */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              style={{
                background: '#E2E8F0', // Soft gray Figma button matching mockup exactly
                color: '#4A5568', // Dark slate text
                border: 'none',
                borderRadius: '8px', // Rounded corners matching mockup exactly
                padding: '0.75rem 3.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#CBD5E0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#E2E8F0';
                e.target.style.transform = 'translateY(0)';
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AuthPage;
