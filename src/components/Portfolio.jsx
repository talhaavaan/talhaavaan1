import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = ['All', 'Commercial', 'Social Media', 'Wedding', 'Real Estate', 'Motion', 'Cuties <3'];

const PROJECTS = [
  { cat: 'Commercial',   title: 'Luxury Brand Campaign',   year: '2025', ratio: '16/9', video: '/luxary-brand.mp4',       bg: 'linear-gradient(135deg,#0e1420,#0d1a18)', accent: '#89aacc' },
  { cat: 'Social Media', title: 'fatima faisal',           year: '2025', ratio: '9/16', video: '/fatima-faisal.mp4',      bg: 'linear-gradient(135deg,#1a0d14,#0d1020)', accent: '#d8a5b6' },
  { cat: 'Motion',       title: 'badass-edit',             year: '2024', ratio: '1/1',  video: '/badass-edit.mp4',        bg: 'linear-gradient(135deg,#16131f,#0d1a1a)', accent: '#b39ddb' },
  { cat: 'Real Estate',  title: 'Penthouse Showcase',      year: '2025', ratio: '9/16', video: '/Penthouse Showcase.mp4', bg: 'linear-gradient(135deg,#0d1a14,#121a0d)', accent: '#9ccfa8' },
  { cat: 'Cuties <3',    title: 'sania edit',              year: '2024', ratio: '9/16', video: '/lawn.mp4',               bg: 'linear-gradient(135deg,#1a1218,#0d1020)', accent: '#e8b8c5' },
  { cat: 'Cuties <3',    title: 'Cutie <3',                year: '2025', ratio: '1/1',  video: '/cutie.mp4',              bg: 'linear-gradient(135deg,#0e1a20,#1a1410)', accent: '#7fb9d4' },
  { cat: 'Cuties <3',    title: 'Majboor client edit',     year: '2025', ratio: '1/1',  video: '/kashish.mp4',            bg: 'linear-gradient(135deg,#1a140d,#0d1a14)', accent: '#e8b48a' },
  { cat: 'Motion',       title: 'Logo animation',          year: '2024', ratio: '1/1',  video: '/logo animation.mp4',    bg: 'linear-gradient(135deg,#13161f,#1a0d1a)', accent: '#a5b6e8' },
  { cat: 'Wedding',      title: 'wedding edit',            year: '2024', ratio: '16/9', video: '/wedding-edit.mp4',      bg: 'linear-gradient(135deg,#0f1a1a,#1a1518)', accent: '#cfd8a5' },
];

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function useThumbnail(videoSrc) {
  const [thumb, setThumb] = useState(null);
  useEffect(() => {
    if (!videoSrc) return;
    const vid = document.createElement('video');
    vid.src = videoSrc;
    vid.crossOrigin = 'anonymous';
    vid.muted = true;
    vid.playsInline = true;
    vid.currentTime = 0.5;
    const onSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width  = vid.videoWidth  || 640;
        canvas.height = vid.videoHeight || 360;
        canvas.getContext('2d').drawImage(vid, 0, 0, canvas.width, canvas.height);
        setThumb(canvas.toDataURL('image/jpeg', 0.8));
      } catch (_) {}
      vid.remove();
    };
    vid.addEventListener('seeked', onSeeked, { once: true });
    vid.load();
  }, [videoSrc]);
  return thumb;
}

const PlayIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const VolOnIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
const VolOffIcon= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 18L19 19.27 20.27 18 5.27 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>;

