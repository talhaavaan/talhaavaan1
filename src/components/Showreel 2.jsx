import { motion } from 'framer-motion';

const entries = [
  { title: 'Luxury Brand Campaign',     type: 'Commercial',   duration: '2 min', year: '2024', color: '#0e1420' },
  { title: 'Restaurant Food Reel',      type: 'Social Media', duration: '45 sec', year: '2024', color: '#0d1a14' },
  { title: 'Destination Wedding Film',  type: 'Wedding',      duration: '8 min', year: '2023', color: '#1a0d14' },
  { title: 'Penthouse Property Tour',   type: 'Real Estate',  duration: '3 min', year: '2024', color: '#141020' },
];

export default function Showreel() {
  return (
    <section id="showreel" style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1.5rem' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.75rem' }}>
              <div style={{ width: 32, height: 1, background: 'hsl(var(--stroke))' }} />
              <span style={{ fontSize: '.72rem', color: 'hsl(var(--muted))', textTransform: 'uppercase', letterSpacing: '.3em', fontFamily: "'Inter',sans-serif" }}>Showreel</span>
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Recent <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>works</em>
            </h2>
            <p style={{ color: 'hsl(var(--muted))', fontSize: '.88rem', marginTop: '.75rem', fontFamily: "'Inter',sans-serif" }}>Three minutes. Seven years of craft. Dozens of stories.</p>
          </div>
          <a
            href="#contact"
            style={{ padding: '.7rem 1.4rem', borderRadius: 9999, border: '1px solid hsl(var(--stroke))', color: 'hsl(var(--text))', textDecoration: 'none', fontSize: '.82rem', fontFamily: "'Inter',sans-serif", transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.color = 'var(--accent-from)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(var(--stroke))'; e.currentTarget.style.color = 'hsl(var(--text))'; }}
          >
            Hire me ↗
          </a>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, delay: 0.1 }}
          style={{ maxWidth: 900, margin: '0 auto 5rem', borderRadius: 24, overflow: 'hidden' }}
        >
          <video
            controls
            playsInline
            style={{ width: '100%', display: 'block' }}
          >
            <source src="/youtube-cow-cash.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {entries.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, delay: i * 0.08 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.1rem 1.4rem', borderRadius: 9999, background: 'hsl(var(--surface) / 0.4)', border: '1px solid hsl(var(--stroke))', transition: 'all .25s', cursor: 'pointer' }}
              onMouseEnter={e2 => { e2.currentTarget.style.background = 'hsl(var(--surface))'; e2.currentTarget.style.borderColor = 'rgba(137,170,204,0.25)'; }}
              onMouseLeave={e2 => { e2.currentTarget.style.background = 'hsl(var(--surface) / 0.4)'; e2.currentTarget.style.borderColor = 'hsl(var(--stroke))'; }}
            >
              <div style={{ width: 56, height: 40, borderRadius: 10, background: e.color, border: '1px solid hsl(var(--stroke))', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(137,170,204,0.5)"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '1rem', color: 'hsl(var(--text))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                <div style={{ fontSize: '.75rem', color: 'hsl(var(--muted))', fontFamily: "'Inter',sans-serif", marginTop: '.15rem' }}>{e.type}</div>
              </div>
              <div style={{ fontSize: '.75rem', color: 'hsl(var(--muted))', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>{e.duration}</div>
              <div style={{ fontSize: '.72rem', color: 'hsl(var(--muted))', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0, opacity: 0.6 }}>{e.year}</div>
              <div style={{ color: 'hsl(var(--muted))', flexShrink: 0, fontSize: '1rem' }}>→</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
