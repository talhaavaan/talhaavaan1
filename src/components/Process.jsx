import { motion } from 'framer-motion';

const steps = [
  { num: 1, title: 'Discovery',  desc: 'We align on your vision, goals, audience, and deliverables.', icon: '🔍' },
  { num: 2, title: 'Editing',    desc: 'I craft your footage into a polished, cinematic narrative.', icon: '✂️' },
  { num: 3, title: 'Revisions',  desc: 'Collaborative feedback rounds until you\'re fully satisfied.', icon: '🔄' },
  { num: 4, title: 'Delivery',   desc: 'Final files delivered in all required formats, on time.', icon: '✅' },
];

export default function Process() {
  return (
    <section id="process" style={{ padding: '8rem 0', borderTop: '1px solid hsl(var(--stroke))' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
          initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-100px' }} transition={{ duration:1 }}
          style={{ textAlign:'center', marginBottom:'5rem' }}
        >
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem', marginBottom:'1rem' }}>
            <div style={{ width:32, height:1, background:'hsl(var(--stroke))' }} />
            <span style={{ fontSize:'.72rem', color:'hsl(var(--muted))', textTransform:'uppercase', letterSpacing:'.3em', fontFamily:"'Inter',sans-serif" }}>How It Works</span>
          </div>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'-0.02em' }}>
            A Process Built For <em style={{ fontStyle:'italic', background:'linear-gradient(90deg,var(--accent-from),var(--accent-to))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Excellence</em>
          </h2>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2rem', position:'relative' }}>
          {/* Connecting line */}
          <div style={{ position:'absolute', top:'3.5rem', left:'10%', right:'10%', height:1, background:'hsl(var(--stroke))', pointerEvents:'none', display:'none' }} className="process-line" />

          {steps.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.7, delay:i*0.12 }}
              style={{ textAlign:'center', padding:'0 1rem' }}
            >
              {/* Circle */}
              <div style={{
                width:'5rem', height:'5rem', borderRadius:'50%',
                border:'1px solid rgba(137,170,204,0.4)',
                background:'hsl(var(--surface))',
                display:'flex', alignItems:'center', justifyContent:'center',
                margin:'0 auto 1.5rem', position:'relative',
                transition:'all .3s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(137,170,204,0.8)';e.currentTarget.style.boxShadow='0 0 20px rgba(137,170,204,0.15)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(137,170,204,0.4)';e.currentTarget.style.boxShadow='none';}}
              >
                <span style={{ fontSize:'1.4rem' }}>{step.icon}</span>
                {/* Step number badge */}
                <div style={{
                  position:'absolute', top:-10, right:-10,
                  width:24, height:24, borderRadius:'50%',
                  background:'linear-gradient(135deg,var(--accent-from),var(--accent-to))',
                  color:'#fff', fontFamily:"'Inter',sans-serif", fontSize:'.65rem', fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{step.num}</div>
              </div>

              <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, marginBottom:'.5rem', fontSize:'1rem' }}>{step.title}</div>
              <div style={{ fontSize:'.82rem', color:'hsl(var(--muted))', lineHeight:1.6, fontFamily:"'Inter',sans-serif" }}>{step.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
