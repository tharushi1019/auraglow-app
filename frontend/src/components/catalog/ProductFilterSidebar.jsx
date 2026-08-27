import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductFilterSidebar({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  priceRange = [0, 20000],
  maxPriceLimit = 20000,
  onChangePriceRange,
  filters = { isVegan: false, isCrueltyFree: false, inStock: false },
  onToggleFilter,
  onResetFilters,
  totalProductsCount = 0,
}) {
  const { formatPrice } = useCurrency();

  const categoryIcons = {
    all: '✨',
    skincare: '🌸',
    makeup: '💄',
    fragrance: '💐',
    tools: '🪄',
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange[1] < maxPriceLimit ||
    priceRange[0] > 0 ||
    filters.isVegan ||
    filters.isCrueltyFree ||
    filters.inStock;

  return (
    <aside
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        position: 'sticky',
        top: 'calc(var(--nav-height) + var(--space-6))',
      }}
    >
      {/* Sidebar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
            Filters
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-accent-rose)',
              fontSize: 'var(--text-xs)',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Reset All
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
          Categories
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {/* 'All Products' option */}
          <button
            onClick={() => onSelectCategory('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: 'var(--radius-lg)',
              border: selectedCategory === 'all' ? '1px solid var(--color-accent-lavender)' : '1px solid transparent',
              background: selectedCategory === 'all' ? 'rgba(184, 169, 217, 0.12)' : 'transparent',
              color: selectedCategory === 'all' ? 'var(--color-accent-lavender)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: selectedCategory === 'all' ? '600' : '400',
              textAlign: 'left',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{categoryIcons.all}</span>
              All Categories
            </span>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>
              {totalProductsCount}
            </span>
          </button>

          {/* Individual Categories */}
          {categories.map(cat => {
            const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? '1px solid var(--color-accent-lavender)' : '1px solid transparent',
                  background: isSelected ? 'rgba(184, 169, 217, 0.12)' : 'transparent',
                  color: isSelected ? 'var(--color-accent-lavender)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isSelected ? '600' : '400',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{categoryIcons[cat.slug] || '✨'}</span>
                  {cat.name}
                </span>
                {cat.count !== undefined && (
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', margin: 0 }}>
            Max Price
          </h4>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-accent-gold)' }}>
            {formatPrice(priceRange[1])}
          </span>
        </div>

        <input
          type="range"
          min="1000"
          max={maxPriceLimit}
          step="500"
          value={priceRange[1]}
          onChange={(e) => onChangePriceRange([priceRange[0], Number(e.target.value)])}
          style={{
            width: '100%',
            accentColor: 'var(--color-accent-rose)',
            cursor: 'pointer',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          <span>{formatPrice(1000)}</span>
          <span>{formatPrice(maxPriceLimit)}</span>
        </div>
      </div>

      {/* Clean Beauty & Dietary Preferences */}
      <div>
        <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
          Clean Beauty & Stock
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Vegan Only */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            <input
              type="checkbox"
              checked={filters.isVegan}
              onChange={() => onToggleFilter('isVegan')}
              style={{
                width: '16px',
                height: '16px',
                accentColor: 'var(--color-accent-sage)',
                cursor: 'pointer',
              }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🌱</span> Vegan Formula
            </span>
          </label>

          {/* Cruelty-Free */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            <input
              type="checkbox"
              checked={filters.isCrueltyFree}
              onChange={() => onToggleFilter('isCrueltyFree')}
              style={{
                width: '16px',
                height: '16px',
                accentColor: 'var(--color-accent-lavender)',
                cursor: 'pointer',
              }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🐰</span> Cruelty-Free
            </span>
          </label>

          {/* In Stock Only */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={() => onToggleFilter('inStock')}
              style={{
                width: '16px',
                height: '16px',
                accentColor: 'var(--color-accent-rose)',
                cursor: 'pointer',
              }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📦</span> In Stock Only
            </span>
          </label>
        </div>
      </div>

      {/* Skin Quiz Promotional Callout */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232, 114, 150, 0.12), rgba(184, 169, 217, 0.12))',
        border: '1px solid rgba(232, 114, 150, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '24px', marginBottom: 'var(--space-1)' }}>✨</div>
        <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-1) 0' }}>
          Not sure what to pick?
        </h5>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-3) 0', lineHeight: 1.4 }}>
          Take our 1-minute Skin Quiz to get personalized matches for your skin profile.
        </p>
        <a
          href="/skin-quiz"
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', fontSize: '11px', padding: '6px 10px', display: 'block', textDecoration: 'none', boxSizing: 'border-box' }}
        >
          Take Skin Quiz 🌸
        </a>
      </div>
    </aside>
  );
}
