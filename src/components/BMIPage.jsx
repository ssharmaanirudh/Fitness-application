import { useState } from 'react';
import { calcBMI, getBMICategory, getBMIPointerPercent, getRecommendations } from '../utils/fitness';

function BMIMeter({ bmi }) {
  const pct = getBMIPointerPercent(bmi);
  const cat = getBMICategory(bmi);

  return (
    <div>
      <div className="bmi-value-display">
        <div className="bmi-number" style={{ color: cat.color }}>{bmi}</div>
        <div className="bmi-category" style={{ color: cat.color }}>{cat.label}</div>
      </div>
      <div className="bmi-meter">
        <div className="bmi-pointer" style={{ left: `${pct}%` }} />
      </div>
      <div className="bmi-labels">
        <span>Underweight<br/>&lt;18.5</span>
        <span style={{ textAlign: 'center' }}>Normal<br/>18.5–24.9</span>
        <span style={{ textAlign: 'center' }}>Overweight<br/>25–29.9</span>
        <span style={{ textAlign: 'right' }}>Obese<br/>&gt;30</span>
      </div>
    </div>
  );
}

function BMITable() {
  const ranges = [
    { range: 'Below 18.5', category: 'Underweight', color: '#60a5fa', badge: 'badge-blue' },
    { range: '18.5 – 24.9', category: 'Normal weight', color: '#34d399', badge: 'badge-green' },
    { range: '25.0 – 29.9', category: 'Overweight', color: '#fbbf24', badge: 'badge-amber' },
    { range: '30.0 and above', category: 'Obese', color: '#f87171', badge: 'badge-red' },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      {ranges.map(r => (
        <div key={r.category} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
          borderBottom: '1px solid var(--border)',
        }}>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.range}</span>
          <span className={`badge ${r.badge}`}>{r.category}</span>
        </div>
      ))}
    </div>
  );
}

export default function BMIPage({ profile, onUpdateProfile }) {
  const [weight, setWeight] = useState(profile.weight.toString());
  const [height, setHeight] = useState(profile.height.toString());
  const [unit, setUnit] = useState('metric');

  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;

  let weightKg = w, heightCm = h;
  if (unit === 'imperial') {
    weightKg = w * 0.453592;
    heightCm = h * 2.54;
  }

  const bmi = w > 0 && h > 0 ? calcBMI(weightKg, heightCm) : 0;
  const cat = bmi > 0 ? getBMICategory(bmi) : null;
  const recs = bmi > 0 ? getRecommendations(bmi, { weight: weightKg, height: heightCm }) : [];

  function handleSync() {
    onUpdateProfile({ weight: Math.round(weightKg), height: Math.round(heightCm) });
  }

  const idealWeightLow = parseFloat((18.5 * Math.pow(heightCm / 100, 2)).toFixed(1));
  const idealWeightHigh = parseFloat((24.9 * Math.pow(heightCm / 100, 2)).toFixed(1));

  return (
    <div>
      <h1 className="page-title">BMI Calculator</h1>
      <p className="page-subtitle">Body Mass Index — measure and track your health status.</p>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Calculate BMI</div>

          <div className="flex gap-2" style={{ marginBottom: 20, marginTop: 8 }}>
            <button
              className={`btn btn-sm ${unit === 'metric' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setUnit('metric')}
            >Metric (kg/cm)</button>
            <button
              className={`btn btn-sm ${unit === 'imperial' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setUnit('imperial')}
            >Imperial (lb/in)</button>
          </div>

          <div className="form-group">
            <label className="form-label">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input
              type="number"
              className="form-input"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              min="20"
              max="500"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input
              type="number"
              className="form-input"
              value={height}
              onChange={e => setHeight(e.target.value)}
              min="50"
              max="300"
              step="0.1"
            />
          </div>

          {bmi > 0 && (
            <BMIMeter bmi={bmi} />
          )}

          {bmi > 0 && heightCm > 0 && (
            <div style={{
              marginTop: 20,
              padding: '14px 16px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 8,
            }}>
              <div className="text-sm" style={{ color: 'var(--text-muted)', marginBottom: 6 }}>
                Ideal weight range for your height ({unit === 'metric' ? `${heightCm} cm` : `${height} in`}):
              </div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {unit === 'metric'
                  ? `${idealWeightLow} – ${idealWeightHigh} kg`
                  : `${(idealWeightLow * 2.20462).toFixed(1)} – ${(idealWeightHigh * 2.20462).toFixed(1)} lbs`
                }
              </div>
              <div className="text-sm text-muted" style={{ marginTop: 4 }}>Based on BMI 18.5–24.9 (Normal range)</div>
            </div>
          )}

          <button className="btn btn-secondary w-full" style={{ marginTop: 16 }} onClick={handleSync}>
            Sync to Profile
          </button>
        </div>

        <div>
          <div className="card mb-4" style={{ marginBottom: 24 }}>
            <div className="card-title">BMI Classification</div>
            <BMITable />
          </div>

          {recs.length > 0 && (
            <div className="card">
              <div className="card-title">Recommendations</div>
              <div style={{ marginTop: 12 }}>
                {recs.map((r, i) => (
                  <div key={i} className="recommendation-card" style={{ borderLeft: `3px solid ${r.color}` }}>
                    <h4 style={{ color: r.color }}>{r.title}</h4>
                    <p>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {bmi > 0 && (
        <div className="card">
          <div className="card-title">Health Insights</div>
          <div className="grid-3" style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Target BMI</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--secondary)' }}>18.5 – 24.9</div>
              <div className="text-muted text-sm">Healthy range</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>⚖️</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Your BMI</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: cat?.color }}>{bmi}</div>
              <div className="text-muted text-sm">{cat?.label}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📏</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Ideal Weight</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
                {idealWeightLow}–{idealWeightHigh}
              </div>
              <div className="text-muted text-sm">kg for your height</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
