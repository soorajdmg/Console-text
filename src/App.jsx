import { useState, useEffect, useRef } from 'react';
import './App.css';
import UseCasesWheel from './components/UseCasesWheel';
import { authService } from './services/api';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKeys, setApiKeys] = useState({ liveKey: '', testKey: '' });

  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navbarRef = useRef(null);
  const finalCtaRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
    setError('');
    setEmail('');
    setPhone('');
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setError('');
    setEmail('');
    setPhone('');
  };

  const closeAll = () => {
    setMenuOpen(false);
    setShowAuthModal(false);
    setError('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !phone) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Phone validation (basic)
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    try {
      const result = await authService.signup(email, phone);
      console.log('Signup result:', result);

      if (result.success) {
        console.log('API Keys received:', result.data);
        setIsAuthenticated(true);
        setApiKeys({
          liveKey: result.data.liveKey || '',
          testKey: result.data.testKey || '',
        });
        closeAuthModal();

        // Scroll to final CTA section
        setTimeout(() => {
          finalCtaRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        setError(result.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    if (authenticated) {
      setIsAuthenticated(true);
      const keys = authService.getApiKeys();
      setApiKeys(keys);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        if (menuOpen || showAuthModal) {
          closeAll();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, showAuthModal]);

  return (
    <div className="landing-page">
      {/* Grid Background */}
      <div className="grid-background"></div>
      <div className="grid-plus-markers"></div>

      {/* Left Column (Decorative) */}
      <div className="grid-column left"></div>

      {/* Middle Column (Content) */}
      <div className="grid-column middle">
        {/* Navigation */}
        <nav ref={navbarRef} className={`navbar ${menuOpen || showAuthModal ? 'menu-open' : ''}`}>
          <div className="nav-header">
            <div className="logo">console-text</div>
            <div className="nav-actions">
              <div className="btn-wrapper">
                <button className="btn-try-now" onClick={openAuthModal}>Try Now</button>
              </div>
              <button className="burger-menu" onClick={showAuthModal ? closeAuthModal : toggleMenu}>
                <span className={`burger-line ${menuOpen || showAuthModal ? 'open' : ''}`}></span>
                <span className={`burger-line ${menuOpen || showAuthModal ? 'open' : ''}`}></span>
                <span className={`burger-line ${menuOpen || showAuthModal ? 'open' : ''}`}></span>
              </button>
            </div>
          </div>

          {menuOpen && !showAuthModal && (
            <div className="nav-menu-expanded">
              <a href="#how-it-works" onClick={toggleMenu}>How It Works</a>
              <a href="#use-cases" onClick={toggleMenu}>Use Cases</a>
              <a href="#pricing" onClick={toggleMenu}>Pricing</a>
              <a href="/docs" onClick={toggleMenu}>Docs</a>
            </div>
          )}

          {showAuthModal && (
            <div className="nav-menu-expanded auth-modal">
              <div className="auth-header">
                <h2>Get Live Key</h2>
              </div>
              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="btn-wrapper">
                  <button type="submit" className="btn-primary-nav" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Get Live Key'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </nav>

        {/* Navbar Divider */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <div className="divider-plus left-plus">+</div>
          <div className="divider-plus right-plus">+</div>
        </div>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Get Error Alerts Instantly.
              <br />
              <span className="electric-text">One Line of Code.</span>
            </h1>
            <p className="hero-subtitle">
              Add one line and get notified immediately when something breaks.
            </p>

            <div className="cta-buttons">
              <div className="btn-wrapper">
                <button className="btn-secondary" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>See How It Works</button>
              </div>
              <div className="btn-wrapper">
                <button className="btn-primary" onClick={openAuthModal}>Get Your API Key</button>
              </div>
            </div>

            <div className="code-demo">
              <div className="terminal">
                <div className="terminal-header">
                  <div className="terminal-buttons">
                    <span className="btn-dot red"></span>
                    <span className="btn-dot yellow"></span>
                    <span className="btn-dot green"></span>
                  </div>
                  <span className="terminal-title">index.js</span>
                  <div className="terminal-spacer"></div>
                </div>
                <div className="terminal-body">
                  <pre><code><span className="code-import">import</span> <span className="code-bracket">{'{'}</span> init <span className="code-bracket">{'}'}</span> <span className="code-import">from</span> <span className="code-string">"console-text"</span>;
{'\n'}
<span className="code-function">init</span>(<span className="code-bracket">{'{'}</span> <span className="code-property">apiKey</span>: <span className="code-string">"YOUR_API_KEY"</span> <span className="code-bracket">{'}'}</span>);
{'\n'}
<span className="code-console">console</span>.<span className="code-function">text</span>(<span className="code-string">"Checkout broke"</span>);</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <div className="divider-plus left-plus">+</div>
          <div className="divider-plus right-plus">+</div>
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works">
          <h2 className="section-title">
            <span className="title-line"></span>
            How It Works
            <span className="title-line"></span>
          </h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Sign up and get your API key</h3>
                <p>Takes 10 seconds. No credit card required.</p>
              </div>
            </div>

            <div className="step-divider"></div>

            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Add one line to your code</h3>
                <p>Initialize console-text with your API key.</p>
              </div>
            </div>

            <div className="step-divider"></div>

            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Receive instant error notifications</h3>
                <p>Get alerted the moment something breaks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" id='section-divider-usecase'>
          <div className="divider-line"></div>
          <div className="divider-plus left-plus">+</div>
          <div className="divider-plus right-plus">+</div>
        </div>

        {/* Use Cases Section */}
        <UseCasesWheel />

        {/* Section Divider */}
        <div className="section-divider" id='section-divider-why'>
          <div className="divider-line"></div>
          <div className="divider-plus left-plus">+</div>
          <div className="divider-plus right-plus">+</div>
        </div>

        {/* Why Console-Text Section */}
        <section className="why-section">
          <h2 className="section-title">
            <span className="title-line"></span>
            Why console-text?
            <span className="title-line"></span>
          </h2>
          <div className="why-grid">
            <div className="why-item">
              <span className="check-mark">✓</span>
              <span>Ultra-fast alerting</span>
            </div>
            <div className="why-item">
              <span className="check-mark">✓</span>
              <span>No dashboards</span>
            </div>
            <div className="why-item">
              <span className="check-mark">✓</span>
              <span>No configuration</span>
            </div>
            <div className="why-item">
              <span className="check-mark">✓</span>
              <span>Zero learning curve</span>
            </div>
            <div className="why-item">
              <span className="check-mark">✓</span>
              <span>Works in any backend</span>
            </div>
            <div className="why-item">
              <span className="check-mark">✓</span>
              <span>Solves real developer pain</span>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <div className="divider-plus left-plus">+</div>
          <div className="divider-plus right-plus">+</div>
        </div>

        {/* Final CTA Section */}
        <section className="final-cta" ref={finalCtaRef}>
          <div className="cta-content">
            {!isAuthenticated ? (
              <>
                <h2 className="cta-title">Ready to never miss an error again?</h2>
                <div className="btn-wrapper">
                  <button className="btn-primary-large" onClick={openAuthModal}>
                    Get Your API Key
                  </button>
                </div>
                <p className="cta-subtext">Takes 10 seconds. No credit card required.</p>
              </>
            ) : (
              <>
                <h2 className="cta-title">Your API Keys</h2>
                <p className="cta-subtext" style={{ marginBottom: '32px' }}>Use these keys to integrate console-text into your application</p>

                <div className="api-keys-container">
                  <div className="api-key-box">
                    <div className="api-key-label">
                      <span className="key-badge live">LIVE</span>
                      <span className="key-title">Production Key</span>
                    </div>
                    <div className="api-key-value">
                      <code>{apiKeys.liveKey || 'No key available'}</code>
                      <button
                        className="btn-copy"
                        onClick={() => navigator.clipboard.writeText(apiKeys.liveKey)}
                        title="Copy to clipboard"
                        disabled={!apiKeys.liveKey}
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="api-key-box">
                    <div className="api-key-label">
                      <span className="key-badge test">TEST</span>
                      <span className="key-title">Development Key</span>
                    </div>
                    <div className="api-key-value">
                      <code>{apiKeys.testKey || 'No key available'}</code>
                      <button
                        className="btn-copy"
                        onClick={() => navigator.clipboard.writeText(apiKeys.testKey)}
                        title="Copy to clipboard"
                        disabled={!apiKeys.testKey}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <div className="divider-plus left-plus">+</div>
          <div className="divider-plus right-plus">+</div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section main">
              <div className="footer-logo">console-text</div>
              <p className="footer-tagline">Error alerts that actually wake you up.</p>
            </div>

            <div className="footer-section">
              <h4>Product</h4>
              <a href="/docs">Docs</a>
              <a href="/pricing">Pricing</a>
              <a href="#how-it-works">How It Works</a>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <a href="/contact">Contact</a>
              <a href="/about">About</a>
              <a href="/blog">Blog</a>
            </div>

            <div className="footer-section">
              <h4>Account</h4>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
              <a href="/dashboard">Dashboard</a>
            </div>
          </div>

          {/* Footer Divider */}
          <div className="section-divider">
            <div className="divider-line"></div>
            <div className="divider-plus left-plus">+</div>
            <div className="divider-plus right-plus">+</div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 console-text. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Right Column (Decorative) */}
      <div className="grid-column right"></div>
    </div>
  );
}

export default App;
