'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export function NeuralHero() {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const brainRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0); const my = useRef(0);
  const [mood, setMood] = useState(0);

  useEffect(() => {
    const c = bgRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    let W = 0, H = 0, pts: any[] = [], raf = 0;
    function init() {
      W = c!.offsetWidth; H = c!.offsetHeight;
      c!.width = W; c!.height = H;
      pts = Array.from({ length: 110 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
        r: Math.random() * 2 + .5,
        hue: [160, 220, 270][Math.floor(Math.random() * 3)],
        p: Math.random() * Math.PI * 2,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#060914'; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy; p.p += .018;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const g = .4 + Math.sin(p.p) * .3;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},70%,65%,${g})`; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${p.hue},60%,60%,${(1 - d / 120) * .15})`; ctx.lineWidth = .5; ctx.stroke();
          }
        }
        if (mx.current > 0) {
          const dx = p.x - mx.current, dy = p.y - my.current, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx.current, my.current);
            ctx.strokeStyle = `hsla(160,80%,60%,${(1 - d / 150) * .5})`; ctx.lineWidth = .8; ctx.stroke();
          }
        }
      }
      const cg = ctx.createRadialGradient(W / 2, H * .35, 0, W / 2, H * .35, W * .5);
      cg.addColorStop(0, 'rgba(52,211,153,.05)'); cg.addColorStop(.5, 'rgba(96,165,250,.03)'); cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);
      raf = requestAnimationFrame(draw);
    }
    init(); draw();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
  }, []);

  useEffect(() => {
    const bc = brainRef.current; if (!bc) return;
    const bx = bc.getContext('2d')!;
    let angle = 0, raf = 0;
    const nodes = [
      { a: 0, r: 56, lbl: 'Tashvish', col: '#34D399' },
      { a: Math.PI / 3, r: 50, lbl: 'Stres', col: '#60A5FA' },
      { a: Math.PI * 2 / 3, r: 58, lbl: "Yolg'iz", col: '#A78BFA' },
      { a: Math.PI, r: 52, lbl: "Qo'rquv", col: '#EC4899' },
      { a: Math.PI * 4 / 3, r: 56, lbl: 'Umid', col: '#FBB024' },
      { a: Math.PI * 5 / 3, r: 50, lbl: 'Kuch', col: '#14B8A6' },
    ];
    function drawBrain() {
      bx.clearRect(0, 0, 180, 180);
      angle += .007;
      const cx = 90, cy = 90;
      nodes.forEach((n, i) => {
        const a = n.a + angle;
        const x = cx + Math.cos(a) * n.r, y = cy + Math.sin(a) * n.r * .65;
        nodes.forEach((m, j) => {
          if (j <= i) return;
          const a2 = m.a + angle;
          const x2 = cx + Math.cos(a2) * m.r, y2 = cy + Math.sin(a2) * m.r * .65;
          bx.beginPath(); bx.moveTo(x, y); bx.lineTo(x2, y2);
          bx.strokeStyle = 'rgba(255,255,255,.07)'; bx.lineWidth = .8; bx.stroke();
        });
      });
      nodes.forEach(n => {
        const a = n.a + angle;
        const x = cx + Math.cos(a) * n.r, y = cy + Math.sin(a) * n.r * .65;
        const sz = Math.sin(a + angle) * .6 + 3;
        bx.beginPath(); bx.arc(x, y, sz + 3, 0, Math.PI * 2);
        bx.fillStyle = n.col + '20'; bx.fill();
        bx.beginPath(); bx.arc(x, y, sz, 0, Math.PI * 2);
        bx.fillStyle = n.col; bx.fill();
        bx.font = `${Math.round(sz + 7)}px Inter,sans-serif`;
        bx.fillStyle = 'rgba(255,255,255,.75)'; bx.textAlign = 'center'; bx.textBaseline = 'middle';
        bx.fillText(n.lbl, x, y - sz - 8);
      });
      // AI core with pulse
      const pulse = Math.sin(angle * 3) * 3 + 10;
      bx.beginPath(); bx.arc(cx, cy, pulse + 2, 0, Math.PI * 2);
      bx.fillStyle = 'rgba(52,211,153,0.15)'; bx.fill();
      bx.beginPath(); bx.arc(cx, cy, pulse, 0, Math.PI * 2);
      const g = bx.createRadialGradient(cx, cy, 0, cx, cy, pulse);
      g.addColorStop(0, '#fff'); g.addColorStop(1, '#34D399');
      bx.fillStyle = g; bx.fill();
      bx.font = 'bold 9px Inter,sans-serif'; bx.fillStyle = '#060914'; bx.textAlign = 'center'; bx.textBaseline = 'middle';
      bx.fillText('AI', cx, cy);
      raf = requestAnimationFrame(drawBrain);
    }
    drawBrain();
    return () => cancelAnimationFrame(raf);
  }, []);

  const moods = [{ e: '😄', l: "A'lo" }, { e: '🙂', l: 'Yaxshi' }, { e: '😐', l: "O'rta" }, { e: '😟', l: 'Yomon' }, { e: '😔', l: "Og'ir" }];

  return (
    <section ref={containerRef} style={{ position: 'relative', background: '#060914', overflow: 'hidden', minHeight: '100vh' }}
      onMouseMove={e => { const r = containerRef.current!.getBoundingClientRect(); mx.current = e.clientX - r.left; my.current = e.clientY - r.top; }}
      onMouseLeave={() => { mx.current = 0; my.current = 0; }}>
      <canvas ref={bgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* Hero content */}
      <div className="wrap" style={{ position: 'relative', zIndex: 2, paddingTop: '6rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.25)', color: '#34D399', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '.04em', marginBottom: '1.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'blink 1.4s ease-in-out infinite', display: 'inline-block' }} />
              AI online — 24/7
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#fff' }}>
              Ruhiy salomatligi
              <span style={{ background: 'linear-gradient(90deg,#34D399,#60A5FA,#A78BFA,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% auto', animation: 'gradMove 4s linear infinite' }}>ngiz</span>
              <br />— bizning ustuvorligimiz
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.8, maxWidth: 500, marginBottom: '2.25rem' }}>
              AI va sertifikatlangan psixologlar yordamida o'zingizni his qiling, o'sib boring. Ona tilida. Maxfiy. Bepul boshlash.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/ai-tavsiyalar" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#34D399,#60A5FA)', color: '#060914', padding: '12px 26px', borderRadius: '14px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'all .25s', letterSpacing: '.01em' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 30px rgba(52,211,153,.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ''; }}>
                🤖 AI bilan gaplashish
              </Link>
              <Link href="/maslahatlar" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.85)', border: '1px solid rgba(255,255,255,.12)', padding: '12px 24px', borderRadius: '14px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'all .25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,.12)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,.07)'; (e.currentTarget as HTMLAnchorElement).style.transform = ''; }}>
                Psixolog tanlash →
              </Link>
            </div>
          </div>

          {/* Brain 3D */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={brainRef} width={180} height={180} style={{ filter: 'drop-shadow(0 0 20px rgba(52,211,153,0.2))' }} />
          </div>
        </div>
      </div>

      {/* Mood + Chat row */}
      <div className="wrap" style={{ position: 'relative', zIndex: 2, paddingBottom: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Mood panel */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '20px', padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,.4)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.875rem' }}>Bugungi kayfiyat</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {moods.map((m, i) => (
              <button key={i} onClick={() => setMood(i)} style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', background: mood === i ? 'rgba(52,211,153,.12)' : 'rgba(255,255,255,.04)', border: `1px solid ${mood === i ? 'rgba(52,211,153,.35)' : 'rgba(255,255,255,.07)'}`, textAlign: 'center', cursor: 'pointer', transition: 'all .2s', transform: mood === i ? 'scale(1.08)' : 'scale(1)', outline: 'none' }}>
                <div style={{ fontSize: 18 }}>{m.e}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{m.l}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mini chat */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '20px', padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,.4)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.875rem' }}>AI psixologik yordamchi</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#34D399,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>🧠</div>
              <div style={{ padding: '8px 11px', background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.12)', borderRadius: '4px 12px 12px 12px', fontSize: '11px', lineHeight: 1.55, color: 'rgba(255,255,255,.82)' }}>
                Bugun o'zingizni qanday his qilyapsiz?
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#A78BFA,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>👤</div>
              <div style={{ padding: '8px 11px', background: 'rgba(167,139,250,.08)', border: '1px solid rgba(167,139,250,.12)', borderRadius: '12px 4px 12px 12px', fontSize: '11px', lineHeight: 1.55, color: 'rgba(255,255,255,.82)' }}>
                Tashvish ko'payib ketdi...
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#34D399,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>🧠</div>
              <div style={{ padding: '8px 12px', background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.12)', borderRadius: '4px 12px 12px 12px', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399', display: 'inline-block', animation: `typeDot 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="wrap" style={{ position: 'relative', zIndex: 2, paddingBottom: '5rem', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[
          { n: '24/7', l: 'AI yordam' }, { n: '15+', l: 'Psixolog' }, { n: '100%', l: 'Maxfiylik' }, { n: '3 til', l: "O'zbek · Rus · Ingliz" },
        ].map(({ n, l }) => (
          <div key={l} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '14px', padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(135deg,#34D399,#60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        @keyframes gradMove{0%{background-position:0%}100%{background-position:200%}}
        @keyframes typeDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
      `}</style>
    </section>
  );
}
