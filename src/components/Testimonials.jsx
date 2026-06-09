import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Restaurant Owner',
    project: 'Food Commercial',
    text: 'Talha transformed our menu items into mouthwatering visuals. Our Instagram engagement increased 340% after the first video. Absolutely cinematic work.',
    initials: 'SM',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    name: 'James Kowalski',
    role: 'Real Estate Developer',
    project: 'Property Showcase',
    text: 'Every luxury listing we send him comes back looking like a feature film. Clients love it. Properties sell faster. Worth every penny.',
    initials: 'JK',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
  },
  {
    name: 'Priya Sharma',
    role: 'YouTube Creator',
    project: 'YouTube Editing',
    text: 'I went from 10k to 85k subscribers in 6 months after working with Talha. His retention-focused editing strategy is genuinely game-changing.',
    initials: 'PS',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  },
  {
    name: 'Carlos Mendez',
    role: 'Brand Manager',
    project: 'Commercial Campaign',
    text: 'Our product launch video hit 2M views organically. The edit, pacing, and color grade were flawless. Best investment we made this year.',
    initials: 'CM',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    name: 'Emma Larson',
    role: 'Wedding Photographer',
    project: 'Wedding Film',
    text: 'I refer all my clients to Talha for their wedding films. The emotional storytelling and cinematic quality are unmatched.',
    initials: 'EL',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
  {
    name: 'David Park',
    role: 'Fitness Influencer',
    project: 'Short Form Content',
    text: 'My reels went viral 3 times in the same month. Talha understands the algorithm and more importantly, storytelling.',
    initials: 'DP',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
];

const BG_IMAGE = 'https://images.unsplash.com/photo-1528458965990-428de4b1cb0d?q=80&w=800&auto=format&fit=crop';

function useOutsideClick(ref, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [ref, callback]);
}

function TestimonialCard({ t, index }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setExpanded(false));

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (expanded) {
      const y = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${y}px`;
      document.body.style.width = '100%';
      document.body.dataset.scrollY = y;
    } else {
      const y = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  }, [expanded]);

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflow: 'hidden' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            />
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 60 }}>
              <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{ background: 'linear-gradient(to bottom,#f2f0eb,#fff9eb)', borderRadius: 24, padding: '2.5rem', maxWidth: 600, width: '100%', position: 'relative' }}
              >
                <button
                  onClick={() => setExpanded(false)}
                  style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: '#4b3f33', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <p style={{ color: 'rgba(31,27,29,0.6)', fontSize: '.9rem', fontStyle: 'italic', textDecoration: 'underline', marginBottom: '.5rem', fontFamily: 'serif' }}>{t.role} · {t.project}</p>
                <p style={{ color: 'rgba(31,27,29,0.8)', fontSize: '1.5rem', fontStyle: 'italic', fontFamily: 'serif', marginBottom: '1.5rem', textTransform: 'lowercase' }}>{t.name}.</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(31,27,29,0.4)" style={{ marginBottom: '.75rem' }}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                <p style={{ color: 'rgba(31,27,29,0.75)', fontSize: '1.1rem', fontFamily: 'serif', lineHeight: 1.7, textTransform: 'lowercase', fontWeight: 300 }}>{t.text}</p>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setExpanded(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 * index } }}
        whileHover={{ rotate: 2, scale: 1.03, transition: { duration: 0.3 } }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
      >
        <div style={{
          width: 300, height: 420,
          background: 'linear-gradient(to bottom,#f2f0eb,#fff9eb)',
          borderRadius: 24, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          padding: '2rem 1.5rem',
        }}>
          {/* Background image overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
            <img src={BG_IMAGE} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Profile image */}
          <div style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(59,59,59,0.4)', marginBottom: '1.2rem', flexShrink: 0, position: 'relative', zIndex: 1, filter: 'saturate(0.3) sepia(0.4)' }}>
            <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Quote text */}
          <p style={{ color: 'rgba(31,27,29,0.75)', fontSize: '.88rem', textAlign: 'center', fontFamily: 'serif', lineHeight: 1.6, textTransform: 'lowercase', fontWeight: 300, position: 'relative', zIndex: 1, marginBottom: '1rem' }}>
            {t.text.length > 100 ? `${t.text.slice(0, 100)}...` : t.text}
          </p>

          {/* Name */}
          <p style={{ color: 'rgba(31,27,29,0.8)', fontSize: '1.1rem', fontStyle: 'italic', fontFamily: 'serif', textAlign: 'center', textTransform: 'lowercase', position: 'relative', zIndex: 1, marginBottom: '.25rem' }}>
            {t.name}.
          </p>

          {/* Role */}
          <p style={{ color: 'rgba(31,27,29,0.55)', fontSize: '.78rem', fontStyle: 'italic', fontFamily: 'serif', textAlign: 'center', textTransform: 'lowercase', textDecoration: 'underline', textUnderlineOffset: 4, position: 'relative', zIndex: 1 }}>
            {t.role}
          </p>
        </div>
      </motion.button>
    </>
  );
}

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '8rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', marginBottom: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 1, background: 'hsl(var(--stroke))' }} />
            <span style={{ fontSize: '.72rem', color: 'hsl(var(--muted))', textTransform: 'uppercase', letterSpacing: '.3em', fontFamily: "'Inter',sans-serif" }}>Client Love</span>
            <div style={{ width: 32, height: 1, background: 'hsl(var(--stroke))' }} />
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.02em' }}>
            What Clients{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Say</em>
          </h2>
        </motion.div>
      </div>

      {/* Scrollable carousel */}
      <div style={{ position: 'relative' }}>
        <div
          style={{ maskImage: 'linear-gradient(90deg,transparent,black 6%,black 94%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 6%,black 94%,transparent)' }}
        >
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', scrollbarWidth: 'none', padding: '1.5rem 4rem', scrollSnapType: 'x mandatory' }}
          >
            {testimonials.map((t, i) => (
              <div key={t.name} style={{ scrollSnapAlign: 'start' }}>
                <TestimonialCard t={t} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Arrow buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.75rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => scrollBy(-1)}
            disabled={!canLeft}
            style={{ width: 40, height: 40, borderRadius: '50%', background: '#4b3f33', border: 'none', cursor: canLeft ? 'pointer' : 'default', opacity: canLeft ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity .2s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f2f0eb" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canRight}
            style={{ width: 40, height: 40, borderRadius: '50%', background: '#4b3f33', border: 'none', cursor: canRight ? 'pointer' : 'default', opacity: canRight ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity .2s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f2f0eb" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
