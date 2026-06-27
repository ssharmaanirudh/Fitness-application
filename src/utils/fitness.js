// MET values for activities (Metabolic Equivalent of Task)
export const ACTIVITIES = {
  walking: { label: 'Walking', met: 3.5, icon: 'footprints', color: '#10b981', bgColor: 'rgba(16,185,129,0.15)' },
  running: { label: 'Running', met: 9.8, icon: 'zap', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)' },
  cycling: { label: 'Cycling', met: 7.5, icon: 'bike', color: '#6366f1', bgColor: 'rgba(99,102,241,0.15)' },
  swimming: { label: 'Swimming', met: 8.0, icon: 'waves', color: '#3b82f6', bgColor: 'rgba(59,130,246,0.15)' },
  hiking: { label: 'Hiking', met: 5.3, icon: 'mountain', color: '#8b5cf6', bgColor: 'rgba(139,92,246,0.15)' },
  yoga: { label: 'Yoga', met: 2.5, icon: 'activity', color: '#ec4899', bgColor: 'rgba(236,72,153,0.15)' },
};

// Average speed in km/h for each activity (used when distance not provided)
export const AVG_SPEED = {
  walking: 5,
  running: 10,
  cycling: 20,
  swimming: 2,
  hiking: 4,
  yoga: 0,
};

/**
 * Calculate calories burned
 * Formula: Calories = MET × weight(kg) × time(hours)
 */
export function calcCalories(activityKey, durationMinutes, weightKg) {
  const activity = ACTIVITIES[activityKey];
  if (!activity) return 0;
  return Math.round(activity.met * weightKg * (durationMinutes / 60));
}

/**
 * Calculate distance covered in km
 */
export function calcDistance(activityKey, durationMinutes) {
  const speed = AVG_SPEED[activityKey] || 0;
  return parseFloat(((speed * durationMinutes) / 60).toFixed(2));
}

/**
 * Calculate BMI
 */
export function calcBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', badge: 'badge-blue' };
  if (bmi < 25) return { label: 'Normal weight', color: '#10b981', badge: 'badge-green' };
  if (bmi < 30) return { label: 'Overweight', color: '#f59e0b', badge: 'badge-amber' };
  return { label: 'Obese', color: '#ef4444', badge: 'badge-red' };
}

export function getBMIPointerPercent(bmi) {
  // Scale: 15 (left edge) to 40 (right edge)
  const min = 15, max = 40;
  const clamped = Math.min(Math.max(bmi, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

export function getRecommendations(bmi, profile) {
  const cat = getBMICategory(bmi);
  const recs = [];

  if (cat.label === 'Underweight') {
    recs.push({
      title: 'Increase caloric intake',
      desc: 'Aim for a calorie surplus of 300–500 kcal/day with nutrient-dense foods.',
      color: '#3b82f6',
    });
    recs.push({
      title: 'Strength training',
      desc: 'Focus on resistance exercises 3–4× per week to build muscle mass.',
      color: '#6366f1',
    });
  } else if (cat.label === 'Normal weight') {
    recs.push({
      title: 'Maintain your routine',
      desc: 'Great job! Aim for 150+ min moderate cardio and 2 strength sessions per week.',
      color: '#10b981',
    });
    recs.push({
      title: 'Stay hydrated',
      desc: 'Drink at least 8 glasses of water daily to support your metabolism.',
      color: '#10b981',
    });
  } else if (cat.label === 'Overweight') {
    recs.push({
      title: 'Increase cardio',
      desc: 'Target 200–300 min of moderate cardio per week (brisk walking, cycling).',
      color: '#f59e0b',
    });
    recs.push({
      title: 'Caloric deficit',
      desc: 'Reduce intake by 300–500 kcal/day while keeping protein intake high.',
      color: '#f59e0b',
    });
  } else {
    recs.push({
      title: 'Consult a healthcare professional',
      desc: 'A structured weight management plan supervised by a doctor is recommended.',
      color: '#ef4444',
    });
    recs.push({
      title: 'Low-impact cardio',
      desc: 'Start with walking or swimming 30 min/day to reduce joint stress.',
      color: '#ef4444',
    });
  }

  recs.push({
    title: 'Target BMI range',
    desc: `Your healthy BMI target is 18.5–24.9. Current: ${bmi}. ${
      bmi < 18.5 ? `Gain ${Math.round((18.5 * Math.pow(profile.height / 100, 2)) - profile.weight)} kg to reach lower bound.`
      : bmi > 25 ? `Lose ~${Math.round(profile.weight - (24.9 * Math.pow(profile.height / 100, 2)))} kg to reach upper bound.`
      : 'You\'re in the ideal range!'
    }`,
    color: '#a5b4fc',
  });

  return recs;
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
