import React from 'react';
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

  const shades = Array.isArray(product?.shades) && product.shades.length > 0
    ? product.shades
    : DEFAULT_SHADES;

  const userTone = (skinProfile?.skin_tone || skinProfile?.skinTone || 'medium').toLowerCase();
  const userUndertone = (skinProfile?.undertone || 'warm').toLowerCase();

  // Detect whether these options are fragrance / volume sizes (e.g., 30ml, 50ml, 100ml) or cosmetic shades
  const isFragranceOrSizeVariant =
    product?.category === 'fragrance' ||
    (shades.length > 0 && shades.every(s => {
      const name = (typeof s === 'object' && s !== null ? s.name : String(s)) || '';
      return /^\d+\s*(ml|g|oz|fl\s*oz)$/i.test(name.trim());
    }));

  // Find optimal shade match based on user's tone and undertone for cosmetics
  const recommendedShade = shades.find(s => {
    if (!s) return false;
    const tone = (typeof s === 'object' ? s.tone : '') || '';
    const undertone = (typeof s === 'object' ? s.undertone : '') || '';
    const name = (typeof s === 'object' ? s.name : String(s)) || '';

    return (
      (tone && tone.toLowerCase() === userTone && undertone && undertone.toLowerCase() === userUndertone) ||
      (tone && tone.toLowerCase() === userTone) ||
      (name && name.toLowerCase().includes(userTone))
    );
  }) || shades[1] || shades[0];

  const recommendedShadeName = typeof recommendedShade === 'object' && recommendedShade !== null
    ? (recommendedShade.name || '')
    : String(recommendedShade || '');

  // Extract clean string for current selected item — NEVER an object!
  const currentSelectedName = typeof selectedShade === 'object' && selectedShade !== null
    ? (selectedShade.name || '')
    : (typeof selectedShade === 'string' && selectedShade.trim() ? selectedShade.trim() : (recommendedShadeName || ''));

  // ─── Fragrance & Bottle Size Mode ───────────────────────────────────────────
  if (isFragranceOrSizeVariant) {
    return (
      <div style={{
        background: 'var(--color-bg-card, rgba(255,255,255,0.03))',
        border: '1px solid var(--color-border, rgba(255,255,255,0.1))',
        borderRadius: 'var(--radius-xl, 16px)',
        padding: 'var(--space-4, 16px) var(--space-5, 20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3, 12px)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🌸</span>
            <div>
              <h4 style={{ margin: 0, fontSize: 'var(--text-sm, 14px)', fontWeight: '700', color: 'var(--color-text-primary, #fff)' }}>
                Bottle Size & Volume
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted, #aaa)' }}>
                Selected: <strong style={{ color: 'var(--color-accent-rose, #e87296)' }}>{currentSelectedName}</strong>
              </span>
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            color: 'var(--color-accent-lavender, #b8a9d9)',
            background: 'rgba(184, 169, 217, 0.12)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full, 9999px)',
            border: '1px solid rgba(184, 169, 217, 0.25)',
            fontWeight: '600',
          }}>
            Eau de Parfum
          </span>
        </div>

        {/* Size Pill Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {shades.map((shade, idx) => {
            const sizeName = typeof shade === 'object' && shade !== null ? (shade.name || '') : String(shade);
            const isSelected = currentSelectedName === sizeName;
            const stockQty = typeof shade === 'object' && shade !== null ? shade.stock : null;

            return (
              <button
                key={shade.id || sizeName || idx}
                onClick={() => onSelectShade && onSelectShade(sizeName)}
                type="button"
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full, 9999px)',
                  background: isSelected ? 'rgba(232, 114, 150, 0.2)' : 'var(--color-bg-secondary, rgba(255,255,255,0.05))',
                  border: isSelected ? '2px solid var(--color-accent-rose, #e87296)' : '1px solid var(--color-border, rgba(255,255,255,0.15))',
                  color: isSelected ? '#fff' : 'var(--color-text-secondary, #ddd)',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: 'var(--text-sm, 13px)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 12px rgba(232, 114, 150, 0.4)' : 'none',
                }}
              >
                <span>{sizeName}</span>
                {stockQty !== null && (
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>
                    ({stockQty} in stock)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted, #aaa)' }}>
          ✨ Handcrafted artisanal formulation with high-concentration botanical essences. Select your preferred volume.
        </p>
      </div>
    );
  }

  // ─── Makeup & Color Cosmetics Shade Mode ─────────────────────────────────────
  return (
    <div style={{
      background: 'var(--color-bg-card, rgba(255,255,255,0.03))',
      border: '1px solid var(--color-border, rgba(255,255,255,0.1))',
      borderRadius: 'var(--radius-xl, 16px)',
      padding: 'var(--space-4, 16px) var(--space-5, 20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3, 12px)',
    }}>
      {/* Assistant Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🎨</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--text-sm, 14px)', fontWeight: '700', color: 'var(--color-text-primary, #fff)' }}>
              Shade Selection Assistant
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted, #aaa)' }}>
              Shade: <strong style={{ color: 'var(--color-accent-rose, #e87296)' }}>{currentSelectedName}</strong>
            </span>
          </div>
        </div>

        {recommendedShadeName && (
          <div style={{
            background: 'rgba(232, 114, 150, 0.12)',
            border: '1px solid rgba(232, 114, 150, 0.3)',
            borderRadius: 'var(--radius-full, 9999px)',
            padding: '3px 10px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-accent-rose, #e87296)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span>✨ AI Match:</span> <strong>{recommendedShadeName}</strong>
          </div>
        )}
      </div>

      {/* Swatches Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        {shades.map((shade, idx) => {
          const shadeName = typeof shade === 'object' && shade !== null ? (shade.name || '') : String(shade);
          const shadeHex = (typeof shade === 'object' && shade !== null && shade.hex) ? shade.hex : '#C96F78';
          const shadeTone = typeof shade === 'object' && shade !== null ? (shade.tone || 'custom') : 'custom';
          const isSelected = currentSelectedName === shadeName;
          const isRecommended = recommendedShadeName === shadeName;

          return (
            <button
              key={shade.id || shadeName || idx}
              onClick={() => onSelectShade && onSelectShade(shadeName)}
              title={`${shadeName} (${shadeTone} tone)`}
              type="button"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: shadeHex,
                border: isSelected ? '3px solid var(--color-accent-rose, #e87296)' : '2px solid rgba(255,255,255,0.2)',
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
                  background: 'var(--color-accent-rose, #e87296)',
                  borderRadius: '50%',
                  border: '1px solid #fff',
                }} />
              )}
            </button>
          );
        })}
      </div>

      <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted, #aaa)' }}>
        💡 Matched for your <strong style={{ color: 'var(--color-text-primary, #fff)' }}>{userTone}</strong> skin tone and <strong style={{ color: 'var(--color-text-primary, #fff)' }}>{userUndertone}</strong> undertone profile.
      </p>
    </div>
  );
}
