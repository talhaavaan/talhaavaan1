import { useEffect, useRef, useState } from 'react';
import { BackgroundVideo } from './Hero';

const MARQUEE_TEXT = 'BUILDING THE FUTURE • ';
const WHATSAPP_NUMBER = '923065154510'; // international format, no +
const EMAIL = 'talhaavaan@gmail.com';

/* ── input/textarea shared base style ─────────────────────────── */
const fieldBase = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid hsl(var(--stroke))',
  borderRadius: 14,
  padding: '.85rem 1.1rem',
  color: 'hsl(var(--text))',
  fontFamily: "'Inter',sans-serif",
  fontSize: '.88rem',
  outline: 'none',
  transition: 'border-color .2s, background .2s',
  boxSizing: 'border-box',
};

export default function Footer() {
  const trackRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(null); // null | 'whatsapp' | 'email'
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const { gsap } = await import('gsap');
        gsap.to(trackRef.current, { xPercent: -50, duration: 25, ease: 'none', repeat: -1 });
      } catch { /* fallback */ }
    };
    run();
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const isEmpty = !form.name.trim() || !form.message.trim();

  const sendWhatsApp = () => {
    if (isEmpty) return;
    const text = `Hi Talha! I'm ${form.name}${form.email ? ` (${form.email})` : ''}.\n\n${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    setSent('whatsapp');
    setTimeout(() => setSent(null), 3000);
  };

  const sendEmail = () => {
    if (isEmpty) return;
    const subject = encodeURIComponent(`Project Inquiry from ${form.name}`);
    const body = encodeURIComponent(`Hi Talha,\n\n${form.message}\n\n— ${form.name}${form.email ? `\n${form.email}` : ''}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent('email');
    setTimeout(() => setSent(null), 3000);
  };

  const focusStyle = (name) => focusedField === name
    ? { borderColor: 'rgba(137,170,204,0.5)', background: 'rgba(137,170,204,0.05)' }
    : {};

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', paddingTop: '8rem', paddingBottom: '3rem', borderTop: '1px solid hsl(var(--stroke))' }}>
      <BackgroundVideo flipped />

      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* GSAP Marquee */}
        <div style={{ overflow: 'hidden', marginBottom: '5rem', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.2rem 0' }}>
          <div ref={trackRef} style={{ display: 'flex', whiteSpace: 'nowrap' }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} style={{
                fontFamily: "'Instrument Serif',serif", fontStyle: 'italic',
                fontSize: 'clamp(1.5rem,3vw,2.5rem)',
                color: 'rgba(255,255,255,0.12)',
                letterSpacing: '.05em', paddingRight: '1em',
                display: 'inline-block', flexShrink: 0,
              }}>{MARQUEE_TEXT}</span>
            ))}
          </div>
        </div>

        {/* ── Contact Form ─────────────────────────────────────────── */}
        <div style={{ maxWidth: 600, margin: '0 auto 5rem', padding: '0 2rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.75rem', marginBottom: '.75rem' }}>
              <div style={{ width: 24, height: 1, background: 'hsl(var(--stroke))' }} />
              <span style={{ fontSize: '.72rem', color: 'hsl(var(--muted))', textTransform: 'uppercase', letterSpacing: '.3em', fontFamily: "'Inter',sans-serif" }}>Get in touch</span>
              <div style={{ width: 24, height: 1, background: 'hsl(var(--stroke))' }} />
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Let's work{' '}
              <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>together</em>
            </h2>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>

            {/* Name + Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }}>
              <input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={{ ...fieldBase, ...focusStyle('name') }}
              />
              <input
                name="email"
                type="email"
                placeholder="Email (optional)"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={{ ...fieldBase, ...focusStyle('email') }}
              />
            </div>

            {/* Message */}
            <textarea
              name="message"
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              rows={5}
              style={{ ...fieldBase, ...focusStyle('message'), resize: 'vertical', lineHeight: 1.6 }}
            />

            {/* Send buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginTop: '.25rem' }}>

              {/* WhatsApp */}
              <button
                onClick={sendWhatsApp}
                disabled={isEmpty}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
                  padding: '.85rem 1.2rem', borderRadius: 9999,
                  background: sent === 'whatsapp' ? 'rgba(34,197,94,0.15)' : 'rgba(37,211,102,0.08)',
                  border: `1px solid ${sent === 'whatsapp' ? 'rgba(34,197,94,0.5)' : 'rgba(37,211,102,0.25)'}`,
                  color: sent === 'whatsapp' ? '#22c55e' : '#25D366',
                  fontFamily: "'Inter',sans-serif", fontSize: '.82rem', fontWeight: 500,
                  cursor: isEmpty ? 'not-allowed' : 'pointer',
                  opacity: isEmpty ? 0.4 : 1,
                  transition: 'all .2s',
                }}
                onMouseEnter={e => { if (!isEmpty) { e.currentTarget.style.background = 'rgba(37,211,102,0.15)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.5)'; } }}
                onMouseLeave={e => { if (!isEmpty && sent !== 'whatsapp') { e.currentTarget.style.background = 'rgba(37,211,102,0.08)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.25)'; } }}
              >
                {/* WhatsApp icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {sent === 'whatsapp' ? 'Opening WhatsApp…' : 'Send on WhatsApp'}
              </button>

              {/* Email */}
              <button
                onClick={sendEmail}
                disabled={isEmpty}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
                  padding: '.85rem 1.2rem', borderRadius: 9999,
                  background: sent === 'email' ? 'rgba(137,170,204,0.15)' : 'rgba(137,170,204,0.06)',
                  border: `1px solid ${sent === 'email' ? 'rgba(137,170,204,0.5)' : 'hsl(var(--stroke))'}`,
                  color: sent === 'email' ? '#89AACC' : 'hsl(var(--text))',
                  fontFamily: "'Inter',sans-serif", fontSize: '.82rem', fontWeight: 500,
                  cursor: isEmpty ? 'not-allowed' : 'pointer',
                  opacity: isEmpty ? 0.4 : 1,
                  transition: 'all .2s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { if (!isEmpty) { e.currentTarget.style.borderColor = 'rgba(137,170,204,0.4)'; e.currentTarget.style.background = 'rgba(137,170,204,0.1)'; } }}
                onMouseLeave={e => { if (!isEmpty && sent !== 'email') { e.currentTarget.style.borderColor = 'hsl(var(--stroke))'; e.currentTarget.style.background = 'rgba(137,170,204,0.06)'; } }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {sent === 'email' ? 'Opening Mail…' : 'Send via Email'}
              </button>

            </div>

            {/* Helper note */}
            <p style={{ textAlign: 'center', fontSize: '.72rem', color: 'hsl(var(--muted))', fontFamily: "'Inter',sans-serif", marginTop: '.25rem', opacity: 0.6 }}>
              WhatsApp opens the app with your message pre-filled · Email opens your mail client
            </p>
          </div>
        </div>

        {/* Footer bar */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '1.2rem', letterSpacing: '.02em' }}>
              Talha<span style={{ background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Avaan</span>
            </div>
            <div style={{ color: 'hsl(var(--muted))', fontSize: '.72rem', marginTop: '.25rem', fontFamily: "'Inter',sans-serif" }}>Video Editor · Rawalpindi</div>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[['Instagram', 'https://instagram.com'], ['YouTube', 'https://youtube.com'], ['LinkedIn', 'https://linkedin.com'], ['Behance', 'https://behance.net']].map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                style={{ color: 'hsl(var(--muted))', textDecoration: 'none', fontSize: '.8rem', fontFamily: "'Inter',sans-serif", transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent-from)'}
                onMouseLeave={e => e.target.style.color = 'hsl(var(--muted))'}
              >{name}</a>
            ))}
          </div>

          {/* Availability */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: 'hsl(var(--muted))', fontSize: '.78rem', fontFamily: "'Inter',sans-serif" }}>Available for projects</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'hsl(var(--muted))', fontSize: '.72rem', fontFamily: "'Inter',sans-serif" }}>
          © 2024 Talha Avaan. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
