import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Tiny helpers ──────────────────────────────────────────────── */
const fmt = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

/* ─── Custom Slider ──────────────────────────────────────────────── */
function Slider({ value, onChange, style = {} }) {
  const trackRef = useRef(null);

  const calc = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
  };

  const handleClick = (e) => onChange(calc(e.clientX));

  const handleDrag = (e) => {
    if (e.buttons !== 1) return;
    onChange(calc(e.clientX));
  };

  return (
    <div
      ref={trackRef}
      onClick={handleClick}
      onMouseMove={handleDrag}
      style={{
        position: 'relative',
        width: '100%',
        height: 4,
        borderRadius: 9999,
        background: 'rgba(255,255,255,0.15)',
        cursor: 'pointer',
        flexShrink: 0,
        ...style,
      }}
    >
      <motion.div
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          height: '100%',
          background: 'linear-gradient(90deg, #89AACC, #4E85BF)',
          borderRadius: 9999,
          pointerEvents: 'none',
        }}
      />
      {/* thumb */}
      <motion.div
        animate={{ left: `${value}%` }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        style={{
          position: 'absolute',
          top: '50%',
          width: 10, height: 10,
          borderRadius: '50%',
          background: '#fff',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 6px rgba(137,170,204,0.6)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ─── VideoPlayer ────────────────────────────────────────────────── */
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [hover, setHover] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    playing ? videoRef.current.pause() : videoRef.current.play();
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    const p = (v.currentTime / v.duration) * 100;
    setProgress(isFinite(p) ? p : 0);
    setCurrentTime(v.currentTime);
    setDuration(v.duration);
  };

  const handleSeek = (val) => {
    const v = videoRef.current;
    if (!v?.duration) return;
    const t = (val / 100) * v.duration;
    if (isFinite(t)) { v.currentTime = t; setProgress(val); }
  };

  const handleVolume = (val) => {
    const v = videoRef.current;
    if (!v) return;
    const nv = val / 100;
    v.volume = nv;
    setVolume(nv);
    setMuted(nv === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
    if (!muted) { setVolume(0); }
    else { setVolume(1); v.volume = 1; }
  };

  const setPlaySpeed = (s) => {
    if (videoRef.current) videoRef.current.playbackRate = s;
    setSpeed(s);
  };

  /* icon SVGs */
  const PlayIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
  );
  const PauseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
  );
  const VolumeIcon = ({ level }) => {
    if (level === 0) return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
      </svg>
    );
    if (level < 0.5) return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>
    );
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>
    );
  };

  const controlBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, borderRadius: 9999,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer', flexShrink: 0, transition: 'background .15s',
  };

  return (
    <div
      style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#000', lineHeight: 0 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <video
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        style={{ width: '100%', display: 'block', cursor: 'pointer' }}
        playsInline
        disablePictureInPicture
        controlsList="nodownload"
      />

      {/* Big play overlay when paused */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={togglePlay}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.25)',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(137,170,204,0.15)',
              border: '1px solid rgba(137,170,204,0.3)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating controls */}
      <AnimatePresence>
        {(hover || !playing) && (
          <motion.div
            initial={{ y: 16, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 16, opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: 16, left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              minWidth: 320,
              maxWidth: 'calc(100% - 32px)',
              background: 'rgba(8,12,20,0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(137,170,204,0.12)',
              borderRadius: 9999,
              padding: '10px 18px',
              lineHeight: 'normal',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Single row: time → seekbar → play → volume icon → vol slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>

              {/* Timestamp */}
              <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter',sans-serif", minWidth: 30 }}>
                {fmt(currentTime)}
              </span>

              {/* Seek bar — grows to fill space */}
              <div style={{ flex: 1, minWidth: 80 }}>
                <Slider value={progress} onChange={handleSeek} />
              </div>

              {/* Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={togglePlay}
                style={{ ...controlBtn, flexShrink: 0 }}
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </motion.button>

              {/* Volume icon */}
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={toggleMute}
                style={{ ...controlBtn, flexShrink: 0 }}
              >
                <VolumeIcon level={muted ? 0 : volume} />
              </motion.button>

              {/* Volume slider */}
              <div style={{ width: 64, flexShrink: 0 }}>
                <Slider value={muted ? 0 : volume * 100} onChange={handleVolume} />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Entries ────────────────────────────────────────────────────── */
const entries = [
  { title: 'Luxury Brand Campaign',    type: 'Commercial',   duration: '2 min',  year: '2024', color: '#0e1420' },
  { title: 'Restaurant Food Reel',     type: 'Social Media', duration: '45 sec', year: '2024', color: '#0d1a14' },
  { title: 'Destination Wedding Film', type: 'Wedding',      duration: '8 min',  year: '2023', color: '#1a0d14' },
  { title: 'Penthouse Property Tour',  type: 'Real Estate',  duration: '3 min',  year: '2024', color: '#141020' },
];

/* ─── Showreel ───────────────────────────────────────────────────── */
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

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, delay: 0.1 }}
          style={{ maxWidth: 900, margin: '0 auto 5rem' }}
        >
          <VideoPlayer src="/youtube-cow-cash.mp4" />
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
