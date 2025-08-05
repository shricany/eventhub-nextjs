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
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <img 
                  src="/images/founder.jpeg" 
                  alt="Founder" 
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '5px solid #667eea',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                    marginBottom: '20px'
                  }}
                />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>
                  Shrikant Davange
                </h3>
                <p style={{ color: '#667eea', fontWeight: '600', marginBottom: '15px' }}>
                  Founder & Developer
                </p>
                <p style={{ color: '#64748b', lineHeight: '1.6', maxWidth: '400px' }}>
                  Computer Science student passionate about creating solutions that bring campus communities together. 
                  EventHub was born from the vision of making campus events more accessible and engaging for everyone.
                </p>
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