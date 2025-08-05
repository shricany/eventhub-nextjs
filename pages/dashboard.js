import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState({ interested: [], joined: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      window.location.href = '/admin';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (!parsedUser.username) {
      alert('Only admins can access dashboard');
      window.location.href = '/events';
      return;
    }
    
    setUser(parsedUser);
    fetchAdminEvents();
  }, []);

  const fetchAdminEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch ALL events for admin to see and manage
      const response = await fetch('/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.message) {
        console.error('API Error:', data.message);
        alert('Error loading events: ' + data.message);
        return;
      }
      
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching admin events:', error);
      alert('Failed to load events. Please try refreshing the page.');
      setEvents([]);
    }
    setLoading(false);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/delete?eventId=${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Event deleted successfully!');
        fetchAdminEvents(); // Refresh the events list
        setSelectedEvent(null); // Clear selection
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const fetchParticipants = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}/participants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.message) {
        console.error('API Error:', data.message);
        setParticipants({ interested: [], joined: [] });
        return;
      }
      
      setParticipants(data || { interested: [], joined: [] });
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants({ interested: [], joined: [] });
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    fetchParticipants(event.id);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - EventHub</title>
      </Head>
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a202c', marginBottom: '12px' }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
              Manage your events and track participant engagement
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', height: '75vh' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', overflowY: 'auto' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '25px' }}>
                All Events ({events.length})
              </h2>

              {events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <p>No events created yet.</p>
                  <a href="/create-event" style={{ color: '#667eea', textDecoration: 'underline' }}>
                    Create your first event
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventSelect(event)}
                      style={{
                        padding: '20px',
                        border: selectedEvent?.id === event.id ? '2px solid #667eea' : '2px solid #f1f5f9',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: selectedEvent?.id === event.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        color: selectedEvent?.id === event.id ? 'white' : '#1a202c'
                      }}
                    >
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600' }}>
                        {event.name}
                      </h3>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.8 }}>
                        📅 {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.8 }}>
                        📍 {event.location}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <span style={{ fontSize: '11px', background: selectedEvent?.id === event.id ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.1)', color: selectedEvent?.id === event.id ? 'white' : '#667eea', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                            👥 {event.interested_count || 0} Interested
                          </span>
                          <span style={{ fontSize: '11px', background: selectedEvent?.id === event.id ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.1)', color: selectedEvent?.id === event.id ? 'white' : '#667eea', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                            ✅ {event.participants_count || 0} Joined
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            opacity: selectedEvent?.id === event.id ? 1 : 0.8
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', overflowY: 'auto' }}>
              {selectedEvent ? (
                <>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '30px' }}>
                    Participants for "{selectedEvent.name}"
                  </h2>

                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '4px', height: '20px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', borderRadius: '2px' }}></span>
                      Interested Students ({participants.interested.length})
                    </h3>
                    
                    {participants.interested.length === 0 ? (
                      <p style={{ color: '#64748b', fontStyle: 'italic' }}>No interested students yet.</p>
                    ) : (
                      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#1a202c', fontSize: '13px' }}>NAME</th>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#1a202c', fontSize: '13px' }}>EMAIL</th>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#1a202c', fontSize: '13px' }}>DEPARTMENT</th>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#1a202c', fontSize: '13px' }}>YEAR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants.interested.map((student, index) => (
                              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{student.name}</td>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{student.email}</td>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{student.department}</td>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{student.year}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '4px', height: '20px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '2px' }}></span>
                      Joined Students ({participants.joined.length})
                    </h3>
                    
                    {participants.joined.length === 0 ? (
                      <p style={{ color: '#64748b', fontStyle: 'italic' }}>No joined students yet.</p>
                    ) : (
                      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#1a202c', fontSize: '13px' }}>NAME</th>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#1a202c', fontSize: '13px' }}>EMAIL</th>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#1a202c', fontSize: '13px' }}>TYPE</th>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#1a202c', fontSize: '13px' }}>FEEDBACK</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants.joined.map((student, index) => (
                              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{student.name}</td>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{student.email}</td>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{student.participation_type || 'participant'}</td>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{student.feedback || 'No feedback yet'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8', fontSize: '1.1rem', textAlign: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '15px', border: '2px dashed #e2e8f0' }}>
                  Select an event to view participants
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}