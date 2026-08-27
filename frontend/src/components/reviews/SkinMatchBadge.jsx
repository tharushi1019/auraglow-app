import React, { useState } from 'react';
import { calculateSkinMatchScore } from '@/services/recommendationService';

export default function SkinMatchBadge({ product, initialSkinType = 'Combination' }) {
  const [currentSkinType, setCurrentSkinType] = useState(initialSkinType);

  const score = calculateSkinMatchScore(product, currentSkinType);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(232, 114, 150, 0.12) 0%, rgba(184, 169, 217, 0.15) 100%)',
        border: '1px solid rgba(232, 114, 150, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4) var(--space-5)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Match Percentage Circle */}
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, var(--color-accent-rose), var(--color-accent-lavender))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          color: '#fff',
          fontSize: '13px',
          boxShadow: '0 4px 12px rgba(232, 114, 150, 0.35)',
        }}>
          {score}%
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-accent-rose)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI Skin Compatibility Match
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Optimal botanical synergy for <strong style={{ color: 'var(--color-text-primary)' }}>{currentSkinType} Skin</strong>.
          </p>
        </div>
      </div>

      {/* Switch skin type picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Match for:</span>
        <select
          value={currentSkinType}
          onChange={e => setCurrentSkinType(e.target.value)}
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '3px 8px',
            fontSize: '11px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="Dry">Dry</option>
          <option value="Oily">Oily</option>
          <option value="Combination">Combination</option>
          <option value="Sensitive">Sensitive</option>
          <option value="Normal">Normal</option>
        </select>
      </div>
    </div>
  );
}
