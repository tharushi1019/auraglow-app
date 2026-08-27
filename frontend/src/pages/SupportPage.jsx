import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const FAQ_ITEMS = [
  {
    q: 'How do I track my order?',
    a: 'Once your order is confirmed, you\'ll receive a tracking ID. Use it at /orders/[your-order-id] or click the "Track My Order" button in your confirmation email.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 14-day hassle-free return policy on all unopened products in their original packaging. Simply contact our support team and we\'ll arrange a pickup.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery within Sri Lanka takes 3-5 business days. International orders typically arrive within 7-14 business days depending on the destination.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'You can cancel or modify your order within 2 hours of placing it. After that, we\'re unable to make changes as the order enters processing.',
  },
  {
    q: 'Are AuraGlow products truly cruelty-free?',
    a: 'Absolutely! Every AuraGlow formula is certified cruelty-free and never tested on animals. We also offer a wide range of vegan formulations marked with our 🌱 badge.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex). All payments are processed through our secure 256-bit SSL encrypted checkout.',
  },
  {
    q: 'How do I redeem my AuraGlow loyalty points?',
    a: 'Your loyalty points are automatically applied at checkout on your next order. 100 points = Rs. 100 off your cart. Points expire after 12 months of inactivity.',
  },
  {
    q: 'Can I get a refund if I\'m not satisfied?',
    a: 'We\'re committed to your skin\'s happiness. If you\'re not satisfied within 30 days, contact us and we\'ll work with you on a refund or product exchange.',
  },
];

export default function SupportPage() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = FAQ_ITEMS.filter(item =>
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '960px', margin: 'var(--nav-height) auto 0', padding: 'var(--space-10) var(--space-8)', width: '100%', boxSizing: 'border-box', flex: 1 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent-rose)', fontWeight: '600' }}>Customer Support</span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>💬</div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            How Can We Help You?
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)' }}>
            Our clean beauty experts are here to make your AuraGlow experience perfect.
          </p>

          {/* Quick action cards */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '📍', label: 'Track Order', desc: 'Check your delivery status', link: '/orders/demo' },
              { icon: '🔄', label: 'Returns', desc: 'Start a return or exchange', link: '#contact' },
              { icon: '💳', label: 'Billing', desc: 'Payment & invoice queries', link: '#contact' },
            ].map(card => (
              <Link
                key={card.label}
                to={card.link}
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-5) var(--space-6)',
                  textDecoration: 'none',
                  minWidth: '160px',
                  textAlign: 'center',
                  transition: 'all var(--transition-base)',
                  display: 'block',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent-rose)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{card.icon}</div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>{card.label}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }}>

          {/* Left: FAQ */}
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>
              Frequently Asked Questions
            </h2>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input"
                style={{ paddingLeft: '42px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {filteredFAQs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                  No FAQs match your search. Try a different keyword.
                </div>
              ) : filteredFAQs.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--color-bg-card)',
                    border: openFAQ === i ? '1px solid var(--color-accent-rose)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    transition: 'border-color 200ms ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    style={{
                      width: '100%', background: 'none', border: 'none',
                      padding: 'var(--space-5) var(--space-6)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', gap: 'var(--space-4)',
                    }}
                  >
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)', textAlign: 'left' }}>
                      {item.q}
                    </span>
                    <span style={{
                      fontSize: '20px', color: 'var(--color-text-muted)',
                      transform: openFAQ === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                      flexShrink: 0,
                    }}>
                      ↓
                    </span>
                  </button>
                  {openFAQ === i && (
                    <div style={{ padding: '0 var(--space-6) var(--space-5)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Form + Live Chat */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} id="contact">

            {/* Live Chat Widget */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-bg-card), rgba(232,114,150,0.05))',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--space-3)' }}>💬</div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2) 0' }}>Live Chat</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-4) 0' }}>
                Chat with our skin experts.<br />
                <span style={{ color: 'var(--color-accent-sage)', fontWeight: '600' }}>● Online</span> · Avg wait: &lt;2 mins
              </p>
              <button
                className="btn btn-primary btn-pill btn-sm"
                style={{ width: '100%' }}
                onClick={() => alert('Live chat integration coming soon! Use the contact form below for now. 🌸')}
              >
                Start Live Chat
              </button>

              <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
                {['Mon–Fri 9am–6pm', 'Sat 10am–4pm', '+94 11 234 5678'].map(info => (
                  <span key={info} style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{info}</span>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-5) 0' }}>📧 Send a Message</h3>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>✅</div>
                  <p style={{ color: 'var(--color-accent-sage)', fontWeight: '700', margin: '0 0 var(--space-2) 0' }}>Message Sent!</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>We'll respond within 24 hours. Thank you! 🌸</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Nimesha Perera', type: 'text' },
                    { key: 'email', label: 'Email Address', placeholder: 'nimesha@example.com', type: 'email' },
                    { key: 'subject', label: 'Subject', placeholder: 'Order issue, return, product query...', type: 'text' },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {label}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                        className="input"
                        required
                      />
                    </div>
                  ))}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Message
                    </label>
                    <textarea
                      placeholder="Please describe your issue in detail..."
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      className="input"
                      rows={4}
                      style={{ resize: 'none' }}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-pill" style={{ padding: '12px 24px', fontWeight: '700' }}>
                    Send Message ✉️
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
