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
        <section style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '80px 20px 40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}></div>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            zIndex: 1
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '900',
              marginBottom: '24px',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>Transform Your Campus Events</h1>
            <p style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              marginBottom: '40px',
              opacity: 0.9,
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>Discover, participate, and manage campus events with our intelligent platform featuring AI-generated posters and seamless event management</p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginBottom: '60px',
              flexWrap: 'wrap'
            }}>
              <Link href="/events" style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '180px',
                justifyContent: 'center'
              }}>
                <span>🎯</span> Explore Events
              </Link>
              <Link href="/student-registration" style={{
                background: 'white',
                color: '#667eea',
                padding: '16px 32px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '180px',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}>
                <span>🚀</span> Join Community
              </Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '30px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: '900',
                  marginBottom: '8px'
                }}>500+</div>
                <div style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  fontWeight: '500'
                }}>Events Created</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: '900',
                  marginBottom: '8px'
                }}>2000+</div>
                <div style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  fontWeight: '500'
                }}>Students Engaged</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: '900',
                  marginBottom: '8px'
                }}>50+</div>
                <div style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  fontWeight: '500'
                }}>Departments</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '60px'
            }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '800',
                color: '#1a202c',
                marginBottom: '16px'
              }}>🌟 Why Students Love Our Platform</h2>
              <p style={{
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                color: '#64748b',
                maxWidth: '600px',
                margin: '0 auto'
              }}>Experience the future of campus event management</p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {[
                { icon: '🎨', title: 'Professional Design', desc: 'Clean, modern interface with elegant event cards and responsive design' },
                { icon: '🔍', title: 'Smart Discovery', desc: 'Find events that match your interests with our intelligent recommendation system' },
                { icon: '📱', title: 'Mobile-First Design', desc: 'Access events, register, and manage participation from any device, anywhere' },
                { icon: '📊', title: 'Real-time Analytics', desc: 'Track participation, gather feedback, and improve events with detailed insights' },
                { icon: '🤝', title: 'Community Building', desc: 'Connect with like-minded students and build lasting campus relationships' },
                { icon: '⚡', title: 'Instant Notifications', desc: 'Never miss an event with real-time updates and personalized reminders' }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'white',
                  padding: '40px 30px',
                  borderRadius: '20px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '20px'
                  }}>{feature.icon}</div>
                  <h3 style={{
                    fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
                    fontWeight: '700',
                    color: '#1a202c',
                    marginBottom: '16px'
                  }}>{feature.title}</h3>
                  <p style={{
                    color: '#64748b',
                    lineHeight: '1.6',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '60px',
              color: 'white'
            }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '800',
                marginBottom: '16px'
              }}>💬 What Our Community Says</h2>
              <p style={{
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                opacity: 0.9,
                maxWidth: '600px',
                margin: '0 auto'
              }}>Real feedback from students and faculty using our platform</p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '30px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white'
                }}>
                  <div style={{
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      fontSize: '3rem',
                      opacity: 0.3,
                      lineHeight: '1',
                      marginBottom: '10px'
                    }}>"</div>
                    <p style={{
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      lineHeight: '1.6',
                      opacity: 0.9
                    }}>{testimonial.text}</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{
                      fontSize: '2.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>{testimonial.avatar}</div>
                    <div>
                      <h4 style={{
                        margin: 0,
                        fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                        fontWeight: '600'
                      }}>{testimonial.name}</h4>
                      <span style={{
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                        opacity: 0.8
                      }}>{testimonial.role}</span>
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
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '40px', 
              alignItems: 'center' 
            }}>
              <div style={{ 
                position: 'relative',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                borderRadius: '25px',
                boxShadow: '0 30px 80px rgba(102, 126, 234, 0.4)',
                transform: 'rotate(-2deg)',
                maxWidth: '350px',
                width: '100%',
                margin: '0 auto'
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
                    fontSize: 'clamp(10px, 2vw, 12px)',
                    fontWeight: '700',
                    boxShadow: '0 5px 15px rgba(251, 191, 36, 0.4)'
                  }}>
                    ✨ FOUNDER
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', width: '100%' }}>
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

        <section style={{
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            color: 'white'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}>Ready to Transform Your Campus Experience?</h2>
            <p style={{
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              marginBottom: '40px',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>Join thousands of students already using our platform to discover amazing events</p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/student-registration" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                minWidth: '200px',
                display: 'inline-block'
              }}>
                Get Started Free
              </Link>
              <Link href="/admin" style={{
                background: 'transparent',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                minWidth: '200px',
                display: 'inline-block'
              }}>
                Admin Portal
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}