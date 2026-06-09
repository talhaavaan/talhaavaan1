import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── HLS Video ─────────────────────────────────────────────────────────────── */
const HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
const MP4_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4';

export function BackgroundVideo({ flipped = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cleanup = () => {};
    const load = async () => {
      try {
        const { default: Hls } = await import('hls.js');
        if (Hls.isSupported()) {
          const hls = new Hls({ startLevel: -1 });
          hls.loadSource(HLS_SRC);
          hls.attachMedia(video);
          cleanup = () => hls.destroy();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = HLS_SRC;
        } else {
          video.src = MP4_SRC;
        }
      } catch {
        video.src = MP4_SRC;
      }
    };
    load();
    return () => cleanup();
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        style={{
          position: 'absolute', top: '50%', left: '50%',
          minWidth: '100%', minHeight: '100%', objectFit: 'cover',
          transform: `translate(-50%,-50%)${flipped ? ' scaleY(-1)' : ''}`,
        }}
      >
        {!HLS_SRC && <source src={MP4_SRC} type="video/mp4" />}
      </video>
      <div style={{ position: 'absolute', inset: 0, background: flipped ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '12rem', background: 'linear-gradient(to top, hsl(var(--bg)), transparent)' }} />
    </div>
  );
}

/* ── Pill Navbar ────────────────────────────────────────────────────────────── */
const NAV_LINKS = ['Home', 'Work', 'Services', 'Process', 'Contact'];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'center',
        paddingTop: '1.25rem', paddingLeft: '1rem', paddingRight: '1rem',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          borderRadius: 9999, backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'hsl(var(--surface))',
          padding: '0.35rem',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
          transition: 'box-shadow 0.4s',
          gap: '0.2rem',
        }}>
          {/* Logo ring */}
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'hsl(var(--bg))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', transition: 'transform 0.3s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.querySelector('.logo-ring').style.background =
                'linear-gradient(315deg, var(--accent-from), var(--accent-to))';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.querySelector('.logo-ring').style.background =
                'linear-gradient(135deg, var(--accent-from), var(--accent-to))';
            }}
          >
            <div className="logo-ring" style={{
              position: 'absolute', inset: -2, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
              zIndex: -1, transition: 'background 0.4s',
            }} />
            <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '11px', color: 'hsl(var(--text))' }}>TA</span>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: 'hsl(var(--stroke))', margin: '0 4px' }} className="hidden-xs" />

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: '2px' }} className="nav-links-desktop">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                onClick={() => setActive(link)}
                style={{
                  fontSize: '0.78rem', borderRadius: 9999,
                  padding: '0.38rem 0.85rem', textDecoration: 'none',
                  color: active === link ? 'hsl(var(--text))' : 'hsl(var(--muted))',
                  background: active === link ? 'hsl(var(--stroke))' : 'transparent',
                  transition: 'all 0.2s', fontFamily: "'Inter',sans-serif",
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (active !== link) { e.currentTarget.style.color = 'hsl(var(--text))'; e.currentTarget.style.background = 'hsl(var(--stroke))'; } }}
                onMouseLeave={e => { if (active !== link) { e.currentTarget.style.color = 'hsl(var(--muted))'; e.currentTarget.style.background = 'transparent'; } }}
              >{link}</a>
            ))}
          </nav>

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: 'hsl(var(--stroke))', margin: '0 4px' }} className="hidden-xs" />

          {/* Say hi */}
          <a href="#contact" style={{
            position: 'relative', fontSize: '0.78rem',
            padding: '0.38rem 0.85rem', borderRadius: 9999,
            color: 'hsl(var(--text))', textDecoration: 'none',
            fontFamily: "'Inter',sans-serif", overflow: 'hidden',
            display: 'inline-block', zIndex: 0,
          }}
            onMouseEnter={e => e.currentTarget.querySelector('.hi-ring').style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.querySelector('.hi-ring').style.opacity = '0'}
          >
            <span className="hi-ring" style={{
              position: 'absolute', inset: -2, borderRadius: 9999,
              background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))',
              opacity: 0, transition: 'opacity 0.2s', zIndex: -1,
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>Say hi ↗</span>
          </a>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', padding: '6px', display: 'none', flexDirection: 'column', gap: 4 }}
            className="nav-hamburger"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 20, height: 1.5, background: 'hsl(var(--text))', transition: 'all .3s',
                transform: menuOpen ? (i===0?'rotate(45deg) translate(4px,4px)':i===1?'scaleX(0)':'rotate(-45deg) translate(4px,-4px)') : 'none',
                opacity: menuOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'hsl(var(--bg) / 0.97)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem',
        }}>
          {[...NAV_LINKS, 'Say hi'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ','')}`}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily:"'Instrument Serif',serif", fontStyle:'italic', fontSize:'2.5rem', color:'hsl(var(--text))', textDecoration:'none' }}
            >{l}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 680px) {
          .nav-links-desktop { display: none !important; }
          .hidden-xs { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
const ROLES = ['Editor', 'Colorist', 'Storyteller', 'Creator'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const { gsap } = await import('gsap');
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.name-reveal',  { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1 });
        tl.fromTo('.blur-in', { opacity: 0, filter: 'blur(10px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 }, '-=0.8');
      } catch {/* gsap not installed yet, framer handles it */}
    };
    run();
  }, []);

  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <BackgroundVideo />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1.5rem', maxWidth: 900 }}>

        {/* Eyebrow */}
        <motion.p className="blur-in"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ fontSize: '0.68rem', color: 'hsl(var(--muted))', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2rem', fontFamily: "'Inter',sans-serif" }}
        >
          COLLECTION '26
        </motion.p>

        {/* Name */}
        <h1 className="name-reveal" style={{
          fontFamily: "'Instrument Serif',serif", fontStyle: 'italic',
          fontSize: 'clamp(3.5rem,11vw,8rem)', lineHeight: 0.9,
          letterSpacing: '-0.02em', color: 'hsl(var(--text))',
          marginBottom: '1.5rem', opacity: 0,
        }}>
          Talha Avaan
        </h1>

        {/* Role cycling */}
        <motion.p className="blur-in"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }}
          style={{ fontSize: 'clamp(0.85rem,2vw,1.05rem)', color: 'hsl(var(--muted))', marginBottom: '1.2rem', fontFamily: "'Inter',sans-serif" }}
        >
          A{' '}
          <AnimatePresence mode="wait">
            <motion.span key={roleIndex}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', color: 'hsl(var(--text))', display: 'inline-block' }}
            >
              {ROLES[roleIndex]}
            </motion.span>
          </AnimatePresence>
          {' '}crafting cinematic stories from Rawalpindi.
        </motion.p>

        {/* Description */}
        <motion.p className="blur-in"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }}
          style={{ fontSize: '0.88rem', color: 'hsl(var(--muted))', maxWidth: 440, margin: '0 auto 3rem', lineHeight: 1.7, fontFamily: "'Inter',sans-serif" }}
        >
          7+ years turning raw footage into cinematic narratives. From viral social media content to high-end commercial productions.
        </motion.p>

        {/* CTAs */}
        <motion.div className="blur-in"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.3 }}
          style={{ display: 'inline-flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="#work" className="cta-solid">See Works</a>
          <a href="#contact" className="cta-outline">Reach out...</a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 10,
      }}>
        <span style={{ fontSize: '0.6rem', color: 'hsl(var(--muted))', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: 'hsl(var(--stroke))', position: 'relative', overflow: 'hidden' }}>
          <div className="animate-scroll-down" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--accent-from), var(--accent-to))' }} />
        </div>
      </div>

      <style>{`
        .cta-solid {
          position: relative; padding: 0.875rem 1.75rem; border-radius: 9999px;
          font-size: 0.85rem; font-family: 'Inter',sans-serif; font-weight: 600;
          text-decoration: none; background: hsl(var(--text)); color: hsl(var(--bg));
          transition: all 0.25s; display: inline-block; z-index: 0; overflow: hidden;
        }
        .cta-solid:hover { transform: scale(1.05); background: hsl(var(--bg)); color: hsl(var(--text)); }
        .cta-solid::before {
          content:''; position:absolute; inset:-2px; border-radius:9999px;
          background:linear-gradient(90deg,var(--accent-from),var(--accent-to));
          z-index:-1; opacity:0; transition:opacity 0.2s;
        }
        .cta-solid:hover::before { opacity: 1; }
        .cta-outline {
          position: relative; padding: 0.875rem 1.75rem; border-radius: 9999px;
          font-size: 0.85rem; font-family: 'Inter',sans-serif; font-weight: 600;
          text-decoration: none; border: 2px solid hsl(var(--stroke));
          color: hsl(var(--text)); background: hsl(var(--bg));
          transition: all 0.25s; display: inline-block; z-index: 0; overflow: hidden;
        }
        .cta-outline:hover { transform: scale(1.05); border-color: transparent; }
        .cta-outline::before {
          content:''; position:absolute; inset:-2px; border-radius:9999px;
          background:linear-gradient(90deg,var(--accent-from),var(--accent-to));
          z-index:-1; opacity:0; transition:opacity 0.2s;
        }
        .cta-outline:hover::before { opacity: 1; }
      `}</style>
    </section>
  );
}
