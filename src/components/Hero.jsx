import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── HLS Video ─────────────────────────────────────────────────── */
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
      } catch { video.src = MP4_SRC; }
    };
    load();
    return () => cleanup();
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      <video ref={videoRef} autoPlay muted loop playsInline style={{
        position: 'absolute', top: '50%', left: '50%',
        minWidth: '100%', minHeight: '100%', objectFit: 'cover',
        transform: `translate(-50%,-50%)${flipped ? ' scaleY(-1)' : ''}`,
      }}>
        {!HLS_SRC && <source src={MP4_SRC} type="video/mp4" />}
      </video>
      <div style={{ position: 'absolute', inset: 0, background: flipped ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.35)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '12rem', background: 'linear-gradient(to top, hsl(var(--bg)), transparent)' }} />
    </div>
  );
}

/* ── WebGL Lightning ───────────────────────────────────────────── */
function Lightning({ hue = 210, xOffset = 0, speed = 2, intensity = 0.55, size = 2 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    resize();
    window.addEventListener('resize', resize);

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vert = `attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.,1.);}`;
    const frag = `
      precision mediump float;
      uniform vec2 iResolution; uniform float iTime;
      uniform float uHue,uXOffset,uSpeed,uIntensity,uSize;
      #define OCTAVE_COUNT 10
      vec3 hsv2rgb(vec3 c){vec3 rgb=clamp(abs(mod(c.x*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);return c.z*mix(vec3(1.),rgb,c.y);}
      float hash11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
      float hash12(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
      mat2 rotate2d(float t){float c=cos(t),s=sin(t);return mat2(c,-s,s,c);}
      float noise(vec2 p){vec2 ip=floor(p),fp=fract(p);float a=hash12(ip),b=hash12(ip+vec2(1,0)),c=hash12(ip+vec2(0,1)),d=hash12(ip+vec2(1));vec2 t=smoothstep(0.,1.,fp);return mix(mix(a,b,t.x),mix(c,d,t.x),t.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<OCTAVE_COUNT;++i){v+=a*noise(p);p*=rotate2d(.45);p*=2.;a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;uv=2.*uv-1.;uv.x*=iResolution.x/iResolution.y;
        uv.x+=uXOffset;uv+=2.*fbm(uv*uSize+.8*iTime*uSpeed)-1.;
        float dist=abs(uv.x);
        vec3 baseColor=hsv2rgb(vec3(uHue/360.,.65,.9));
        vec3 col=baseColor*pow(mix(0.,.07,hash11(iTime*uSpeed))/dist,1.)*uIntensity;
        gl_FragColor=vec4(col,1.);
      }`;

    const compile = (src, type) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(vert, gl.VERTEX_SHADER);
    const fs = compile(frag, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); gl.useProgram(prog);

    const verts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'iResolution');
    const uTime = gl.getUniformLocation(prog, 'iTime');
    const uHueL = gl.getUniformLocation(prog, 'uHue');
    const uXOff = gl.getUniformLocation(prog, 'uXOffset');
    const uSpd  = gl.getUniformLocation(prog, 'uSpeed');
    const uInt  = gl.getUniformLocation(prog, 'uIntensity');
    const uSz   = gl.getUniformLocation(prog, 'uSize');

    const t0 = performance.now();
    let raf;
    const render = () => {
      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform1f(uHueL, hue);
      gl.uniform1f(uXOff, xOffset);
      gl.uniform1f(uSpd, speed);
      gl.uniform1f(uInt, intensity);
      gl.uniform1f(uSz, size);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [hue, xOffset, speed, intensity, size]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
}

/* ── Floating Skill Badge ──────────────────────────────────────── */
function Badge({ label, sub, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      style={{
        position: 'absolute',
        display: 'flex', alignItems: 'center', gap: 8,
        ...style,
      }}
    >
      {/* dot */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#89AACC' }} />
        <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'rgba(137,170,204,0.3)', filter: 'blur(3px)' }} />
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: "'Inter',sans-serif", fontSize: '.72rem', fontWeight: 600,
          color: 'rgba(255,255,255,0.9)', letterSpacing: '.02em',
        }}>{label}</div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '.65rem', color: 'rgba(255,255,255,0.45)' }}>{sub}</div>
        <div style={{ position: 'absolute', inset: -6, borderRadius: 8, background: 'rgba(255,255,255,0.04)', filter: 'blur(6px)', zIndex: -1 }} />
      </div>
    </motion.div>
  );
}