/* ══════════════ FRAME ══════════════ */
function Frame({ p, index, playingId, setPlayingId }) {
  const id = p.title + index;
  const isPlaying = playingId === id;

  const [hovered,  setHovered]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted,    setMuted]    = useState(false);
  const [volume,   setVolume]   = useState(1);
  const [dragging, setDragging] = useState(false);

  const videoRef    = useRef(null);
  const timelineRef = useRef(null);
  const thumb       = useThumbnail(p.video);

  /* play/pause in sync with global playingId */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.muted  = false;
      vid.volume = volume;
      vid.play().catch(() => {});
    } else {
      vid.pause();
      // reset so thumbnail shows again
      vid.currentTime = 0;
      setProgress(0);
    }
  }, [isPlaying]);

  /* timeupdate */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onTime = () => { if (!dragging) setProgress(vid.currentTime / (vid.duration || 1)); };
    const onMeta = () => setDuration(vid.duration);
    const onEnd  = () => setPlayingId(null);
    vid.addEventListener('timeupdate', onTime);
    vid.addEventListener('loadedmetadata', onMeta);
    vid.addEventListener('ended', onEnd);
    return () => {
      vid.removeEventListener('timeupdate', onTime);
      vid.removeEventListener('loadedmetadata', onMeta);
      vid.removeEventListener('ended', onEnd);
    };
  }, [dragging, setPlayingId]);

  /* click anywhere on card = toggle play */
  const handleCardClick = useCallback(() => {
    if (isPlaying) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  }, [isPlaying, id, setPlayingId]);

  /* mute */
  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    const next = !muted;
    vid.muted = next;
    setMuted(next);
  }, [muted]);

  /* volume */
  const handleVolume = useCallback((e) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = val;
    vid.muted  = val === 0;
    setMuted(val === 0);
  }, []);

  /* seek */
  const seekTo = useCallback((clientX) => {
    const bar = timelineRef.current;
    const vid = videoRef.current;
    if (!bar || !vid || !vid.duration) return;
    const rect  = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    vid.currentTime = ratio * vid.duration;
    setProgress(ratio);
  }, []);

  const onTLDown = (e) => { e.stopPropagation(); setDragging(true); seekTo(e.clientX); };
  const onTLMove = useCallback((e) => { if (dragging) seekTo(e.clientX); }, [dragging, seekTo]);
  const onTLUp   = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onTLMove);
      window.addEventListener('mouseup',  onTLUp);
    }
    return () => {
      window.removeEventListener('mousemove', onTLMove);
      window.removeEventListener('mouseup',  onTLUp);
    };
  }, [dragging, onTLMove, onTLUp]);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      style={{
        position: 'relative', aspectRatio: p.ratio,
        borderRadius: 18, overflow: 'hidden',
        background: p.bg,
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer', margin: 0, userSelect: 'none',
      }}
    >
      {/* thumbnail */}
      {!isPlaying && thumb && (
        <img src={thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}

      {/* VIDEO */}
      {p.video && (
        <video
          ref={videoRef}
          src={p.video}
          playsInline loop
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* halftone */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '5px 5px', pointerEvents: 'none' }} />

      {/* accent glow */}
      <div aria-hidden style={{ position: 'absolute', top: '-30%', right: '-30%', width: '70%', aspectRatio: '1/1', background: `radial-gradient(circle, ${p.accent}33 0%, transparent 60%)`, pointerEvents: 'none' }} />

      {/* bottom scrim */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,10,14,0.92) 0%, rgba(8,10,14,0.2) 50%, transparent 75%)', pointerEvents: 'none' }} />

      {/* top meta */}
      <div style={{ position: 'absolute', top: 14, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Inter',sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
        <span style={{ color: p.accent }}>● {p.cat}</span>
        <span>{p.year}</span>
      </div>

      {/* centre play/pause — always visible, fades on hover while playing */}
      <AnimatePresence>
        {(hovered || !isPlaying) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)',
              border: '2px solid rgba(255,255,255,0.35)',
              backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10, pointerEvents: 'none',   // card click handles toggle
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* bottom controls */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10 }}
            onClick={e => e.stopPropagation()}
          >
            {/* title */}
            <h3 style={{ margin: 0, fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: p.ratio === '9/16' ? '1.15rem' : '1.4rem', lineHeight: 1.05, color: '#fff' }}>
              {p.title}
            </h3>

            {/* TIMELINE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.55)', minWidth: 26 }}>{fmt(duration * progress)}</span>
              <div
                ref={timelineRef}
                onMouseDown={onTLDown}
                style={{ flex: 1, height: 3, borderRadius: 9999, background: 'rgba(255,255,255,0.2)', position: 'relative', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, borderRadius: 9999, background: '#fff', transition: dragging ? 'none' : 'width 0.1s linear' }} />
                <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px rgba(0,0,0,0.5)' }} />
              </div>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.55)', minWidth: 26, textAlign: 'right' }}>{fmt(duration)}</span>
            </div>

            {/* VOLUME */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={toggleMute} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {muted ? <VolOffIcon /> : <VolOnIcon />}
              </button>
              <input
                type="range" min={0} max={1} step={0.01}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                style={{ width: 80, height: 3, appearance: 'none', WebkitAppearance: 'none', background: `linear-gradient(to right, #fff ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.25) ${(muted ? 0 : volume) * 100}%)`, borderRadius: 9999, outline: 'none', cursor: 'pointer' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:10px; height:10px; border-radius:50%; background:#fff; cursor:pointer; }
        input[type=range]::-moz-range-thumb { width:10px; height:10px; border-radius:50%; background:#fff; border:none; cursor:pointer; }
      `}</style>
    </motion.figure>
  );
}

/* ══════════════ MAIN ══════════════ */
export default function Portfolio() {
  const [active,    setActive]    = useState('All');
  const [playingId, setPlayingId] = useState(null);  // only one video at a time

  const visible = active === 'All' ? PROJECTS : PROJECTS.filter(p => p.cat === active);

  return (
    <section style={{ position: 'relative', background: '#0b0d12', color: '#fff', padding: '120px 48px 140px', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 80%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(137,170,204,0.14) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Inter',sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
              <span style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.4)' }} />
              Selected Work
            </div>
            <h2 style={{ margin: 0, fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.98, letterSpacing: '-0.02em' }}>
              Featured <span style={{ fontStyle: 'italic', color: '#89aacc' }}>projects.</span>
            </h2>
            <p style={{ maxWidth: 520, marginTop: 18, fontFamily: "'Inter',sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
              A selection of films, edits and brand work — from concept to delivery.
            </p>
          </div>
          <button style={{ padding: '14px 22px', borderRadius: 9999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', cursor: 'pointer' }}>
            View all work →
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '36px 0 44px' }}>
          {FILTERS.map(f => {
            const on = active === f;
            return (
              <button key={f} onClick={() => setActive(f)} style={{ padding: '9px 18px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.14)', background: on ? 'rgba(137,170,204,0.22)' : 'rgba(255,255,255,0.03)', color: on ? '#cfe1f3' : 'rgba(255,255,255,0.7)', fontFamily: "'Inter',sans-serif", fontSize: 13, cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>
                {f}
              </button>
            );
          })}
        </div>

        <div style={{ columnCount: 3, columnGap: 20 }} className="portfolio-wall">
          {visible.map((p, i) => (
            <div key={p.title + i} style={{ breakInside: 'avoid', marginBottom: 20 }}>
              <Frame p={p} index={i} playingId={playingId} setPlayingId={setPlayingId} />
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 1024px) { .portfolio-wall { column-count: 2 !important; } }
          @media (max-width: 640px)  { .portfolio-wall { column-count: 1 !important; } }
        `}</style>
      </div>
    </section>
  );
}
