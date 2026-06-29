import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import FlyingRunnersLogo from './FlyingRunnersLogo';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Handle email confirmation redirect — Supabase puts tokens in the URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('type=signup'))) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setConfirmed(true);
          // Clean the URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      });
    }
    // Also handle ?type=recovery or ?code= (PKCE flow)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error && data.session) {
          setConfirmed(true);
          window.history.replaceState(null, '', window.location.pathname);
        }
      });
    }
  }, []);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Please enter your name.');
      if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
            emailRedirectTo: 'https://ssharmaanirudh.github.io/Fitness-application/',
          },
        });
        if (signUpError) throw signUpError;

        // Pre-create profile so it's ready after confirmation
        if (data?.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: form.name,
            age: 25,
            gender: 'other',
            weight: 70,
            height: 170,
            goal: 'maintain',
          });
        }
        setEmailSent(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) {
          if (signInError.message.includes('Email not confirmed')) {
            throw new Error('Please confirm your email first. Check your inbox for the confirmation link.');
          }
          throw signInError;
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Email confirmed screen
  if (confirmed) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <FlyingRunnersLogo size="lg" />
          <div style={{
            marginTop: 40, padding: '32px 24px',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#34d399', marginBottom: 8 }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Your email has been confirmed. You can now log in to your Flying Runners account.
            </p>
            <button
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', padding: '13px', fontSize: 15 }}
              onClick={() => { setConfirmed(false); setMode('login'); }}
            >
              🚀 Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email sent screen
  if (emailSent) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <FlyingRunnersLogo size="lg" />
          <div style={{
            marginTop: 40, padding: '32px 24px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>📧</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Check Your Email!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
              We've sent a confirmation link to
            </p>
            <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15, marginBottom: 16 }}>
              {form.email}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
              Click the link in that email to verify your account, then come back here and log in.
            </p>
            <button
              className="btn btn-secondary w-full"
              style={{ justifyContent: 'center' }}
              onClick={() => { setEmailSent(false); setMode('login'); }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <FlyingRunnersLogo size="lg" />
          <p style={{ color: 'var(--text-muted)', marginTop: 10, fontSize: 14 }}>
            Your community fitness companion
          </p>
        </div>

        <div className="card">
          <div style={{
            display: 'flex', background: 'var(--bg)',
            borderRadius: 10, padding: 4, marginBottom: 28,
          }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                  background: mode === m ? 'var(--primary)' : 'transparent',
                  color: mode === m ? 'white' : 'var(--text-muted)',
                }}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" placeholder="Your full name"
                  value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => update('email', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password"
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                value={form.password} onChange={e => update('password', e.target.value)} required />
            </div>

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px 14px', background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                color: '#f87171', fontSize: 13, marginBottom: 16,
              }}>⚠️ {error}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', padding: '13px', fontSize: 15 }}
              disabled={loading}
            >
              {loading ? '⏳ Please wait...' : mode === 'login' ? '🚀 Log In' : '🎉 Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          Your data is private and secure. Only you can edit your activities. 🔒
        </p>
      </div>
    </div>
  );
}
