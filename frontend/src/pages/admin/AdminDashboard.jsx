import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { products as mockProducts } from '@/data/mockData';
import { supabase } from '@/lib/supabase';

const revenueDataByPeriod = {
  today: {
    revenue: 1245000,
    revGrowth: '+18.4%',
    orders: 142,
    orderGrowth: '+12.6%',
    aov: 8767,
    aovGrowth: '+5.1%',
    conversion: '3.84%',
    convGrowth: '+0.6%',
    chartBars: [
      { label: '06:00', val: 35, amount: 'Rs. 95K' },
      { label: '09:00', val: 68, amount: 'Rs. 240K' },
      { label: '12:00', val: 92, amount: 'Rs. 385K' },
      { label: '15:00', val: 78, amount: 'Rs. 310K' },
      { label: '18:00', val: 88, amount: 'Rs. 360K' },
      { label: '21:00', val: 54, amount: 'Rs. 195K' },
    ]
  },
  week: {
    revenue: 6840000,
    revGrowth: '+24.2%',
    orders: 812,
    orderGrowth: '+15.3%',
    aov: 8423,
    aovGrowth: '+7.8%',
    conversion: '4.12%',
    convGrowth: '+0.9%',
    chartBars: [
      { label: 'Mon', val: 62, amount: 'Rs. 890K' },
      { label: 'Tue', val: 74, amount: 'Rs. 980K' },
      { label: 'Wed', val: 85, amount: 'Rs. 1.15M' },
      { label: 'Thu', val: 70, amount: 'Rs. 920K' },
      { label: 'Fri', val: 95, amount: 'Rs. 1.34M' },
      { label: 'Sat', val: 100, amount: 'Rs. 1.48M' },
      { label: 'Sun', val: 82, amount: 'Rs. 1.08M' },
    ]
  },
  month: {
    revenue: 28450000,
    revGrowth: '+31.8%',
    orders: 3420,
    orderGrowth: '+22.1%',
    aov: 8318,
    aovGrowth: '+6.4%',
    conversion: '4.25%',
    convGrowth: '+1.2%',
    chartBars: [
      { label: 'Week 1', val: 68, amount: 'Rs. 6.2M' },
      { label: 'Week 2', val: 82, amount: 'Rs. 7.4M' },
      { label: 'Week 3', val: 91, amount: 'Rs. 8.1M' },
      { label: 'Week 4', val: 100, amount: 'Rs. 8.9M' },
    ]
  }
};

const liveOrdersData = [
  { id: 'ORD-8941', customer: 'Jane Doe', email: 'jane.d@example.com', items: '2 items (Serum + Cream)', status: 'Processing', amount: 16100, payment: 'Stripe • 4242', date: '2 mins ago', badgeClass: 'badge-warning' },
  { id: 'ORD-8940', customer: 'Kamal Silva', email: 'kamal.s@example.com', items: '3 items (Routine Bundle)', status: 'Shipped', amount: 32000, payment: 'Stripe • 8821', date: '18 mins ago', badgeClass: 'badge-info' },
  { id: 'ORD-8939', customer: 'Sara Lee', email: 'sara.lee@example.com', items: '1 item (Lipstick)', status: 'Delivered', amount: 4500, payment: 'Stripe • 1092', date: '1 hour ago', badgeClass: 'badge-vegan' },
  { id: 'ORD-8938', customer: 'Ashan Perera', email: 'ashan.p@example.com', items: '2 items (Sunscreen + Brush)', status: 'Processing', amount: 12300, payment: 'Stripe • 3311', date: '2 hours ago', badgeClass: 'badge-warning' },
  { id: 'ORD-8937', customer: 'Dilini Senanayake', email: 'dilini.s@example.com', items: '1 item (Midnight Bloom)', status: 'Delivered', amount: 15500, payment: 'Stripe • 9012', date: '3 hours ago', badgeClass: 'badge-vegan' },
];

