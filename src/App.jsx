import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import Auth from './components/Auth';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import ActivityLog from './components/ActivityLog';
import BMIPage from './components/BMIPage';
import Profile from './components/Profile';
import Challenges from './components/Challenges';
import CommunityLeaderboard from './components/CommunityLeaderboard';
import FlyingRunnersLogo from './components/FlyingRunnersLogo';
import './index.css';

const DASHBOARD_NAV = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'activities', label: 'Activities', emoji: '🏃' },
  { id: 'challenges', label: 'Challenges', emoji: '🎯' },
  { id: 'leaderboard', label: 'Leaderboard', emoji: '🏆' },
  { id: 'bmi', label: 'BMI', emoji: '⚖️' },
  { id: 'profile', label: 'Profile', emoji: '👤' },
];

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { profile, updateProfile, activities, addActivity, deleteActivity, loading } = useStore(session?.user?.id);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setPage('home');
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <FlyingRunnersLogo size="lg" />
        <div style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 8 }}>Loading...</div>
      </div>
    );
  }

  if (!session) return <Auth />;

  const initials = profile?.name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <FlyingRunnersLogo size="sm" />
        </div>

        {DASHBOARD_NAV.map(n => (
          <div
            key={n.id}
            className={`nav-item ${page === n.id ? 'active' : ''}`}
            onClick={() => setPage(n.id)}
          >
            <span style={{ fontSize: 18 }}>{n.emoji}</span>
            {n.label === 'BMI' ? 'BMI & Health' : n.label}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile?.name || session.user.email}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{profile?.weight}kg • {profile?.height}cm</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center' }} onClick={handleSignOut}>
            🚪 Sign Out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="main">
        <div className="mobile-topbar">
          <FlyingRunnersLogo size="sm" />
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'white',
          }}>{initials}</div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 40 }}>⏳</div>
            <div style={{ color: 'var(--text-muted)' }}>Loading your data...</div>
          </div>
        ) : (
          <>
            {page === 'home' && <Landing onNavigate={setPage} profile={profile} />}
            {page === 'dashboard' && <Dashboard activities={activities} profile={profile} />}
            {page === 'activities' && (
              <ActivityLog activities={activities} onAdd={addActivity} onDelete={deleteActivity} profile={profile} />
            )}
            {page === 'challenges' && <Challenges activities={activities} />}
            {page === 'leaderboard' && <CommunityLeaderboard currentUserId={session.user.id} />}
            {page === 'bmi' && <BMIPage profile={profile} onUpdateProfile={updateProfile} />}
            {page === 'profile' && <Profile profile={profile} onUpdate={updateProfile} activities={activities} onSignOut={handleSignOut} />}
          </>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {DASHBOARD_NAV.map(n => (
          <button
            key={n.id}
            className={`bottom-nav-item ${page === n.id ? 'active' : ''}`}
            onClick={() => setPage(n.id)}
          >
            <span className="bottom-nav-emoji">{n.emoji}</span>
            <span className="bottom-nav-label">{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