/* ── Pill Navbar ───────────────────────────────────────────────── */
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
          transition: 'box-shadow 0.4s', gap: '0.2rem',
        }}>
          <div
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'hsl(var(--bg))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'transform 0.3s', flexShrink: 0, cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.querySelector('.logo-ring').style.background = 'linear-gradient(315deg, var(--accent-from), var(--accent-to))'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.querySelector('.logo-ring').style.background = 'linear-gradient(135deg, var(--accent-from), var(--accent-to))'; }}
          >
            <div className="logo-ring" style={{ position: 'absolute', inset: -2, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))', zIndex: -1, transition: 'background 0.4s' }} />
            <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: '11px', color: 'hsl(var(--text))' }}>TA</span>
          </div>

          <div style={{ width: 1, height: 18, background: 'hsl(var(--stroke))', margin: '0 4px' }} className="hidden-xs" />

          <nav style={{ display: 'flex', gap: '2px' }} className="nav-links-desktop">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                onClick={() => setActive(link)}
                style={{ fontSize: '0.78rem', borderRadius: 9999, padding: '0.38rem 0.85rem', textDecoration: 'none', color: active === link ? 'hsl(var(--text))' : 'hsl(var(--muted))', background: active === link ? 'hsl(var(--stroke))' : 'transparent', transition: 'all 0.2s', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}
                onMouseEnter={e => { if (active !== link) { e.currentTarget.style.color = 'hsl(var(--text))'; e.currentTarget.style.background = 'hsl(var(--stroke))'; } }}
                onMouseLeave={e => { if (active !== link) { e.currentTarget.style.color = 'hsl(var(--muted))'; e.currentTarget.style.background = 'transparent'; } }}
              >{link}</a>
            ))}
          </nav>

          <div style={{ width: 1, height: 18, background: 'hsl(var(--stroke))', margin: '0 4px' }} className="hidden-xs" />

          <a href="#contact" style={{ position: 'relative', fontSize: '0.78rem', padding: '0.38rem 0.85rem', borderRadius: 9999, color: 'hsl(var(--text))', textDecoration: 'none', fontFamily: "'Inter',sans-serif", overflow: 'hidden', display: 'inline-block', zIndex: 0 }}
            onMouseEnter={e => e.currentTarget.querySelector('.hi-ring').style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.querySelector('.hi-ring').style.opacity = '0'}
          >
            <span className="hi-ring" style={{ position: 'absolute', inset: -2, borderRadius: 9999, background: 'linear-gradient(90deg,var(--accent-from),var(--accent-to))', opacity: 0, transition: 'opacity 0.2s', zIndex: -1 }} />
            <span style={{ position: 'relative', zIndex: 1 }}>Say hi ↗</span>
          </a>

          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', padding: '6px', display: 'none', flexDirection: 'column', gap: 4, cursor: 'pointer' }}
            className="nav-hamburger"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: 20, height: 1.5, background: 'hsl(var(--text))', transition: 'all .3s', transform: menuOpen ? (i===0?'rotate(45deg) translate(4px,4px)':i===1?'scaleX(0)':'rotate(-45deg) translate(4px,-4px)') : 'none', opacity: menuOpen && i===1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'hsl(var(--bg) / 0.97)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
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

/* ── Hero ──────────────────────────────────────────────────────── */
const ROLES = ['Editor', 'Colorist', 'Storyteller', 'Creator'];

const BADGES = [
  { label: 'DaVinci Resolve', sub: 'Color & Grade',   style: { left: '6%',  top: '38%' } },
  { label: 'Premiere Pro',    sub: 'Editing Suite',    style: { left: '12%', top: '58%' } },
  { label: 'After Effects',   sub: 'Motion Graphics',  style: { right: '8%', top: '38%' } },
  { label: 'Sound Design',    sub: 'Immersive Audio',  style: { right: '6%', top: '58%' } },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const { gsap } = await import('gsap');
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.name-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1 });
        tl.fromTo('.blur-in', { opacity: 0, filter: 'blur(10px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 }, '-=0.8');
      } catch { /* framer fallback */ }
    };
    run();
  }, []);

  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(var(--bg))' }}>
      <Navbar />

      {/* Video BG — dimmed more so lightning pops */}
      <BackgroundVideo />

      {/* ── Lightning layer ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <Lightning hue={210} xOffset={0} speed={1.4} intensity={0.55} size={2} />
      </div>

      {/* ── Glowing sphere ── */}
      <div style={{
        position: 'absolute', zIndex: 2, pointerEvents: 'none',
        top: '52%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(560px, 60vw)', height: 'min(560px, 60vw)',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 28% 85%, #1a3560 10%, #05101edd 65%, #000000f0 100%)',
        boxShadow: '0 0 120px 20px rgba(78,133,191,0.12), inset 0 0 60px rgba(137,170,204,0.06)',
        backdropFilter: 'blur(2px)',
      }} />

      {/* ── Floating skill badges ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        {BADGES.map((b) => (
          <Badge key={b.label} label={b.label} sub={b.sub} style={b.style} />
        ))}
      </div>

      {/* ── Main content ── */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1.5rem', maxWidth: 860 }}>

        {/* Eyebrow */}
        <motion.p className="blur-in"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
        <span style={{ fontSize: '0.6rem', color: 'hsl(var(--muted))', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: 'hsl(var(--stroke))', position: 'relative', overflow: 'hidden' }}>
          <div className="animate-scroll-down" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--accent-from), var(--accent-to))' }} />
        </div>
      </div>

      <style>{`
        .cta-solid {
          position:relative; padding:.875rem 1.75rem; border-radius:9999px;
          font-size:.85rem; font-family:'Inter',sans-serif; font-weight:600;
          text-decoration:none; background:hsl(var(--text)); color:hsl(var(--bg));
          transition:all .25s; display:inline-block; z-index:0; overflow:hidden;
        }
        .cta-solid:hover { transform:scale(1.05); background:hsl(var(--bg)); color:hsl(var(--text)); }
        .cta-solid::before {
          content:''; position:absolute; inset:-2px; border-radius:9999px;
          background:linear-gradient(90deg,var(--accent-from),var(--accent-to));
          z-index:-1; opacity:0; transition:opacity .2s;
        }
        .cta-solid:hover::before { opacity:1; }
        .cta-outline {
          position:relative; padding:.875rem 1.75rem; border-radius:9999px;
          font-size:.85rem; font-family:'Inter',sans-serif; font-weight:600;
          text-decoration:none; border:2px solid hsl(var(--stroke));
          color:hsl(var(--text)); background:hsl(var(--bg));
          transition:all .25s; display:inline-block; z-index:0; overflow:hidden;
        }
        .cta-outline:hover { transform:scale(1.05); border-color:transparent; }
        .cta-outline::before {
          content:''; position:absolute; inset:-2px; border-radius:9999px;
          background:linear-gradient(90deg,var(--accent-from),var(--accent-to));
          z-index:-1; opacity:0; transition:opacity .2s;
        }
        .cta-outline:hover::before { opacity:1; }
      `}</style>
    </section>
  );
}
