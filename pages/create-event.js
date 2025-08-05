import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    department: '',
    registration_deadline: '',
    award: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
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
      alert('Only admins can create events');
      window.location.href = '/events';
      return;
    }
    
    setUser(parsedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Event created successfully!');
        setFormData({
          name: '',
          date: '',
          time: '',
          location: '',
          department: '',
          registration_deadline: '',
          award: '',
          description: ''
        });
        setTimeout(() => window.location.href = '/events', 2000);
      } else {
        setMessage(data.message || 'Error creating event');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Create Event - EventHub</title>
      </Head>
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontWeight: '800', color: '#1a202c' }}>
            Create New Event
          </h2>

          {message && (
            <div style={{ padding: '16px 20px', marginBottom: '25px', borderRadius: '12px', background: message.includes('successfully') ? '#d4edda' : '#f8d7da', color: message.includes('successfully') ? '#155724' : '#721c24', border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}` }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Event Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s ease' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px' }}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Business">Business</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Registration Deadline *</label>
                <input
                  type="datetime-local"
                  name="registration_deadline"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Award</label>
                <input
                  type="text"
                  name="award"
                  value={formData.award}
                  onChange={handleChange}
                  placeholder="e.g., Certificate, Trophy"
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your event..."
                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', resize: 'vertical', minHeight: '120px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => window.location.href = '/events'}
                style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}