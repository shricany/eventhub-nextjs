import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setShowProfile(false);
    router.push('/');
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const getUserType = () => {
    return user?.username ? 'Admin' : 'Student';
  };

  const getUserAvatar = () => {
    return user?.username ? '👨‍💼' : '👨‍🎓';
  };

  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '15px 0', 
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <Link href="/" style={{ 
          fontSize: '1.8rem', 
          fontWeight: '800', 
          color: 'white', 
          textDecoration: 'none',
          letterSpacing: '-0.02em'
        }}>
          EventHub
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s ease' }}>
            Home
          </Link>
          <Link href="/events" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s ease' }}>
            Events
          </Link>
          <Link href="/about" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s ease' }}>
            About
          </Link>
          <Link href="/contact" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s ease' }}>
            Contact
          </Link>
          
          {!isLoggedIn ? (
            <>
              <Link href="/student-registration" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>
                Student Login
              </Link>
              <Link href="/admin" style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '20px', 
                textDecoration: 'none', 
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease'
              }}>
                Admin
              </Link>
            </>
          ) : (
            <>
              {user?.username ? (
                <>
                  <Link href="/create-event" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>
                    Create Event
                  </Link>
                  <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link href="/my-events" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>
                  My Events
                </Link>
              )}
              
              <div style={{ position: 'relative' }}>
                <button
                  onClick={toggleProfile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '25px',
                    padding: '8px 16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{getUserAvatar()}</span>
                  <span>{user?.name || user?.username}</span>
                  <span style={{ fontSize: '0.8rem', transform: showProfile ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>▼</span>
                </button>
                
                {showProfile && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '10px',
                    background: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    minWidth: '280px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.1)',
                    zIndex: 1001
                  }}>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem' }}>{getUserAvatar()}</div>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: '700' }}>
                            {user?.name || user?.username}
                          </h4>
                          <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{getUserType()}</span>
                          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '2px' }}>
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ padding: '20px' }}>
                      {user?.department && (
                        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Department:</span>
                          <span style={{ color: '#1a202c', fontWeight: '600', fontSize: '0.9rem' }}>{user.department}</span>
                        </div>
                      )}
                      {user?.year && (
                        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Year:</span>
                          <span style={{ color: '#1a202c', fontWeight: '600', fontSize: '0.9rem' }}>{user.year}</span>
                        </div>
                      )}
                      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Account Type:</span>
                        <span style={{ color: '#1a202c', fontWeight: '600', fontSize: '0.9rem' }}>{getUserType()}</span>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;