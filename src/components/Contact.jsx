import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', type:'', budget:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const update = k => e => setForm(f => ({...f, [k]: e.target.value}));

  return (
    <section id="contact" style={{ padding:'8rem 0', position:'relative', borderTop:'1px solid hsl(var(--stroke))' }}>
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:600, height:400, background:'radial-gradient(ellipse,rgba(137,170,204,0.05),transparent)', pointerEvents:'none' }} />

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 2rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'4rem', alignItems:'start' }}>

          {/* Left */}
          <motion.div
            initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, margin:'-80px' }} transition={{ duration:0.8 }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
              <div style={{ width:32, height:1, background:'hsl(var(--stroke))' }} />
              <span style={{ fontSize:'.72rem', color:'hsl(var(--muted))', textTransform:'uppercase', letterSpacing:'.3em', fontFamily:"'Inter',sans-serif" }}>Get In Touch</span>
            </div>
            <h2 style={{ fontFamily:"'Instrument Serif',serif", fontStyle:'italic', fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.02em', marginBottom:'1.5rem', lineHeight:1.1 }}>
              Let's Create Something{' '}
              <em style={{ fontStyle:'italic', background:'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Exceptional</em>
            </h2>
            <p style={{ color:'hsl(var(--muted))', marginBottom:'2rem', lineHeight:1.7, fontSize:'.9rem', fontFamily:"'Inter',sans-serif" }}>Ready to elevate your content? Let's talk about your project and build something remarkable together.</p>

            <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
              {[
                { label:'hello@talhaavaan.com', href:'mailto:hello@talhaavaan.com' },
                { label:'@talhaavaan', href:'https://instagram.com/talhaavaan' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{
                  display:'flex', alignItems:'center', gap:'.8rem',
                  color:'hsl(var(--muted))', textDecoration:'none', fontSize:'.9rem',
                  transition:'color .2s', fontFamily:"'Inter',sans-serif",
                }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--accent-from)'}
                  onMouseLeave={e=>e.currentTarget.style.color='hsl(var(--muted))'}
                >
                  <div style={{ width:36, height:36, borderRadius:10, background:'hsl(var(--surface))', border:'1px solid hsl(var(--stroke))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>✉</div>
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, margin:'-80px' }} transition={{ duration:0.8, delay:0.15 }}
          >
            {submitted ? (
              <div style={{ textAlign:'center', padding:'3rem', border:'1px solid rgba(137,170,204,0.3)', borderRadius:20, background:'hsl(var(--surface))' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✓</div>
                <h3 style={{ fontFamily:"'Instrument Serif',serif", fontStyle:'italic', fontSize:'1.5rem', marginBottom:'.5rem', background:'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Message Sent!</h3>
                <p style={{ color:'hsl(var(--muted))', fontFamily:"'Inter',sans-serif" }}>I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={e=>{e.preventDefault();setSubmitted(true);}} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  {[['Name','name','text','Your name'],['Email','email','email','your@email.com']].map(([label,key,type,ph])=>(
                    <div key={key} style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
                      <label style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', fontWeight:600, letterSpacing:'.05em', color:'hsl(var(--muted))' }}>{label}</label>
                      <input className="form-input" type={type} placeholder={ph} value={form[key]} onChange={update(key)} required />
                    </div>
                  ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
                    <label style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', fontWeight:600, letterSpacing:'.05em', color:'hsl(var(--muted))' }}>Project Type</label>
                    <select className="form-input" value={form.type} onChange={update('type')}>
                      <option value="">Select type...</option>
                      {['Short Form Editing','YouTube Editing','Commercial','Real Estate','Food & Restaurant','Motion Graphics','Wedding Film'].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
                    <label style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', fontWeight:600, letterSpacing:'.05em', color:'hsl(var(--muted))' }}>Budget</label>
                    <select className="form-input" value={form.budget} onChange={update('budget')}>
                      <option value="">Select budget...</option>
                      {['$200 – $500','$500 – $1,000','$1,000 – $3,000','$3,000+'].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
                  <label style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', fontWeight:600, letterSpacing:'.05em', color:'hsl(var(--muted))' }}>Message</label>
                  <textarea className="form-input" placeholder="Tell me about your project, timeline, and goals..." value={form.message} onChange={update('message')} />
                </div>
                <button type="submit" style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem',
                  padding:'1rem 2rem', background:'linear-gradient(90deg,var(--accent-from),var(--accent-to))',
                  color:'#000', border:'none', borderRadius:12,
                  fontFamily:"'Inter',sans-serif", fontSize:'.9rem', fontWeight:700,
                  transition:'all .2s', cursor:'none',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.opacity='.85';e.currentTarget.style.transform='translateY(-1px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.opacity='1';e.currentTarget.style.transform='translateY(0)';}}
                >
                  Start Your Project →
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
