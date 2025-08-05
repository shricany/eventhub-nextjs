import { useState } from 'react';
import Head from 'next/head';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Head>
        <title>Contact & Support - EventHub</title>
      </Head>
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: '800', color: '#1a202c', marginBottom: '60px' }}>
            Contact & Support
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            <div style={{ background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '2rem', color: '#1a202c', marginBottom: '20px' }}>Get in Touch</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.7', marginBottom: '40px' }}>
                Have questions, suggestions, or need support? We're here to help! 
                Reach out to us using the contact form or through the information below.
              </p>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1a202c', marginBottom: '10px' }}>📧 Email</h3>
                <p style={{ color: '#64748b' }}>support@eventhub.edu</p>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1a202c', marginBottom: '10px' }}>📞 Phone</h3>
                <p style={{ color: '#64748b' }}>+1 (555) 123-4567</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#1a202c', marginBottom: '10px' }}>🕒 Office Hours</h3>
                <p style={{ color: '#64748b' }}>Monday - Friday: 9:00 AM - 5:00 PM</p>
              </div>
            </div>

            <div style={{ background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '2rem', color: '#1a202c', marginBottom: '30px' }}>Send us a Message</h2>
              
              {submitted && (
                <div style={{ padding: '15px', marginBottom: '25px', borderRadius: '8px', background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600' }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600' }}>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '16px' }}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#1a202c', fontWeight: '600' }}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '16px', resize: 'vertical' }}
                  />
                </div>
                
                <button
                  type="submit"
                  style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}