const categoryShare = [
  { name: 'Skincare', share: 52, revenue: 'Rs. 647,400', color: 'var(--color-accent-rose)' },
  { name: 'Makeup', share: 26, revenue: 'Rs. 323,700', color: 'var(--color-accent-peach)' },
  { name: 'Fragrance', share: 14, revenue: 'Rs. 174,300', color: 'var(--color-accent-lavender)' },
  { name: 'Beauty Tools', share: 8, revenue: 'Rs. 99,600', color: 'var(--color-accent-gold)' },
];

const liveActivity = [
  { id: 1, type: 'order', text: 'New order #ORD-8941 placed by Jane Doe', time: '2m ago', icon: '🛍️' },
  { id: 2, type: 'quiz', text: 'Customer completed Skin Quiz (Matched: Combination)', time: '7m ago', icon: '✨' },
  { id: 3, type: 'review', text: '5★ review submitted for Radiant Glow Serum', time: '24m ago', icon: '⭐' },
  { id: 4, type: 'inventory', text: 'Low stock warning: Velvet Matte Lipstick (12 left)', time: '41m ago', icon: '⚠️' },
  { id: 5, type: 'signup', text: 'New member joined: dinushi@gmail.com', time: '1h ago', icon: '👤' },
];

export default function AdminDashboard() {
  const { formatPrice } = useCurrency();
  const [timeframe, setTimeframe]     = useState('today');
  const [now, setNow]                 = useState(new Date());
  const [activeHoverBar, setActiveHoverBar] = useState(null);
  // Live DB stats
  const [liveStats, setLiveStats] = useState({
    lowStockCount:   mockProducts.filter(p => p.stock > 0 && p.stock < 20).length,
    outOfStockCount: mockProducts.filter(p => p.stock === 0).length,
    productCount:    mockProducts.length,
    orderCount:      null,
    totalRevenue:    null,
  });

  useEffect(() => {
    document.title = 'AuraGlow Admin — Executive Dashboard';
    const timer = setInterval(() => setNow(new Date()), 60000);
    fetchLiveStats();
    return () => clearInterval(timer);
  }, []);

  async function fetchLiveStats() {
    try {
      const [prodRes, orderRes] = await Promise.all([
        supabase.from('products').select('id, stock_quantity').eq('is_active', true),
        supabase.from('orders').select('id, total_amount, status'),
      ]);

      if (!prodRes.error && prodRes.data) {
        setLiveStats(prev => ({
          ...prev,
          lowStockCount:   prodRes.data.filter(p => p.stock_quantity > 0 && p.stock_quantity < 20).length,
          outOfStockCount: prodRes.data.filter(p => p.stock_quantity === 0).length,
          productCount:    prodRes.data.length,
        }));
      }

      if (!orderRes.error && orderRes.data) {
        const revenue = orderRes.data
          .filter(o => ['paid','processing','packed','shipped','delivered'].includes(o.status))
          .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
        setLiveStats(prev => ({
          ...prev,
          orderCount:   orderRes.data.length,
          totalRevenue: revenue,
        }));
      }
    } catch (e) {
      console.error('[AdminDashboard] Stats fetch error:', e);
    }
  }

  const todayFormatted = now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const currentData    = revenueDataByPeriod[timeframe];

  const lowStockCount  = liveStats.lowStockCount;
  const outOfStockCount = liveStats.outOfStockCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

      {/* ── Top Header & Actions ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Executive Overview
            </h1>
            <span className="badge badge-vegan" style={{ fontSize: '10px' }}>● LIVE STORE</span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            Welcome back, <strong style={{ color: 'var(--color-text-primary)' }}>Tharushi</strong> · {todayFormatted}
          </p>
        </div>

        {/* Timeframe switch & Quick Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Timeframe pill selector */}
          <div style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            display: 'flex',
            gap: '2px',
          }}>
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: '7 Days' },
              { id: 'month', label: '30 Days' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                style={{
                  background: timeframe === t.id ? 'var(--gradient-brand-vibrant)' : 'transparent',
                  color: timeframe === t.id ? '#0d0d0f' : 'var(--color-text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: timeframe === t.id ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            + New Product
          </Link>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => alert('Exporting live sales report for ' + timeframe + '... CSV downloaded.')}
          >
            📥 Export Report
          </button>
        </div>
      </div>

      {/* ── 4 Executive KPI Cards ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
        
        {/* Card 1: Revenue */}
        <div className="card glass hover-lift" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--space-6)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-brand)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Gross Revenue
            </span>
            <span style={{
              fontSize: '11px', fontWeight: '700', color: 'var(--color-success)',
              background: 'rgba(126,200,160,0.12)', border: '1px solid rgba(126,200,160,0.3)',
              borderRadius: 'var(--radius-full)', padding: '2px 8px'
            }}>
              {currentData.revGrowth}
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            fontWeight: '800',
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-2)'
          }}>
            {formatPrice(currentData.revenue)}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            vs. previous period · Projected +22%
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="card glass hover-lift" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--space-6)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--color-success)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Processed Orders
            </span>
            <span style={{
              fontSize: '11px', fontWeight: '700', color: 'var(--color-success)',
              background: 'rgba(126,200,160,0.12)', border: '1px solid rgba(126,200,160,0.3)',
              borderRadius: 'var(--radius-full)', padding: '2px 8px'
            }}>
              {currentData.orderGrowth}
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            fontWeight: '800',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-2)'
          }}>
            {currentData.orders.toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            98.4% fulfillment success rate
          </div>
        </div>

        {/* Card 3: Average Order Value (AOV) */}
        <div className="card glass hover-lift" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--space-6)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--color-accent-lavender)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Average Order Value (AOV)
            </span>
            <span style={{
              fontSize: '11px', fontWeight: '700', color: 'var(--color-accent-lavender)',
              background: 'rgba(184,169,217,0.12)', border: '1px solid rgba(184,169,217,0.3)',
              borderRadius: 'var(--radius-full)', padding: '2px 8px'
            }}>
              {currentData.aovGrowth}
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            fontWeight: '800',
            color: 'var(--color-accent-lavender)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-2)'
          }}>
            {formatPrice(currentData.aov)}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Boosted by 15% Routine Bundles
          </div>
        </div>

        {/* Card 4: Store Conversion Rate */}
        <div className="card glass hover-lift" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--space-6)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--color-accent-peach)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Store Conversion Rate
            </span>
            <span style={{
              fontSize: '11px', fontWeight: '700', color: 'var(--color-accent-peach)',
              background: 'rgba(245,198,170,0.12)', border: '1px solid rgba(245,198,170,0.3)',
              borderRadius: 'var(--radius-full)', padding: '2px 8px'
            }}>
              {currentData.convGrowth}
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            fontWeight: '800',
            color: 'var(--color-accent-peach)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-2)'
          }}>
            {currentData.conversion}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Skin Quiz leads have 8.4% conversion
          </div>
        </div>

      </div>

      {/* ── Main Charts & Breakdown Section (2 Columns) ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        
        {/* Sales Performance Visualizer */}
        <div className="card glass" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: '700' }}>
                Sales Trajectory & Velocity
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
                Real-time transaction volume across selected intervals
              </p>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-rose)', fontWeight: '600' }}>
              Peak: {currentData.chartBars[currentData.chartBars.length - 2]?.amount || 'Rs. 385K'}
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            height: '200px',
            paddingTop: 'var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            position: 'relative'
          }}>
            {currentData.chartBars.map((bar, idx) => {
              const isHovered = activeHoverBar === idx;
              return (
                <div
                  key={bar.label}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={() => setActiveHoverBar(idx)}
                  onMouseLeave={() => setActiveHoverBar(null)}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      bottom: `${bar.val + 12}%`,
                      background: '#1a1820',
                      border: '1px solid var(--color-border-accent)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--color-accent-rose)',
                      boxShadow: 'var(--shadow-md)',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      animation: 'fadeIn 150ms ease'
                    }}>
                      {bar.amount}
                    </div>
                  )}

                  {/* Bar pillar */}
                  <div style={{
                    width: '70%',
                    height: `${bar.val}%`,
                    background: isHovered ? 'var(--gradient-brand-vibrant)' : 'rgba(232, 180, 160, 0.3)',
                    border: '1px solid rgba(232, 180, 160, 0.4)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    transition: 'all 200ms ease',
                    boxShadow: isHovered ? 'var(--shadow-glow-accent)' : 'none',
                  }} />
                  
                  {/* X-axis label */}
                  <span style={{
                    fontSize: '11px',
                    color: isHovered ? 'var(--color-accent-rose)' : 'var(--color-text-muted)',
                    marginTop: '8px',
                    fontWeight: isHovered ? '700' : '500'
                  }}>
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            <span>⚡ Automated Supabase PostgreSQL Sync</span>
            <span style={{ color: 'var(--color-success)' }}>● 99.98% Gateway Uptime</span>
          </div>
        </div>

        {/* Category Share & Skin Quiz Intelligence */}
        <div className="card glass" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: 'var(--space-1)' }}>
              Category Contribution
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
              Revenue share by clean beauty department
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {categoryShare.map(cat => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>{cat.name}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{cat.share}% ({cat.revenue})</span>
                  </div>
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${cat.share}%`, background: cat.color, borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skin Quiz Intelligence Box */}
          <div style={{
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'rgba(184, 169, 217, 0.08)',
            border: '1px solid rgba(184, 169, 217, 0.2)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px' }}>✨</span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-accent-lavender)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Skin Quiz Intelligence
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              <strong>44%</strong> of quiz takers have <em>Combination skin</em> with primary concern <em>Acne & Dehydration</em>.
            </p>
          </div>
        </div>

      </div>

      {/* ── Bottom Section: Recent Orders & Live Activity Feed (2 Columns) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>

        {/* Live Orders Table */}
        <div className="card glass" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: '700' }}>
                Recent Customer Orders
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                Real-time transactions and fulfillment dispatch status
              </p>
            </div>
            <Link to="/admin/orders" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-rose)', textDecoration: 'none', fontWeight: '600' }}>
              View All Orders →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '10px 0' }}>Order ID</th>
                  <th style={{ padding: '10px 0' }}>Customer</th>
                  <th style={{ padding: '10px 0' }}>Items</th>
                  <th style={{ padding: '10px 0' }}>Status</th>
                  <th style={{ padding: '10px 0', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {liveOrdersData.map((order, i) => (
                  <tr key={order.id} style={{ borderBottom: i !== liveOrdersData.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '12px 0', fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--color-accent-rose)', fontWeight: '600' }}>
                      {order.id}
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)' }}>{order.customer}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{order.date}</div>
                    </td>
                    <td style={{ padding: '12px 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      {order.items}
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      <span className={`badge ${order.badgeClass}`} style={{ fontSize: '10px' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '700', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                      {formatPrice(order.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Store Activity Stream */}
        <div className="card glass" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: '700' }}>
              Live Store Activity
            </h2>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block', boxShadow: '0 0 8px var(--color-success)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1 }}>
            {liveActivity.map(act => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0
                }}>
                  {act.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', lineHeight: 1.4, margin: 0 }}>
                    {act.text}
                  </p>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Inventory Alert Box */}
          <div style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'rgba(240, 200, 122, 0.08)',
            border: '1px solid rgba(240, 200, 122, 0.25)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>⚠️</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)', fontWeight: '600' }}>
                {lowStockCount + outOfStockCount} items need attention
              </span>
            </div>
            <Link to="/admin/products" style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: '700', textDecoration: 'underline' }}>
              Manage
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
