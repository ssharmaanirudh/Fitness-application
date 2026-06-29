import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

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
          options: { data: { full_name: form.name } },
        });
        if (signUpError) throw signUpError;
        if (data?.user) {
          // Create profile row
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
        setMessage('Account created! You are now logged in. Welcome to FitTrack 💪');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>💪</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', letterSpacing: -1, margin: 0 }}>FitTrack</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>
            Your community fitness companion
          </p>
        </div>

        {/* Card */}
        <div className="card">
          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--bg)',
            borderRadius: 10,
            padding: 4,
            marginBottom: 28,
          }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setMessage(''); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 14,
                  transition: 'all 0.2s',
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
                <input
                  className="form-input"
                  type="text"
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                value={form.password}
                onChange={e => update('password', e.target.value)}
                required
              />
            </div>

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  required
                />
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px 14px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                color: '#f87171',
                fontSize: 13,
                marginBottom: 16,
              }}>⚠️ {error}</div>
            )}

            {message && (
              <div style={{
                padding: '12px 14px',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 8,
                color: '#34d399',
                fontSize: 13,
                marginBottom: 16,
              }}>✅ {message}</div>
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
