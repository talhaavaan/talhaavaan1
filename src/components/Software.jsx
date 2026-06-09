import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

const software = [
  { name: 'Adobe Premiere Pro', short: 'Primary Editing Suite',  pct: 97, abbr: 'Pr', bg: 'linear-gradient(135deg,#9999FF,#6666FF)' },
  { name: 'Adobe After Effects', short: 'Motion Graphics & VFX', pct: 92, abbr: 'Ae', bg: 'linear-gradient(135deg,#9999FF,#AA77DD)' },
  { name: 'Adobe Photoshop',    short: 'Thumbnails & Graphics',  pct: 85, abbr: 'Ps', bg: 'linear-gradient(135deg,#2266AA,#3377CC)' },
  { name: 'DaVinci Resolve',    short: 'Color Grading',          pct: 90, abbr: 'DV', bg: 'linear-gradient(135deg,#FF3333,#BB1111)' },
  { name: 'Final Cut Pro',      short: 'Fast Turnaround',        pct: 80, abbr: 'FC', bg: 'linear-gradient(135deg,#888,#555)' },
  { name: 'Audition',           short: 'Audio Mixing',           pct: 78, abbr: 'Au', bg: 'linear-gradient(135deg,#22AAAA,#117777)' },
];

// Infinite slider — loops children seamlessly
function InfiniteSlider({ children, duration = 30, gap = 48 }) {
  const translation = useMotionValue(0);
  const containerRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    // measure single set of children
    const w = containerRef.current.scrollWidth / 2;
    setContentWidth(w);
  }, []);

  useEffect(() => {
    if (!contentWidth) return;
    const total = contentWidth + gap;
    const controls = animate(translation, [0, -total], {
      ease: 'linear',
      duration,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
      onRepeat: () => translation.set(0),
    });
    return controls.stop;
  }, [contentWidth, duration, gap, translation, key]);

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        ref={containerRef}
        style={{ display: 'flex', x: translation, gap: `${gap}px`, width: 'max-content', alignItems: 'center' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Particle canvas sparkles
function Sparkles({ color = '#89aacc', density = 80 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, raf;
    const pts = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < density; i++) {
      pts.push({
        x: Math.random() * 1000, y: Math.random() * 300,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        size: Math.random() * 1.5 + .3,
        opacity: Math.random() * .5 + .1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * .02 + .01,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const op = p.opacity * (.6 + .4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(op * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

function SoftwareChip({ sw }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '.75rem',
      background: 'hsl(var(--surface))', border: '1px solid hsl(var(--stroke))',
      borderRadius: 9999, padding: '.6rem 1.2rem',
      whiteSpace: 'nowrap', flexShrink: 0,
      transition: 'border-color .3s, transform .3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(137,170,204,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(var(--stroke))'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, background: sw.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 700, color: '#fff', fontFamily: "'Inter',sans-serif", flexShrink: 0 }}>
        {sw.abbr}
      </div>
      <div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: '.82rem', color: 'hsl(var(--text))' }}>{sw.name}</div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '.7rem', color: 'hsl(var(--muted))' }}>{sw.short}</div>
      </div>
      <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '.85rem', color: 'var(--accent-from)', marginLeft: '.5rem', opacity: .8 }}>{sw.pct}%</div>
    </div>
  );
}

export default function Software() {
  return (
    <section id="software" style={{ padding: '8rem 0', borderTop: '1px solid hsl(var(--stroke))', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', marginBottom: '4rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 1, background: 'hsl(var(--stroke))' }} />
            <span style={{ fontSize: '.72rem', color: 'hsl(var(--muted))', textTransform: 'uppercase', letterSpacing: '.3em', fontFamily: "'Inter',sans-serif" }}>Tools of the Trade</span>
            <div style={{ width: 32, height: 1, background: 'hsl(var(--stroke))' }} />
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.02em' }}>
            Industry-Standard{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Software</em>
          </h2>
          <p style={{ color: 'hsl(var(--muted))', fontSize: '.88rem', marginTop: '.75rem', fontFamily: "'Inter',sans-serif" }}>
            Trusted by professionals. Mastered through years of craft.
          </p>
        </motion.div>
      </div>

      {/* Infinite slider with edge fades */}
      <div style={{ position: 'relative' }}>
        {/* Sparkles behind the slider */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <Sparkles density={60} />
        </div>

        {/* Left/right fade masks */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, var(--bg, #08080f), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, var(--bg, #08080f), transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div style={{ padding: '1.5rem 0', position: 'relative', zIndex: 1 }}>
          <InfiniteSlider duration={35} gap={20}>
            {software.map(sw => <SoftwareChip key={sw.name} sw={sw} />)}
          </InfiniteSlider>
        </div>

        {/* Second row, reverse */}
        <div style={{ padding: '0 0 1.5rem', position: 'relative', zIndex: 1 }}>
          <InfiniteSlider duration={28} gap={20}>
            {[...software].reverse().map(sw => <SoftwareChip key={sw.name + '2'} sw={sw} />)}
          </InfiniteSlider>
        </div>
      </div>

      {/* Radial glow at bottom */}
      <div style={{ position: 'relative', height: 120, marginTop: '1rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(137,170,204,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(137,170,204,0.3), transparent)' }} />
      </div>
    </section>
  );
}
