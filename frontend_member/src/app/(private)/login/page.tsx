import React, { useState, type FormEvent } from 'react';


const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f6fa',
    position: 'relative',
  },
  backgroundImage: {
    backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.3,
  },
  loginContainer: {
    position: 'relative',
    zIndex: 1,
    background: '#fff',
    padding: '2rem 2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    minWidth: '350px',
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center' as const,
  },
  logo: {
    width: '70px',
    height: '70px',
    marginBottom: '1rem',
    objectFit: 'contain' as const,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: 0,
    color: '#2d3436',
    letterSpacing: '0.03em',
  },
  subtitle: {
    fontSize: '1.2rem',
    fontWeight: 500,
    margin: '0.5rem 0 0 0',
    color: '#636e72',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  label: {
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#2d3436',
    fontSize: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #dfe6e9',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    marginBottom: '0.5rem',
  },
  formBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  loginButton: {
    background: '#0984e3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.7rem 1.5rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.2s',
  },
  forgotPassword: {
    color: '#636e72',
    textDecoration: 'underline',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  signupText: {
    marginTop: '1.5rem',
    textAlign: 'center' as const,
    color: '#636e72',
    fontSize: '0.98rem',
  },
  signupLink: {
    color: '#0984e3',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your login logic here
    alert(`Logging in with Email: ${email} and Password: ${password}`);
  };

  return (
    <div style={styles.pageWrapper as React.CSSProperties}>
      <div style={styles.backgroundImage as React.CSSProperties} aria-hidden="true" />
      <div style={styles.loginContainer as React.CSSProperties} role="main" aria-label="Login Panel">
        <header style={styles.header}>
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/727cab44-496d-476d-8bb1-ce1e4f920226.png"
            alt="Family Federation for World Peace and Unification logo"
            style={styles.logo}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/727cab44-496d-476d-8bb1-ce1e4f920226.png';
            }}
          />
          <h1 style={styles.title}>FAMILY FEDERATION FOR WORLD PEACE AND UNIFICATION</h1>
          <h2 style={styles.subtitle}>WELCOME BACK!</h2>
        </header>

        <form onSubmit={handleLogin} style={styles.form} aria-label="Login form">
          <label htmlFor="email" style={styles.label}>
            Login to your account
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            aria-required="true"
            aria-label="Email address"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            aria-required="true"
            aria-label="Password"
          />
          <div style={styles.formBottom}>
            <button type="submit" style={styles.loginButton} aria-label="Log in">
              Log in
            </button>
            <a href="#" style={styles.forgotPassword} tabIndex={0}>
              Forgot Password?
            </a>
          </div>
          <p style={styles.signupText}>
            Don’t have an account?{' '}
            <a href="#" style={styles.signupLink} tabIndex={0}>
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
