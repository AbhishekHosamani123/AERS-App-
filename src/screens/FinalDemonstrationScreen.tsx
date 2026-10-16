import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AERS_LEVELS } from '../data/journeyData';

const JOURNEY_KEY = 'aers_journey_progress_v4';
const DEMO_KEY = 'aers_week15_demo_v1';

type DemoState = { acknowledged: boolean; panelComplete: boolean; taskComplete: boolean; reflectionDone: boolean; };

function allVerified(): boolean {
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    if (!raw) return false;
    const p = JSON.parse(raw);
    return AERS_LEVELS.every((l) => (p.completedLevels || []).includes(l.id));
  } catch { return false; }
}

export function FinalDemonstrationScreen() {
  const navigate = useNavigate();
  const eligible = useMemo(() => allVerified(), []);
  const [s, setS] = useState<DemoState>(() => { try { const r = localStorage.getItem(DEMO_KEY); if (r) return JSON.parse(r); } catch {} return { acknowledged: false, panelComplete: false, taskComplete: false, reflectionDone: false }; });
  useEffect(() => { try { localStorage.setItem(DEMO_KEY, JSON.stringify(s)); } catch {} }, [s]);
  const done = s.acknowledged && s.panelComplete && s.taskComplete && s.reflectionDone;

  const toggle = (k: keyof DemoState) => setS((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', padding: 16, paddingBottom: 32 }}>
      <button onClick={() => navigate('/journey')} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, padding: '6px 10px', fontSize: 13, cursor: 'pointer' }}>← Back to Journey</button>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: '14px 0 4px' }}>Week 15 — Final Demonstration &amp; Reassessment</h1>
      <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>Eligibility: all 6 modules human-verified. Panel interview, employer-style task, and moderation. Outcome: Complete / Re-attempt / Hold.</p>
      {!eligible && <div style={{ marginTop: 12, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: 10, fontSize: 12 }}>Not yet eligible — complete all 24 levels (6/10 + revisions acknowledged per module) before this gate unlocks.</div>}

      <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 6px' }}>6-Module consolidation (Baseline → Current)</h3>
          <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>Your facilitator prepares the consolidation table and confirms evidence handover from Module 6. Review and acknowledge below.</p>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, marginTop: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={s.acknowledged} onChange={() => toggle('acknowledged')} />
            <span>I have reviewed my 6-module consolidation and evidence check.</span>
          </label>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Panel &amp; demonstration</h3>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, margin: '8px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={s.panelComplete} onChange={() => toggle('panelComplete')} />
            <span>Panel interview completed (structured question bank, independent scoring, calibration).</span>
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, margin: '8px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={s.taskComplete} onChange={() => toggle('taskComplete')} />
            <span>Employer-style task / discussion + observation rubric completed.</span>
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, margin: '8px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={s.reflectionDone} onChange={() => toggle('reflectionDone')} />
            <span>Post-interview reflection and professional presence review submitted.</span>
          </label>
        </div>
      </div>

      <button disabled={!eligible || !done} onClick={() => navigate('/passport')} style={{ width: '100%', marginTop: 16, padding: '12px 0', borderRadius: 10, border: 'none', background: eligible && done ? '#0066f5' : '#cbd5e1', color: '#fff', fontWeight: 800, fontSize: 14, cursor: eligible && done ? 'pointer' : 'not-allowed' }}>
        Continue to Week 16 — ERI &amp; Passport →
      </button>
      <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 8 }}>Controlled reassessment is comparable (not reuse) — fairness &amp; moderation apply.</p>
    </div>
  );
}
