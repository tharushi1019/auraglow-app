import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_SHADES = [
  { id: 'sh-1', name: 'Nude Petal', hex: '#E8A598', tone: 'light', undertone: 'cool' },
  { id: 'sh-2', name: 'Velvet Rose', hex: '#C96F78', tone: 'medium', undertone: 'neutral' },
  { id: 'sh-3', name: 'Warm Caramel', hex: '#B87255', tone: 'medium', undertone: 'warm' },
  { id: 'sh-4', name: 'Spiced Honey', hex: '#9E5838', tone: 'tan', undertone: 'warm' },
  { id: 'sh-5', name: 'Deep Plum', hex: '#632B39', tone: 'dark', undertone: 'cool' },
  { id: 'sh-6', name: 'Rich Espresso', hex: '#402119', tone: 'deep', undertone: 'neutral' },
];

export default function ShadeSelectionAssistant({ product, selectedShade, onSelectShade }) {
  const { skinProfile } = useAuth();
  
  const shades = product?.shades && product.shades.length > 0 ? product.shades : DEFAULT_SHADES;
  const userTone = skinProfile?.skin_tone || skinProfile?.skinTone || 'medium';
  const userUndertone = skinProfile?.undertone || 'warm';

  // Find optimal shade match based on user's tone and undertone
  const recommendedShade = shades.find(
    s => (s.tone === userTone.toLowerCase() && s.undertone === userUndertone.toLowerCase()) ||
         s.tone === userTone.toLowerCase() ||
         s.name.toLowerCase().includes(userTone.toLowerCase())
  ) || shades[1] || shades[0];

  const currentSelected = selectedShade || recommendedShade?.name;

  return (
    <div style={{
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-4) var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
    }}>
      {/* Assistant Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🎨</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)' }}>
              Shade Selection Assistant
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Shade: <strong style={{ color: 'var(--color-accent-rose)' }}>{currentSelected}</strong>
            </span>
          </div>
        </div>

        {recommendedShade && (
          <div style={{
            background: 'rgba(232, 114, 150, 0.12)',
            border: '1px solid rgba(232, 114, 150, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '3px 10px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-accent-rose)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span>✨ AI Match:</span> <strong>{recommendedShade.name}</strong>
          </div>
        )}
      </div>

      {/* Swatches Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        {shades.map((shade) => {
          const isSelected = currentSelected === shade.name;
          const isRecommended = recommendedShade?.name === shade.name;

          return (
            <button
              key={shade.id || shade.name}
              onClick={() => onSelectShade(shade.name)}
              title={`${shade.name} (${shade.tone || 'custom'} tone)`}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: shade.hex || '#C96F78',
                border: isSelected ? '3px solid var(--color-accent-rose)' : '2px solid rgba(255,255,255,0.2)',
                boxShadow: isSelected ? '0 0 12px rgba(232, 114, 150, 0.6)' : 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.2s ease, border 0.2s ease',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                outline: 'none',
              }}
            >
              {isRecommended && !isSelected && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '12px',
                  height: '12px',
                  background: 'var(--color-accent-rose)',
                  borderRadius: '50%',
                  border: '1px solid #fff',
                }} />
              )}
            </button>
          );
        })}
      </div>

      <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted)' }}>
        💡 Matched for your <strong style={{ color: 'var(--color-text-primary)' }}>{userTone}</strong> skin tone and <strong style={{ color: 'var(--color-text-primary)' }}>{userUndertone}</strong> undertone profile.
      </p>
    </div>
  );
}
