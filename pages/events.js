import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});

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

  const handleInterest = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}/interest`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Interest recorded successfully!');
        fetchEvents();
      } else {
        alert('Failed to record interest');
      }
    } catch (error) {
      console.error('Error showing interest:', error);
      alert('Error showing interest');
    }
  };

  const handleJoin = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participation_type: 'participant' })
      });
      
      if (response.ok) {
        alert('Successfully joined the event!');
        fetchEvents();
      } else {
        alert('Failed to join event');
      }
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Error joining event');
    }
  };

  const fetchComments = async (eventId) => {
    try {
      console.log('Fetching comments for event:', eventId);
      const response = await fetch(`/api/events/comments?eventId=${eventId}`);
      if (response.ok) {
        const eventComments = await response.json();
        console.log('Comments received:', eventComments);
        setComments(prev => ({ ...prev, [eventId]: eventComments }));
      } else {
        console.error('Failed to fetch comments:', response.status);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const toggleComments = (eventId) => {
    setShowComments(prev => ({ ...prev, [eventId]: !prev[eventId] }));
    if (!comments[eventId]) {
      fetchComments(eventId);
    }
  };

  const handleAddComment = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const comment = newComment[eventId];
      
      if (!comment || comment.trim().length === 0) {
        alert('Please enter a comment');
        return;
      }

      if (!token) {
        alert('Please login to comment');
        return;
      }

      const response = await fetch(`/api/events/comments?eventId=${eventId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: comment.trim() })
      });

      if (response.ok) {
        setNewComment(prev => ({ ...prev, [eventId]: '' }));
        // Wait a moment then refresh comments
        setTimeout(() => {
          fetchComments(eventId);
        }, 500);
        alert('Comment added successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment');
    }
  };

  const handleDeleteComment = async (commentId, eventId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/comments/delete?commentId=${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Comment deleted successfully!');
        fetchComments(eventId);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    }
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
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                      <button 
                        onClick={() => handleInterest(event.id)}
                        style={{ flex: 1, padding: '12px 16px', fontSize: '14px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: 'white' }}
                      >
                        Show Interest
                      </button>
                      <button 
                        onClick={() => handleJoin(event.id)}
                        style={{ flex: 1, padding: '12px 16px', fontSize: '14px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
                      >
                        Join Event
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => toggleComments(event.id)}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }}
                  >
                    💬 {showComments[event.id] ? 'Hide' : 'Show'} Comments ({comments[event.id]?.length || 0})
                  </button>

                  {showComments[event.id] && (
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginTop: '10px' }}>
                      {user && !user.username && (
                        <div style={{ marginBottom: '15px' }}>
                          <textarea
                            value={newComment[event.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [event.id]: e.target.value }))}
                            placeholder="Add a comment..."
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              resize: 'vertical',
                              minHeight: '80px',
                              fontSize: '14px'
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(event.id)}
                            style={{
                              marginTop: '8px',
                              padding: '8px 16px',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Post Comment
                          </button>
                        </div>
                      )}
                      
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {comments[event.id]?.length > 0 ? (
                          comments[event.id].map((comment, index) => (
                            <div key={index} style={{ 
                              background: 'white', 
                              padding: '12px', 
                              borderRadius: '8px', 
                              marginBottom: '10px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>{comment.name}</span>
                                  <span style={{ color: '#667eea', fontSize: '12px', background: '#f0f4ff', padding: '2px 8px', borderRadius: '12px' }}>
                                    {comment.department} - Year {comment.year}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: '#64748b', fontSize: '12px' }}>
                                    {new Date(comment.created_at).toLocaleDateString()}
                                  </span>
                                  {user && user.username && (
                                    <button
                                      onClick={() => handleDeleteComment(comment.id, event.id)}
                                      style={{
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      🗑️ Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p style={{ margin: 0, color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>
                                {comment.comment}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
                            No comments yet. Be the first to comment!
                          </p>
                        )}
                      </div>
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