import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { num: 150, suffix: '+', label: 'Projects Completed' },
  { num: 7, suffix: '+', label: 'Years Experience' },
  { num: 98, suffix: '%', label: 'Client Satisfaction' },
  { num: 50, suffix: 'M+', label: 'Views Generated' },
];

function StatItem({ num, suffix, label, i }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let cur = 0;
        const step = num / 60;
        const t = setInterval(() => {
          cur += step;
          if (cur >= num) { cur = num; clearInterval(t); }
          el.textContent = Math.floor(cur) + suffix;
        }, 16);
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [num, suffix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      style={{
        textAlign: 'center', padding: '2rem 1rem',
        border: '1px solid hsl(var(--stroke))',
        borderRadius: 20, background: 'hsl(var(--surface))',
        transition: 'border-color .3s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(137,170,204,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(var(--stroke))'}
    >
      <div
        ref={ref}
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(2rem,5vw,2.8rem)',
          color: 'hsl(var(--text))', lineHeight: 1,
          background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}
      >0{suffix}</div>
      <div style={{ color: 'hsl(var(--muted))', fontSize: '.78rem', marginTop: '.5rem', letterSpacing: '.05em', fontFamily: "'Inter',sans-serif" }}>{label}</div>
    </motion.div>
  );
}

export default function Trust() {
  return (
    <section style={{ padding: '5rem 0', borderTop: '1px solid hsl(var(--stroke))', borderBottom: '1px solid hsl(var(--stroke))' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.5rem' }}>
          {stats.map((s, i) => <StatItem key={s.label} {...s} i={i} />)}
        </div>
      </div>
    </section>
  );
}
