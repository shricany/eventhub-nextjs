import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      window.location.href = '/student-registration';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.username) {
      alert('Only students can view their events');
      window.location.href = '/dashboard';
      return;
    }
    
    setUser(parsedUser);
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students/my-events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching my events:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading your events...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Events - EventHub</title>
      </Head>
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
              My Events
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
              Events you've shown interest in or joined
            </p>
          </div>

          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
              <h3>No events yet</h3>
              <p>You haven't participated in any events yet.</p>
              <a href="/events" style={{ color: '#667eea', textDecoration: 'underline' }}>
                Browse available events
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
              {events.map((event) => (
                <div key={event.id} style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <h3 style={{ color: '#1a202c', fontSize: '1.4rem', margin: 0, flex: 1, fontWeight: '700' }}>
                      {event.name}
                    </h3>
                    <span style={{ 
                      background: event.my_status === 'joined' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
                      color: 'white', 
                      padding: '6px 16px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      textTransform: 'uppercase' 
                    }}>
                      {event.my_status === 'joined' ? '✅ Joined' : '👋 Interested'}
                    </span>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>
                      <strong style={{ color: '#1a202c' }}>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>
                      <strong style={{ color: '#1a202c' }}>Time:</strong> {event.time}
                    </p>
                    <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>
                      <strong style={{ color: '#1a202c' }}>Location:</strong> {event.location}
                    </p>
                    <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>
                      <strong style={{ color: '#1a202c' }}>Department:</strong> {event.department}
                    </p>
                    {event.my_participation_type && (
                      <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>
                        <strong style={{ color: '#1a202c' }}>Participation Type:</strong> {event.my_participation_type}
                      </p>
                    )}
                    {event.description && (
                      <p style={{ margin: '10px 0', color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                      👥 {event.interested_count || 0} Interested
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                      ✅ {event.participants_count || 0} Joined
                    </div>
                  </div>

                  {event.my_feedback && (
                    <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '15px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#16a34a', fontSize: '0.9rem', fontWeight: '600' }}>Your Feedback:</h4>
                      <p style={{ margin: 0, color: '#15803d', fontSize: '0.9rem', lineHeight: '1.5' }}>{event.my_feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}