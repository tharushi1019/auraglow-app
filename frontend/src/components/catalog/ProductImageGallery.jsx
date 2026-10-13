import React, { useState } from 'react';

export default function ProductImageGallery({ images = [], name = 'Product', badge, badgeClass }) {
  // Always use the single authentic product image (no extra/mocked thumbnails)
  const displayImage = (images && images.length > 0 && images[0])
    ? images[0]
    : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Main Single Product Image Stage */}
      <div
        style={{
          width: '100%',
          paddingTop: '105%',
          position: 'relative',
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          cursor: 'crosshair',
        }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={displayImage}
          alt={name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: isZoomed ? 'scale(1.75)' : 'scale(1)',
            transition: isZoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Overlay Badges */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {badge && (
            <span className={`badge ${badgeClass || 'badge-vegan'}`} style={{ backdropFilter: 'blur(8px)', fontSize: 'var(--text-xs)' }}>
              {badge}
            </span>
          )}
        </div>

        {/* Zoom Hint Icon */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(13,13,15,0.7)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none',
        }}>
          <span>🔍</span> Hover to zoom
        </div>
      </div>
    </div>
  );
}
