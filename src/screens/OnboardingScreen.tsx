import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../utils/sound';

const KEY = 'aers_onboarding_v1';

type OnboardingState = {
  consent: boolean;
  privacy: boolean;
  participation: boolean;
  baseA: boolean; baseB: boolean; baseC: boolean; baseD: boolean; baseE: boolean;
  pathwayAcknowledged: boolean;
};

function load(): OnboardingState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { consent: false, privacy: false, participation: false, baseA: false, baseB: false, baseC: false, baseD: false, baseE: false, pathwayAcknowledged: false };
}

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [s, setS] = useState<OnboardingState>(() => load());
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, [s]);

  const week1Done = s.consent && s.privacy && s.participation;
  const baselineDone = s.baseA && s.baseB && s.baseC && s.baseD && s.baseE;
  const allDone = week1Done && baselineDone && s.pathwayAcknowledged;

  const toggle = (k: keyof OnboardingState) => { sound.playTap(); setS((p) => ({ ...p, [k]: !p[k] })); };

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', padding: 16, paddingBottom: 32 }}>
      <button onClick={() => { sound.playTap(); navigate('/journey'); }} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, padding: '6px 10px', fontSize: 13, cursor: 'pointer' }}>← Back to Journey</button>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: '14px 0 4px' }}>Assess &amp; Personalise — Weeks 1–2</h1>
      <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>Foundation pack: orientation, consent, baseline &amp; personalised pathway. Complete this to unlock Module 1.</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => setStep(1)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: step === 1 ? '2px solid #0066f5' : '1px solid #e2e8f0', background: step === 1 ? '#eff6ff' : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Week 1 — Onboarding</button>
        <button onClick={() => setStep(2)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: step === 2 ? '2px solid #0066f5' : '1px solid #e2e8f0', background: step === 2 ? '#eff6ff' : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Week 2 — Pathway</button>
      </div>

      {step === 1 ? (
        <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 6px' }}>Orientation</h3>
            <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>What is AERS Transform, what you will do, what AERS will not do, and where to get support. Confirm you have read the overview.</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Consent &amp; Privacy (required)</h3>
            {(['consent', 'privacy', 'participation'] as const).map((k) => (
              <label key={k} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, margin: '8px 0', cursor: 'pointer' }}>
                <input type="checkbox" checked={s[k]} onChange={() => toggle(k)} />
                <span>{k === 'consent' ? 'I consent to participation, data use, and assessment as described.' : k === 'privacy' ? 'I have read the privacy and responsible-participation notice.' : 'I agree to responsible participation (truthfulness, no fabrication, AI declared where used).'}</span>
              </label>
            ))}
            {!week1Done && <p style={{ fontSize: 11, color: '#b45309', margin: '6px 0 0' }}>All three required before baseline.</p>}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Baseline instruments (A–E)</h3>
            {([
              ['baseA', 'A — Career Clarity baseline'],
              ['baseB', 'B — Résumé baseline'],
              ['baseC', 'C — Communication (15-min written + 90-sec speaking)'],
              ['baseD', 'D — Aptitude baseline'],
              ['baseE', 'E — Interview & Workplace baseline'],
            ] as const).map(([k, label]) => (
              <label key={k} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, margin: '8px 0', cursor: 'pointer' }}>
                <input type="checkbox" checked={s[k as keyof OnboardingState] as boolean} onChange={() => toggle(k as keyof OnboardingState)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 6px' }}>Baseline summary &amp; pathway</h3>
            <p style={{ fontSize: 12, color: '#475569', margin: '0 0 8px' }}>Your facilitator will share development priorities and your personalised pathway. Acknowledge to unlock the Journey.</p>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={s.pathwayAcknowledged} onChange={() => toggle('pathwayAcknowledged')} />
              <span>I acknowledge my pathway and priorities. Ready to start Module 1.</span>
            </label>
            {!baselineDone && <p style={{ fontSize: 11, color: '#b45309', margin: '6px 0 0' }}>Complete A–E before acknowledging.</p>}
          </div>
        </div>
      )}

      <button
        disabled={!allDone}
        onClick={() => { sound.playLevelSuccess(); try { localStorage.setItem(KEY, JSON.stringify({ ...s, completedAt: new Date().toISOString() })); } catch {} navigate('/journey'); }}
        style={{ width: '100%', marginTop: 16, padding: '12px 0', borderRadius: 10, border: 'none', background: allDone ? '#0066f5' : '#cbd5e1', color: '#fff', fontWeight: 800, fontSize: 14, cursor: allDone ? 'pointer' : 'not-allowed' }}
      >
        {allDone ? 'Complete onboarding & unlock Journey →' : 'Complete all checks to continue'}
      </button>
      <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 8 }}>No Module 1 release while a critical hold remains — per Developer Matrix.</p>
    </div>
  );
}
