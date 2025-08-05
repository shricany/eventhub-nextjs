import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function LandingPage() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      text: "This platform made it so easy to discover and join tech events on campus. I've participated in 5 events this semester!",
      avatar: "👩‍💻"
    },
    {
      name: "Prof. Michael Chen",
      role: "Event Coordinator",
      text: "Managing events has never been easier. The clean interface and participant tracking save us so much time!",
      avatar: "👨‍🏫"
    },
    {
      name: "Alex Rodriguez",
      role: "Student Council President",
      text: "The participant tracking and feedback system helps us organize better events every time.",
      avatar: "👨‍🎓"
    }
  ];

  return (
    <>
      <Head>
        <title>EventHub - Transform Your Campus Events</title>
        <meta name="description" content="AI-powered campus event management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="landing-page">
        <section className="hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <h1>Transform Your Campus Events</h1>
            <p>Discover, participate, and manage campus events with our intelligent platform featuring AI-generated posters and seamless event management</p>
            <div className="hero-buttons">
              <Link href="/events" className="btn btn-primary">
                <span>🎯</span> Explore Events
              </Link>
              <Link href="/student-registration" className="btn btn-secondary">
                <span>🚀</span> Join Community
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Events Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">2000+</span>
                <span className="stat-label">Students Engaged</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Departments</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <div className="section-header">
              <h2>🌟 Why Students Love Our Platform</h2>
              <p>Experience the future of campus event management</p>
            </div>
            <div className="feature-grid">
              <div className="feature">
                <div className="feature-icon">🎨</div>
                <h3>Professional Design</h3>
                <p>Clean, modern interface with elegant event cards and responsive design</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🔍</div>
                <h3>Smart Discovery</h3>
                <p>Find events that match your interests with our intelligent recommendation system</p>
              </div>
              <div className="feature">
                <div className="feature-icon">📱</div>
                <h3>Mobile-First Design</h3>
                <p>Access events, register, and manage participation from any device, anywhere</p>
              </div>
              <div className="feature">
                <div className="feature-icon">📊</div>
                <h3>Real-time Analytics</h3>
                <p>Track participation, gather feedback, and improve events with detailed insights</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🤝</div>
                <h3>Community Building</h3>
                <p>Connect with like-minded students and build lasting campus relationships</p>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <h3>Instant Notifications</h3>
                <p>Never miss an event with real-time updates and personalized reminders</p>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials">
          <div className="container">
            <div className="section-header">
              <h2>💬 What Our Community Says</h2>
              <p>Real feedback from students and faculty using our platform</p>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="quote-icon">"</div>
                    <p>{testimonial.text}</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">{testimonial.avatar}</div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a202c', marginBottom: '20px' }}>
              Meet the Creator
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '50px' }}>
              Built with passion for improving campus life
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
              <div style={{ 
                position: 'relative',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                borderRadius: '25px',
                boxShadow: '0 30px 80px rgba(102, 126, 234, 0.4)',
                transform: 'rotate(-2deg)',
                maxWidth: '350px',
                width: '100%'
              }}>
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  transform: 'rotate(2deg)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src="/images/founder.jpeg" 
                    alt="Founder" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '10px',
                      display: 'block'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    boxShadow: '0 5px 15px rgba(251, 191, 36, 0.4)'
                  }}>
                    ✨ FOUNDER
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: '900',
                  marginBottom: '10px',
                  lineHeight: '1.1'
                }}>
                  Venkat Swamy
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '25px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    💻 Founder & Developer
                  </span>
                  <span style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    🎓 CS Student
                  </span>
                </div>
                
                <p style={{ 
                  color: '#64748b', 
                  lineHeight: '1.8', 
                  fontSize: '1.1rem',
                  marginBottom: '25px'
                }}>
                  Computer Science student passionate about creating solutions that bring campus communities together. 
                  EventHub was born from the vision of making campus events more accessible and engaging for everyone.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    padding: '12px 20px',
                    borderRadius: '15px',
                    border: '2px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>2024</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>FOUNDED</div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    padding: '12px 20px',
                    borderRadius: '15px',
                    border: '2px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>500+</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>EVENTS</div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    padding: '12px 20px',
                    borderRadius: '15px',
                    border: '2px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>2K+</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>USERS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Transform Your Campus Experience?</h2>
              <p>Join thousands of students already using our platform to discover amazing events</p>
              <div className="cta-buttons">
                <Link href="/student-registration" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link href="/admin" className="btn btn-outline btn-large">
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}