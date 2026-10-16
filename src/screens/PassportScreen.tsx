import { useNavigate } from 'react-router-dom';

export function PassportScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', padding: 16, paddingBottom: 32 }}>
      <button onClick={() => navigate('/journey')} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, padding: '6px 10px', fontSize: 13, cursor: 'pointer' }}>← Back to Journey</button>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: '14px 0 4px' }}>Week 16 — Final ERI, Employability Passport &amp; Progression Plan</h1>
      <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>7-domain ERI (evidence across 16 weeks). Passport labels: Verified / Developing / Evidence Pending. Controlled draft → validate → correct → approve → release. No auto-issuance. No degree/job guarantee disclaimer applies.</p>

      <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 6px' }}>ERI evidence inventory &amp; interpretation</h3>
          <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>Baseline → Midpoint → Final comparison, authorised reviewer interpretation only, draft hidden until moderator approval. Numeric only with approved versioned method.</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 6px' }}>Employability Passport</h3>
          <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>Capability summary uses public labels — <strong>Verified</strong> / <strong>Developing</strong> / <strong>Evidence Pending</strong>. Sharing status controlled; versioned and revokable. View the full credential via Journey’s passport (top of map) when unlocked.</p>
          <button onClick={() => navigate('/journey')} style={{ marginTop: 10, padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Open Journey passport →</button>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 6px' }}>30 / 60 / 90-day progression plan</h3>
          <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>Required action areas, referral/continuing-development record, completion decision and release. Your facilitator will issue the plan after the final evidence conference.</p>
        </div>
      </div>

      <div style={{ marginTop: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, fontSize: 11, color: '#64748b' }}>
        <strong>Controls:</strong> ERI draft-only until approved; no invented numeric; passport sharing controlled; audit: role/institution/cohort isolation; disclaimer: Transform does not guarantee a degree or job.
      </div>
    </div>
  );
}
