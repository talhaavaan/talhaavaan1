import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionValue } from 'framer-motion';

const timeline = [
  { year: '2017', title: 'Started Freelancing', desc: 'Began editing YouTube content and social media videos' },
  { year: '2019', title: 'Commercial Work',     desc: 'Expanded into commercial and brand storytelling' },
  { year: '2021', title: 'Color Grading Focus', desc: 'Specialized in cinematic color grading with DaVinci Resolve' },
  { year: '2024', title: 'Full-Service Studio', desc: 'Now offering complete post-production for global clients' },
  { year: '2025', title: 'Full-Service Studio', desc: 'Now offering complete post-production for global clients' },
];

const skills = ['Cinematic Editing', 'Color Grading', 'Motion Graphics', 'Sound Design', 'Short Form', 'YouTube', 'Commercial', 'Wedding Films'];

const HEADLINE = ['Crafting', 'Stories', 'Frame', 'by', 'Frame'];

export default function About() {
  const sectionRef = useRef(null);

  // Scroll progress across the whole pinned section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  // Headline reveal (0 → 0.35)
  // Timeline horizontal scrub (0.35 → 0.85)
  // Skills bloom (0.85 → 1)
  const headlineY      = useTransform(progress, [0, 0.35], ['40vh', '0vh']);
  const headlineScale  = useTransform(progress, [0, 0.35, 0.55], [1.15, 1, 0.78]);
  const headlineOpacity= useTransform(progress, [0.5, 0.62], [1, 0.15]);
  const headlineBlur   = useTransform(progress, [0.5, 0.62], ['0px', '6px']);

  const portraitScale  = useTransform(progress, [0, 0.35], [0.65, 1]);
  const portraitRotate = useTransform(progress, [0, 1], [-8, 8]);
  const portraitY      = useTransform(progress, [0.35, 0.85], ['0%', '-12%']);

  const railX          = useTransform(progress, [0.35, 0.85], ['10%', '-78%']);
  const railOpacity    = useTransform(progress, [0.3, 0.4, 0.82, 0.9], [0, 1, 1, 0.2]);

  const skillsOpacity  = useTransform(progress, [0.85, 0.95], [0, 1]);
  const skillsY        = useTransform(progress, [0.85, 1], [60, 0]);

  // Animated 7+ counter tied to scroll
  const yearsMV = useTransform(progress, [0, 0.35], [0, 7]);
  const yearsText = useMotionValue('0');
  useMotionValueEvent(yearsMV, 'change', v => yearsText.set(Math.round(v).toString()));

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '420vh', // tall scroll runway
        background: 'hsl(var(--bg))',
      }}
    >
      {/* Sticky stage */}
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Ambient grid + orbs */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'linear-gradient(hsl(var(--stroke)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--stroke)) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            opacity: 0.07,
            y: useTransform(progress, [0, 1], ['0%', '-25%']),
          }}
        />
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            top: '10%', left: '5%', width: 520, height: 520, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(137,170,204,0.22), transparent 60%)',
            filter: 'blur(20px)',
            x: useTransform(progress, [0, 1], ['-10%', '20%']),
            y: useTransform(progress, [0, 1], ['0%', '30%']),
          }}
        />
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '5%', right: '5%', width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(78,133,191,0.18), transparent 60%)',
            filter: 'blur(20px)',
            x: useTransform(progress, [0, 1], ['10%', '-25%']),
            y: useTransform(progress, [0, 1], ['0%', '-20%']),
          }}
        />

        {/* Section label */}
        <motion.p
          style={{
            position: 'absolute', top: '2.2rem', left: '50%', x: '-50%',
            fontSize: '.7rem', fontWeight: 600, letterSpacing: '.4em',
            textTransform: 'uppercase', color: 'var(--accent-from)',
            fontFamily: "'Inter',sans-serif",
            opacity: useTransform(progress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]),
          }}
        >
          About — Talha Avaan
        </motion.p>

        {/* Portrait card (sticky behind the text) */}
        <motion.div
          style={{
            position: 'absolute',
            width: 'min(360px, 32vw)', aspectRatio: '3/4',
            borderRadius: 28,
            background: 'linear-gradient(135deg, hsl(var(--surface)), hsl(var(--bg)))',
            border: '1px solid hsl(var(--stroke))',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '1rem',
            scale: portraitScale, rotate: portraitRotate, y: portraitY,
            boxShadow: '0 30px 80px -30px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{
            position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)',
            width: 240, height: 240, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(137,170,204,0.18), transparent 70%)',
          }} />
          <svg width="92" height="92" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.25 }}>
            <circle cx="40" cy="28" r="16" stroke="url(#ag2)" strokeWidth="2" />
            <path d="M10 72c0-16.569 13.431-30 30-30s30 13.431 30 30" stroke="url(#ag2)" strokeWidth="2" />
            <defs><linearGradient id="ag2" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#89AACC" /><stop offset="1" stopColor="#4E85BF" /></linearGradient></defs>
          </svg>
          <span style={{
            fontFamily: "'Inter',sans-serif", color: 'hsl(var(--muted))',
            fontSize: '.7rem', letterSpacing: '.3em', textTransform: 'uppercase',
          }}>Talha Avaan</span>

          {/* Years counter badge */}
          <motion.div
            style={{
              position: 'absolute', bottom: '1.2rem', right: '-1.2rem',
              background: 'hsl(var(--bg))', border: '1px solid rgba(137,170,204,0.4)',
              borderRadius: 18, padding: '1rem 1.3rem', backdropFilter: 'blur(20px)',
              textAlign: 'center', minWidth: 110,
            }}
          >
            <div style={{
              fontFamily: "'Instrument Serif',serif", fontSize: '2.4rem', fontWeight: 700,
              background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              lineHeight: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center',
            }}>
              <motion.span>{yearsText}</motion.span><span>+</span>
            </div>
            <div style={{ fontSize: '.7rem', color: 'hsl(var(--muted))', fontFamily: "'Inter',sans-serif", marginTop: 4 }}>
              Years editing
            </div>
          </motion.div>
        </motion.div>

        {/* Giant scroll-revealing headline */}
        <motion.h2
          style={{
            position: 'relative', zIndex: 2, margin: 0, padding: '0 2rem',
            textAlign: 'center', pointerEvents: 'none',
            fontFamily: "'Instrument Serif',serif", fontStyle: 'italic',
            fontSize: 'clamp(3rem, 9vw, 8.5rem)', lineHeight: 0.95,
            letterSpacing: '-0.03em',
            y: headlineY, scale: headlineScale,
            opacity: headlineOpacity, filter: useTransform(headlineBlur, b => `blur(${b})`),
            mixBlendMode: 'difference', color: '#fff',
          }}
        >
          {HEADLINE.map((word, i) => {
            const start = i / (HEADLINE.length * 1.8);
            const end = start + 0.18;
            const wOpacity = useTransform(progress, [start, end], [0, 1]);
            const wY = useTransform(progress, [start, end], [60, 0]);
            const isAccent = word === 'Frame' || word === 'by';
            return (
              <motion.span
                key={i}
                style={{
                  display: 'inline-block', margin: '0 .25em',
                  opacity: wOpacity, y: wY,
                  background: isAccent
                    ? 'linear-gradient(90deg,var(--accent-from),var(--accent-to))'
                    : undefined,
                  WebkitBackgroundClip: isAccent ? 'text' : undefined,
                  WebkitTextFillColor: isAccent ? 'transparent' : undefined,
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </motion.h2>

        {/* Intro paragraph rising into view */}
        <motion.p
          style={{
            position: 'absolute', bottom: '14vh', left: '50%', x: '-50%',
            maxWidth: 560, textAlign: 'center', padding: '0 1.5rem',
            color: 'hsl(var(--muted))', fontFamily: "'Inter',sans-serif",
            fontSize: '1rem', lineHeight: 1.7,
            opacity: useTransform(progress, [0.18, 0.32, 0.5, 0.6], [0, 1, 1, 0]),
            y: useTransform(progress, [0.18, 0.32], [40, 0]),
          }}
        >
          I'm Talha Avaan, a professional video editor with 7+ years of experience turning raw footage into cinematic narratives — from viral social content to high-end commercial work.
        </motion.p>

        {/* Horizontal timeline rail */}
        <motion.div
          style={{
            position: 'absolute', top: '50%', y: '-50%',
            left: 0, width: '100%',
            opacity: railOpacity,
          }}
        >
          <motion.div
            style={{
              display: 'flex', gap: '6vw', paddingLeft: '20vw', paddingRight: '20vw',
              x: railX, willChange: 'transform',
            }}
          >
            {timeline.map((item, i) => (
              <div
                key={item.year}
                style={{
                  flex: '0 0 auto', width: 'min(420px, 70vw)',
                  padding: '2rem 2.2rem',
                  border: '1px solid hsl(var(--stroke))',
                  borderRadius: 24,
                  background: 'linear-gradient(160deg, hsl(var(--surface)), hsl(var(--bg)))',
                  backdropFilter: 'blur(12px)',
                  position: 'relative',
                }}
              >
                <div style={{
                  fontFamily: "'Instrument Serif',serif", fontStyle: 'italic',
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, lineHeight: 1,
                  background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem',
                }}>{item.year}</div>
                <div style={{
                  fontFamily: "'Inter',sans-serif", fontSize: '1.1rem', fontWeight: 600,
                  marginBottom: '.5rem', color: 'hsl(var(--fg, 0 0% 98%))',
                }}>{item.title}</div>
                <div style={{
                  fontSize: '.92rem', color: 'hsl(var(--muted))',
                  fontFamily: "'Inter',sans-serif", lineHeight: 1.6,
                }}>{item.desc}</div>
                <div style={{
                  position: 'absolute', top: 20, right: 24,
                  fontFamily: "'Inter',sans-serif", fontSize: '.7rem',
                  letterSpacing: '.25em', color: 'hsl(var(--muted))', opacity: 0.6,
                }}>0{i + 1} / 0{timeline.length}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Skills bloom */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: skillsOpacity, y: skillsY, pointerEvents: 'none',
          }}
        >
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '.6rem',
            maxWidth: 720, justifyContent: 'center', padding: '0 2rem',
          }}>
            <p style={{
              width: '100%', textAlign: 'center', marginBottom: '1rem',
              fontFamily: "'Instrument Serif',serif", fontStyle: 'italic',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            }}>
              The craft, distilled.
            </p>
            {skills.map(s => (
              <span key={s} style={{
                padding: '.5rem 1.1rem', border: '1px solid rgba(137,170,204,0.35)',
                borderRadius: 100, fontSize: '.82rem', color: 'hsl(var(--muted))',
                fontFamily: "'Inter',sans-serif",
                background: 'hsla(0,0%,0%,0.25)', backdropFilter: 'blur(8px)',
              }}>{s}</span>
            ))}
          </div>
        </motion.div>

        {/* Scroll progress bar */}
        <motion.div
          style={{
            position: 'absolute', left: 0, bottom: 0, height: 2,
            background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))',
            width: useTransform(progress, p => `${p * 100}%`),
          }}
        />
      </div>
    </section>
  );
}
