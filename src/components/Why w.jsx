import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { image, video } from 'framer-motion/client';

const reasons = [
  {
    icon: '⚡',
    title: 'Fast Delivery',
    desc: 'Quick turnaround without compromising quality. Most projects delivered within 48–72 hours.',
    image: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDd1MmZhaWVudXNoYXZzYjAyNmVrZmUxdW8xcjdob2NoNDRzcHkyZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TjCTT7pEhC6rJZHh31/giphy.gif',
  },
  {
    icon: '🎬',
    title: 'Cinematic Quality',
    desc: 'Every frame is intentional. Cinema-grade color grading, sound design, and visual rhythm.',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=700&fit=crop',
  },
  {
    icon: '✨',
    title: 'Unlimited Creativity',
    desc: 'Fresh ideas for every project — not cookie-cutter templates but bespoke storytelling.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=700&fit=crop',
  },
  {
    icon: '💬',
    title: 'Strong Communication',
    desc: "Always responsive. You'll never wonder about the status of your project.",
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=700&fit=crop',
  },
  {
    icon: '📈',
    title: 'Retention-Focused',
    desc: 'Edits structured around viewer psychology to maximize watch time and engagement.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=700&fit=crop',
  },
  {
    icon: '🎯',
    title: 'Business Results',
    desc: 'Every edit decision is made with your ROI and business goals in mind.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=700&fit=crop',
  },
];

function TiltCard({ r, i }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springCfg);
  const springY = useSpring(mouseY, springCfg);
  const rotateX = useTransform(springY, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-10deg', '10deg']);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.08 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX, rotateY, transformStyle: 'preserve-3d',
          position: 'relative', height: 360, borderRadius: 20,
          border: '1px solid rgba(137,170,204,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          cursor: 'pointer',
        }}
      >
        {/* Inner raised layer */}
        <div style={{
          transform: 'translateZ(40px)',
          transformStyle: 'preserve-3d',
          position: 'absolute', inset: 12,
          borderRadius: 14, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <img src={r.image} alt={r.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.78) 100%)' }} />

          {/* Top icon */}
          <div style={{ position: 'relative', padding: '1.2rem' }}>
            <motion.div style={{
              transform: 'translateZ(50px)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)', fontSize: '1.2rem',
            }}>
              {r.icon}
            </motion.div>
          </div>

          {/* Bottom content */}
          <div style={{ position: 'relative', padding: '1.2rem' }}>
            <motion.h3 style={{
              transform: 'translateZ(50px)',
              fontFamily: "'Instrument Serif',serif", fontSize: '1.3rem',
              color: '#fff', marginBottom: '.4rem', fontStyle: 'italic',
            }}>
              {r.title}
            </motion.h3>
            <motion.p style={{
              transform: 'translateZ(40px)',
              fontSize: '.8rem', color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.6, fontFamily: "'Inter',sans-serif", marginBottom: '1rem',
            }}>
              {r.desc}
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                transform: 'translateZ(40px)',
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
                padding: '.55rem 1rem', fontSize: '.78rem', fontWeight: 600,
                color: '#fff', fontFamily: "'Inter',sans-serif", textAlign: 'center',
              }}
            >
              Learn more ↗
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Why() {
  return (
    <section id="why" style={{ padding: '8rem 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 1, background: 'hsl(var(--stroke))' }} />
            <span style={{ fontSize: '.72rem', color: 'hsl(var(--muted))', textTransform: 'uppercase', letterSpacing: '.3em', fontFamily: "'Inter',sans-serif" }}>Why Choose Me</span>
            <div style={{ width: 32, height: 1, background: 'hsl(var(--stroke))' }} />
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.02em' }}>
            The{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Difference</em>
            {' '}Is in the Details
          </h2>
          <p style={{ color: 'hsl(var(--muted))', fontSize: '.88rem', marginTop: '.75rem', fontFamily: "'Inter',sans-serif" }}>
            Six reasons clients keep coming back.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {reasons.map((r, i) => (
            <TiltCard key={r.title} r={r} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
