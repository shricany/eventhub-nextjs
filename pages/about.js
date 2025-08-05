import Head from 'next/head';

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Us - EventHub</title>
      </Head>
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: '800', color: '#1a202c', marginBottom: '60px' }}>
            About EventHub
          </h1>
          
          <div style={{ background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', color: '#1a202c', marginBottom: '20px' }}>Our Mission</h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.7' }}>
              EventHub is designed to streamline campus event management and enhance student participation. 
              We bridge the gap between event organizers and students, making it easier to discover, 
              participate in, and manage campus events.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#1a202c', marginBottom: '20px' }}>For Students</h3>
              <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                <li>Easy event discovery and browsing</li>
                <li>Simple registration and participation process</li>
                <li>Real-time updates on event status</li>
                <li>Feedback and reporting system</li>
              </ul>
            </div>
            
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#1a202c', marginBottom: '20px' }}>For Administrators</h3>
              <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                <li>Comprehensive event creation tools</li>
                <li>Participant tracking and management</li>
                <li>Event analytics and insights</li>
                <li>Streamlined communication with participants</li>
              </ul>
            </div>
          </div>

          <div style={{ background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '2rem', color: '#1a202c', marginBottom: '20px' }}>Our Vision</h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.7', marginBottom: '30px' }}>
              We envision a campus where every student is aware of and can easily participate in 
              events that interest them. By providing a centralized platform for event management, 
              we aim to foster a more engaged and connected campus community.
            </p>
            
            <h2 style={{ fontSize: '2rem', color: '#1a202c', marginBottom: '20px' }}>Technology</h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.7' }}>
              EventHub is built using modern web technologies including Next.js for full-stack development 
              and Vercel for deployment, ensuring a responsive and reliable user experience.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}