import FlyingRunnersLogo from './FlyingRunnersLogo';

export default function Landing({ onNavigate, profile }) {
  const cards = [
    {
      id: 'dashboard',
      emoji: '📊',
      title: 'Personal Dashboard',
      desc: 'Track your workouts, calories, distance and BMI. Your private fitness hub.',
      color: 'var(--primary)',
      bg: 'rgba(99,102,241,0.12)',
      border: 'rgba(99,102,241,0.3)',
      stats: 'Activities • BMI • Profile',
    },
    {
      id: 'challenges',
      emoji: '🎯',
      title: 'Challenges',
      desc: 'Join weekly and monthly fitness challenges. Push your limits and earn badges.',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.3)',
      stats: 'Weekly • Monthly • Badges',
    },
    {
      id: 'leaderboard',
      emoji: '🏆',
      title: 'Community Leaderboard',
      desc: 'See who has the most activity this week across the entire FitTrack community.',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.3)',
      stats: 'Calories • Distance • Time',
    },
  ];

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 40px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(16,185,129,0.1) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '48px 32px 40px',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 20 }}>
          <FlyingRunnersLogo size="lg" />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 8, color: 'var(--text)' }}>
          Welcome back, {profile?.name?.split(' ')[0] || 'Athlete'}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
          Your fitness journey continues. What would you like to do today?
        </p>
      </div>

      {/* 3 section cards */}
      <div style={{
        maxWidth: 960,
        margin: '40px auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
      }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => onNavigate(card.id)}
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              borderRadius: 20,
              padding: '32px 24px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${card.border}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: 44 }}>{card.emoji}</div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: card.color, marginBottom: 8, letterSpacing: -0.5 }}>
                {card.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                {card.desc}
              </p>
            </div>
            <div style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 12, color: card.color, fontWeight: 600 }}>{card.stats}</span>
              <span style={{ fontSize: 20, color: card.color }}>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Motivation banner */}
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '24px 28px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏅</div>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
            Big congratulations to all our weekly leaderboard achievers!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Your hard work truly shines — keep pushing, keep improving, and keep inspiring one another. 💪🔥
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            onClick={() => onNavigate('leaderboard')}
          >
            🏆 View This Week's Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
