import React, { useState } from 'react';

export default function ProductImageGallery({ images = [], name = 'Product', badge, badgeClass }) {
  const allImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'];

  const [activeIndex, setActiveIndex] = useState(0);
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
      {/* Main Image Stage */}
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
          src={allImages[activeIndex]}
          alt={`${name} - View ${activeIndex + 1}`}
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

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: '4px' }}>
          {allImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--color-accent-rose)' : '1px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)',
                  opacity: isSelected ? 1 : 0.65,
                }}
              >
                <img
                  src={img}
                  alt={`${name} thumbnail ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
