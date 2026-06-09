import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ['Edit', 'Color', 'Create', 'Motion'];

export default function LoadingScreen({ onDone }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const startRef = useRef(Date.now());
  const rafRef = useRef(null);
  const DURATION = 2700;

  // Counter via rAF over 2700ms
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const cur = Math.floor(progress * 100);
      setCount(cur);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => { setHidden(true); onDone?.(); }, 400);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onDone]);

  // Cycle words every 900ms
  useEffect(() => {
    const id = setInterval(() => setWordIndex(i => (i + 1) % WORDS.length), 900);
    return () => clearInterval(id);
  }, []);

  if (hidden) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: count >= 100 ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'hsl(var(--bg))',
        zIndex: 10000,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: count >= 100 ? 'none' : 'auto',
      }}
    >
      {/* Top-left label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute', top: '2rem', left: '2rem',
          fontSize: '0.7rem', color: 'hsl(var(--muted))',
          textTransform: 'uppercase', letterSpacing: '0.3em',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Portfolio
      </motion.div>

      {/* Center cycling word */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              color: 'hsl(var(--text) / 0.8)',
              userSelect: 'none',
            }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '2rem',
        fontFamily: "'Instrument Serif', serif",
        fontSize: 'clamp(4rem, 10vw, 7rem)',
        color: 'hsl(var(--text))',
        tabularNums: 'tabular-nums',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {String(count).padStart(3, '0')}
      </div>

      {/* Bottom progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '3px', background: 'hsl(var(--stroke) / 0.5)',
      }}>
        <div
          className="accent-gradient"
          style={{
            height: '100%',
            width: `${count}%`,
            transition: 'width 0.05s linear',
            boxShadow: '0 0 8px rgba(137,170,204,0.35)',
          }}
        />
      </div>
    </motion.div>
  );
}
