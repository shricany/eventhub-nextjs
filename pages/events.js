import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading events...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Events - EventHub</title>
      </Head>
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
              Campus Events
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
              Discover and participate in exciting campus events
            </p>
          </div>

          {!user && (
            <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', padding: '15px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#856404' }}>
                Please <a href="/student-registration" style={{ color: '#667eea' }}>login as a student</a> or <a href="/admin" style={{ color: '#667eea' }}>admin</a> to interact with events.
              </p>
            </div>
          )}

          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
              <h3>No events available</h3>
              <p>Check back later for new events!</p>
              {user?.username && (
                <a href="/create-event" style={{ color: '#667eea', textDecoration: 'underline' }}>
                  Create your first event
                </a>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
              {events.map((event) => (
                <div key={event.id} style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <h3 style={{ color: '#1a202c', fontSize: '1.4rem', margin: 0, flex: 1, fontWeight: '700' }}>
                      {event.name}
                    </h3>
                    <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                      {event.department}
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
                      <strong style={{ color: '#1a202c' }}>Registration Deadline:</strong> {new Date(event.registration_deadline).toLocaleDateString()}
                    </p>
                    {event.award && (
                      <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>
                        <strong style={{ color: '#1a202c' }}>Award:</strong> {event.award}
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

                  {user && !user.username && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ flex: 1, padding: '12px 16px', fontSize: '14px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: 'white' }}>
                        Show Interest
                      </button>
                      <button style={{ flex: 1, padding: '12px 16px', fontSize: '14px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                        Join Event
                      </button>
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