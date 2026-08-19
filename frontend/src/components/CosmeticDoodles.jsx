import { useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   SVG cosmetic doodle definitions — line-art style
   ═══════════════════════════════════════════════════════════════════ */
const doodles = [
  {
    id: 'lipstick',
    viewBox: '0 0 60 120',
    paths: [
      'M20 110 L20 55 Q20 50 25 45 L25 20 Q25 10 30 5 Q35 10 35 20 L35 45 Q40 50 40 55 L40 110 Q40 115 30 115 Q20 115 20 110 Z',
      'M22 55 L38 55',
      'M24 65 L36 65',
    ],
    w: 45, h: 90,
  },
  {
    id: 'perfume',
    viewBox: '0 0 80 110',
    paths: [
      'M30 30 L30 20 Q30 15 35 12 L35 5 L45 5 L45 12 Q50 15 50 20 L50 30',
      'M25 30 Q15 45 15 65 Q15 100 40 105 Q65 100 65 65 Q65 45 55 30 Z',
      'M32 55 Q40 48 48 55 Q40 62 32 55 Z',
      'M38 5 L42 5 L42 2 L38 2 Z',
    ],
    w: 60, h: 85,
  },
  {
    id: 'nailpolish',
    viewBox: '0 0 60 120',
    paths: [
      'M27 45 L27 15 Q27 8 30 5 Q33 8 33 15 L33 45',
      'M18 45 Q15 50 15 60 L15 100 Q15 110 30 112 Q45 110 45 100 L45 60 Q45 50 42 45 Z',
      'M22 45 L38 45',
    ],
    w: 45, h: 88,
  },
  {
    id: 'compact',
    viewBox: '0 0 100 60',
    paths: [
      'M10 30 Q10 5 50 5 Q90 5 90 30 Q90 55 50 55 Q10 55 10 30 Z',
      'M20 30 Q20 15 50 15 Q80 15 80 30 Q80 45 50 45 Q20 45 20 30 Z',
      'M50 5 L50 2',
    ],
    w: 75, h: 50,
  },
  {
    id: 'mascara',
    viewBox: '0 0 30 130',
    paths: [
      'M12 130 L12 60 Q12 55 15 50 L15 60 Q10 45 15 40 Q20 45 15 60 L15 50 Q18 55 18 60 L18 130 Q18 132 15 132 Q12 132 12 130 Z',
      'M10 60 L20 60',
      'M8 70 Q15 65 22 70',
      'M8 80 Q15 75 22 80',
      'M8 90 Q15 85 22 90',
    ],
    w: 25, h: 100,
  },
  {
    id: 'creamjar',
    viewBox: '0 0 90 70',
    paths: [
      'M15 25 L75 25 L75 20 Q75 15 70 15 L20 15 Q15 15 15 20 Z',
      'M10 25 L80 25 Q85 25 85 30 L85 55 Q85 65 45 65 Q5 65 5 55 L5 30 Q5 25 10 25 Z',
      'M30 15 L30 10 Q30 5 45 5 Q60 5 60 10 L60 15',
    ],
    w: 68, h: 55,
  },
  {
    id: 'serum',
    viewBox: '0 0 50 130',
    paths: [
      'M20 50 L20 85 Q20 115 25 120 Q30 115 30 85 L30 50',
      'M17 50 L33 50 L33 45 L17 45 Z',
      'M20 45 L20 30 Q20 25 22 22 L22 15 Q22 5 25 2 Q28 5 28 15 L28 22 Q30 25 30 30 L30 45',
      'M23 95 Q25 100 27 95',
    ],
    w: 38, h: 95,
  },
  {
    id: 'leaf',
    viewBox: '0 0 60 100',
    paths: [
      'M30 95 L30 40 Q10 30 8 15 Q15 5 30 25 Q45 5 52 15 Q50 30 30 40',
      'M20 25 Q30 35 30 40',
      'M40 25 Q30 35 30 40',
    ],
    w: 45, h: 75,
  },
  {
    // Makeup brush
    id: 'brush',
    viewBox: '0 0 40 140',
    paths: [
      'M15 140 L15 70 L25 70 L25 140 Q25 142 20 142 Q15 142 15 140 Z',
      'M13 70 L27 70 L27 65 L13 65 Z',
      'M10 65 Q8 50 12 35 Q15 25 20 15 Q25 25 28 35 Q32 50 30 65 Z',
      'M16 35 Q20 20 24 35',
    ],
    w: 32, h: 110,
  },
  {
    // Eye shadow palette
    id: 'palette',
    viewBox: '0 0 110 80',
    paths: [
      'M5 10 Q5 5 10 5 L100 5 Q105 5 105 10 L105 70 Q105 75 100 75 L10 75 Q5 75 5 70 Z',
      'M25 25 A10 10 0 1 1 25 24.9',
      'M55 25 A10 10 0 1 1 55 24.9',
      'M85 25 A10 10 0 1 1 85 24.9',
      'M25 55 A10 10 0 1 1 25 54.9',
      'M55 55 A10 10 0 1 1 55 54.9',
      'M85 55 A10 10 0 1 1 85 54.9',
    ],
    w: 80, h: 58,
  },
  {
    // Rose flower
    id: 'rose',
    viewBox: '0 0 70 90',
    paths: [
      'M35 85 L35 50',
      'M35 50 Q20 45 18 35 Q16 25 25 20 Q30 15 35 20 Q40 15 45 20 Q54 25 52 35 Q50 45 35 50 Z',
      'M28 70 Q20 65 22 58 Q24 50 30 55',
      'M42 70 Q50 65 48 58 Q46 50 40 55',
      'M30 35 Q35 28 40 35',
    ],
    w: 52, h: 68,
  },
  {
    // Heart
    id: 'heart',
    viewBox: '0 0 80 75',
    paths: [
      'M40 70 Q10 45 10 25 Q10 10 25 10 Q35 10 40 25 Q45 10 55 10 Q70 10 70 25 Q70 45 40 70 Z',
    ],
    w: 50, h: 47,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   Placement configurations — doodles scattered around edges
   ═══════════════════════════════════════════════════════════════════ */
const placements = [
  { x: '4%',  y: '6%',  rotate: -15, scale: 0.85, delay: 0,   color: 'rgba(232, 180, 160, 0.28)' },
  { x: '86%', y: '10%', rotate: 20,  scale: 0.7,  delay: 1.5, color: 'rgba(212, 168, 199, 0.25)' },
  { x: '7%',  y: '72%', rotate: 10,  scale: 0.75, delay: 3,   color: 'rgba(184, 169, 217, 0.28)' },
  { x: '89%', y: '68%', rotate: -25, scale: 0.8,  delay: 0.8, color: 'rgba(232, 180, 160, 0.22)' },
  { x: '2%',  y: '40%', rotate: 30,  scale: 0.65, delay: 2.2, color: 'rgba(245, 198, 170, 0.25)' },
  { x: '91%', y: '40%', rotate: -10, scale: 0.6,  delay: 4,   color: 'rgba(196, 176, 240, 0.22)' },
  { x: '14%', y: '88%', rotate: 15,  scale: 0.7,  delay: 1,   color: 'rgba(212, 168, 199, 0.22)' },
  { x: '80%', y: '86%', rotate: -20, scale: 0.65, delay: 2.8, color: 'rgba(232, 180, 160, 0.25)' },
  { x: '12%', y: '22%', rotate: 25,  scale: 0.55, delay: 3.5, color: 'rgba(196, 176, 240, 0.2)' },
  { x: '82%', y: '28%', rotate: -30, scale: 0.6,  delay: 1.2, color: 'rgba(245, 198, 170, 0.2)' },
  { x: '50%', y: '3%',  rotate: 5,   scale: 0.55, delay: 4.5, color: 'rgba(212, 168, 199, 0.18)' },
  { x: '50%', y: '92%', rotate: -8,  scale: 0.6,  delay: 2,   color: 'rgba(184, 169, 217, 0.2)' },
];

/* ═══════════════════════════════════════════════════════════════════
   Generate random sparkle positions (memoized)
   ═══════════════════════════════════════════════════════════════════ */
function generateSparkles(count) {
  const sparkles = [];
  for (let i = 0; i < count; i++) {
    sparkles.push({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${5 + Math.random() * 90}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
      color: ['rgba(232,180,160,0.6)', 'rgba(212,168,199,0.5)', 'rgba(184,169,217,0.5)', 'rgba(245,198,170,0.5)'][Math.floor(Math.random() * 4)],
    });
  }
  return sparkles;
}

export default function CosmeticDoodles() {
  const sparkles = useMemo(() => generateSparkles(30), []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Animated gradient orbs for depth */}
      <div className="auth-bg-orb auth-bg-orb--1" />
      <div className="auth-bg-orb auth-bg-orb--2" />
      <div className="auth-bg-orb auth-bg-orb--3" />
      <div className="auth-bg-orb auth-bg-orb--4" />

      {/* Sparkle dots */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}, 0 0 ${s.size * 6}px ${s.color}`,
            animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Cosmetic doodles */}
      {doodles.map((doodle, i) => {
        const p = placements[i % placements.length];
        return (
          <svg
            key={doodle.id}
            viewBox={doodle.viewBox}
            width={doodle.w * p.scale}
            height={doodle.h * p.scale}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              transform: `rotate(${p.rotate}deg)`,
              animation: `doodleFloat ${6 + i * 0.7}s ease-in-out ${p.delay}s infinite alternate`,
              filter: `drop-shadow(0 0 6px ${p.color}) drop-shadow(0 0 16px ${p.color}) drop-shadow(0 0 30px ${p.color})`,
              opacity: 0.75,
            }}
          >
            {doodle.paths.map((d, j) => (
              <path
                key={j}
                d={d}
                stroke={p.color.replace(/[\d.]+\)$/, '0.9)')}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  animation: `doodleGlow ${4 + j * 0.5}s ease-in-out ${p.delay + j * 0.3}s infinite alternate`,
                }}
              />
            ))}
          </svg>
        );
      })}

      <style>{`
        @keyframes doodleFloat {
          0%   { transform: translateY(0px); }
          100% { transform: translateY(-16px); }
        }

        @keyframes doodleGlow {
          0%   { opacity: 0.45; filter: brightness(0.7); }
          100% { opacity: 1;    filter: brightness(1.5); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50%      { opacity: 1; transform: scale(1.2); }
        }

        /* Ambient gradient orbs */
        .auth-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.14;
          animation: orbDrift 12s ease-in-out infinite alternate;
        }

        .auth-bg-orb--1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(232, 180, 160, 0.5), transparent 70%);
          top: -12%;
          left: -6%;
          animation-duration: 14s;
        }

        .auth-bg-orb--2 {
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(184, 169, 217, 0.5), transparent 70%);
          bottom: -12%;
          right: -6%;
          animation-duration: 11s;
          animation-delay: 2s;
        }

        .auth-bg-orb--3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(212, 168, 199, 0.45), transparent 70%);
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
          animation-duration: 16s;
          animation-delay: 4s;
        }

        .auth-bg-orb--4 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(245, 198, 170, 0.35), transparent 70%);
          top: 15%;
          right: 20%;
          animation-duration: 13s;
          animation-delay: 1s;
        }

        @keyframes orbDrift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(25px, -15px) scale(1.08); }
          66%  { transform: translate(-15px, 20px) scale(0.96); }
          100% { transform: translate(-20px, 10px) scale(1.04); }
        }
      `}</style>
    </div>
  );
}
