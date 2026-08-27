import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

/* ─── Step Indicator ─────────────────────────────────────────────────────── */
function StepIndicator({ current }) {
  const steps = ['Delivery', 'Payment', 'Review'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 'var(--space-10)' }}>
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: done ? 'var(--color-accent-sage)' : active ? 'var(--gradient-primary)' : 'var(--color-bg-secondary)',
                border: active ? 'none' : done ? 'none' : '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: done ? '16px' : 'var(--text-sm)', fontWeight: '700',
                color: done || active ? '#fff' : 'var(--color-text-muted)',
                transition: 'all 300ms ease',
                boxShadow: active ? '0 0 20px rgba(232,114,150,0.4)' : 'none',
              }}>
                {done ? '✓' : idx}
              </div>
              <span style={{ fontSize: '11px', fontWeight: active ? '700' : '500', color: active ? 'var(--color-accent-rose)' : done ? 'var(--color-accent-sage)' : 'var(--color-text-muted)' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                height: '2px', width: '80px',
                background: done ? 'var(--color-accent-sage)' : 'var(--color-border)',
                transition: 'background 300ms ease',
                marginBottom: '20px',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Step 1: Delivery Address ──────────────────────────────────────────── */
function DeliveryStep({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.firstName?.trim()) e.firstName = 'Required';
    if (!data.lastName?.trim()) e.lastName = 'Required';
    if (!data.email?.trim() || !/\S+@\S+\.\S+/.test(data.email)) e.email = 'Valid email required';
    if (!data.phone?.trim()) e.phone = 'Required';
    if (!data.address1?.trim()) e.address1 = 'Required';
    if (!data.city?.trim()) e.city = 'Required';
    if (!data.postalCode?.trim()) e.postalCode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const field = (name, label, placeholder, type = 'text', half = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: half ? '1 1 calc(50% - 8px)' : '1 1 100%' }}>
      <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={data[name] || ''}
        onChange={e => onChange(name, e.target.value)}
        className="input"
        style={{ borderColor: errors[name] ? 'var(--color-accent-rose)' : undefined }}
      />
      {errors[name] && <span style={{ fontSize: '11px', color: 'var(--color-accent-rose)' }}>{errors[name]}</span>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-text-primary)', margin: 0, marginBottom: 'var(--space-2)' }}>
        📦 Delivery Address
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-4) 0' }}>
        Where shall we send your AuraGlow beauties?
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        {field('firstName', 'First Name', 'Nimesha', 'text', true)}
        {field('lastName', 'Last Name', 'Perera', 'text', true)}
        {field('email', 'Email Address', 'nimesha@example.com', 'email')}
        {field('phone', 'Phone Number', '+94 77 123 4567', 'tel')}
        {field('address1', 'Address Line 1', '45 Galle Road, Colombo 03')}
        {field('address2', 'Address Line 2 (Optional)', 'Apartment, suite, etc.')}
        {field('city', 'City', 'Colombo', 'text', true)}
        {field('postalCode', 'Postal Code', '00300', 'text', true)}

        {/* Province */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 calc(50% - 8px)' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Province
          </label>
          <select
            value={data.province || ''}
            onChange={e => onChange('province', e.target.value)}
            className="input"
            style={{ cursor: 'pointer' }}
          >
            <option value="">Select Province</option>
            {['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 calc(50% - 8px)' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Country
          </label>
          <select
            value={data.country || 'Sri Lanka'}
            onChange={e => onChange('country', e.target.value)}
            className="input"
            style={{ cursor: 'pointer' }}
          >
            {['Sri Lanka', 'India', 'Maldives', 'Singapore', 'Australia', 'United Kingdom', 'United Arab Emirates'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Delivery note */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 100%' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Delivery Note (Optional)
          </label>
          <textarea
            placeholder="Leave outside gate, ring doorbell twice, etc."
            value={data.note || ''}
            onChange={e => onChange('note', e.target.value)}
            className="input"
            rows={2}
            style={{ resize: 'none' }}
          />
        </div>
      </div>

      <button onClick={handleNext} className="btn btn-primary btn-pill" style={{ alignSelf: 'flex-end', padding: '12px 32px', marginTop: 'var(--space-4)' }}>
        Continue to Payment →
      </button>
    </div>
  );
}

/* ─── Step 2: Payment Details ───────────────────────────────────────────── */
function PaymentStep({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [cardFlipped, setCardFlipped] = useState(false);

  // Detect card brand from first digit
  const cardBrand = () => {
    const n = (data.cardNumber || '').replace(/\s/g, '');
    if (n.startsWith('4')) return { label: 'VISA', color: '#1A1F71', emoji: '🟦' };
    if (n.startsWith('5')) return { label: 'MASTERCARD', color: '#EB001B', emoji: '🔴' };
    if (n.startsWith('3')) return { label: 'AMEX', color: '#007BC1', emoji: '🟩' };
    return { label: 'CARD', color: '#888', emoji: '💳' };
  };
  const brand = cardBrand();

  // Format card number with spaces every 4 digits
  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry MM/YY
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const validate = () => {
    const e = {};
    const cn = (data.cardNumber || '').replace(/\s/g, '');
    if (cn.length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!(data.cardName || '').trim()) e.cardName = 'Name on card is required';
    const exp = (data.expiry || '').split('/');
    if (exp.length !== 2 || exp[0].length !== 2 || exp[1].length !== 2) e.expiry = 'Use MM/YY format';
    if ((data.cvv || '').replace(/\D/g, '').length < 3) e.cvv = 'Enter valid CVV';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const lastFour = (data.cardNumber || '').replace(/\s/g, '').slice(-4) || '****';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-text-primary)', margin: 0, marginBottom: 'var(--space-2)' }}>
        💳 Payment Details
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
        Your payment is secured with 256-bit SSL encryption. 🔒
      </p>

      {/* Visual Card Preview */}
      <div
        style={{
          background: `linear-gradient(135deg, ${brand.color}dd, #1a1a2e)`,
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6) var(--space-7)',
          color: '#fff',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '160px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Background shimmer */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: '800', letterSpacing: '2px' }}>AuraGlow</span>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: '700' }}>{brand.label}</span>
        </div>

        {/* Card Number Display */}
        <div style={{ fontSize: 'var(--text-xl)', letterSpacing: '3px', marginBottom: 'var(--space-4)', fontWeight: '600' }}>
          {(data.cardNumber || '•••• •••• •••• ••••').padEnd(19, '•')}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-8)', fontSize: 'var(--text-xs)', opacity: 0.8 }}>
          <div>
            <div style={{ textTransform: 'uppercase', opacity: 0.6, marginBottom: '2px' }}>Card Holder</div>
            <div style={{ fontWeight: '600' }}>{data.cardName || 'YOUR NAME'}</div>
          </div>
          <div>
            <div style={{ textTransform: 'uppercase', opacity: 0.6, marginBottom: '2px' }}>Expires</div>
            <div style={{ fontWeight: '600' }}>{data.expiry || 'MM/YY'}</div>
          </div>
        </div>
      </div>

      {/* Payment Form Fields */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        {/* Card Number */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 100%' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Card Number
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={data.cardNumber || ''}
              onChange={e => onChange('cardNumber', formatCardNumber(e.target.value))}
              className="input"
              style={{ paddingRight: '50px', borderColor: errors.cardNumber ? 'var(--color-accent-rose)' : undefined }}
              maxLength={19}
            />
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>
              {brand.emoji}
            </span>
          </div>
          {errors.cardNumber && <span style={{ fontSize: '11px', color: 'var(--color-accent-rose)' }}>{errors.cardNumber}</span>}
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Try: 4242 4242 4242 4242 (sandbox)</span>
        </div>

        {/* Name on Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 100%' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Name on Card
          </label>
          <input
            type="text"
            placeholder="NIMESHA PERERA"
            value={data.cardName || ''}
            onChange={e => onChange('cardName', e.target.value.toUpperCase())}
            className="input"
            style={{ borderColor: errors.cardName ? 'var(--color-accent-rose)' : undefined }}
          />
          {errors.cardName && <span style={{ fontSize: '11px', color: 'var(--color-accent-rose)' }}>{errors.cardName}</span>}
        </div>

        {/* Expiry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 calc(50% - 8px)' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Expiry Date
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM/YY"
            value={data.expiry || ''}
            onChange={e => onChange('expiry', formatExpiry(e.target.value))}
            className="input"
            style={{ borderColor: errors.expiry ? 'var(--color-accent-rose)' : undefined }}
            maxLength={5}
          />
          {errors.expiry && <span style={{ fontSize: '11px', color: 'var(--color-accent-rose)' }}>{errors.expiry}</span>}
        </div>

        {/* CVV */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 calc(50% - 8px)' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            CVV / CVC
          </label>
          <input
            type="password"
            inputMode="numeric"
            placeholder="•••"
            value={data.cvv || ''}
            onChange={e => onChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            onFocus={() => setCardFlipped(true)}
            onBlur={() => setCardFlipped(false)}
            className="input"
            style={{ borderColor: errors.cvv ? 'var(--color-accent-rose)' : undefined }}
            maxLength={4}
          />
          {errors.cvv && <span style={{ fontSize: '11px', color: 'var(--color-accent-rose)' }}>{errors.cvv}</span>}
        </div>
      </div>

      {/* Security badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'rgba(100, 196, 157, 0.1)', border: '1px solid rgba(100, 196, 157, 0.3)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)' }}>
        <span style={{ fontSize: '20px' }}>🔒</span>
        <div>
          <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-accent-sage)', margin: 0 }}>Secure Sandbox Payment</p>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>256-bit SSL · No real charges · Academic demo environment</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <button onClick={onBack} className="btn btn-secondary btn-pill" style={{ padding: '12px 24px' }}>
          ← Back
        </button>
        <button onClick={handleNext} className="btn btn-primary btn-pill" style={{ padding: '12px 32px' }}>
          Review Order →
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Review & Place Order ──────────────────────────────────────── */
function ReviewStep({ delivery, payment, cart, formatPrice, subtotal, discount, shipping, total, onBack, onPlace, placing }) {
  const lastFour = (payment.cardNumber || '').replace(/\s/g, '').slice(-4) || '****';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-text-primary)', margin: 0, marginBottom: 'var(--space-2)' }}>
        ✅ Review Your Order
      </h2>

      {/* Delivery Summary */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>📦 Delivery Address</h4>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0, lineHeight: 1.6 }}>
          {delivery.firstName} {delivery.lastName}<br />
          {delivery.address1}{delivery.address2 ? `, ${delivery.address2}` : ''}<br />
          {delivery.city}, {delivery.province} {delivery.postalCode}<br />
          {delivery.country}<br />
          {delivery.email} · {delivery.phone}
        </p>
      </div>

      {/* Payment Summary */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-3) 0' }}>💳 Payment Method</h4>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
          {payment.cardName} — Card ending in {lastFour} · Expires {payment.expiry}
        </p>
      </div>

      {/* Cart Items Summary */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4) 0' }}>🌸 Items in Your Order</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <img src={item.product?.image} alt={item.product?.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>{item.product?.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>Qty: {item.quantity}</p>
                </div>
              </div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-accent-sage)' }}><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-accent-rose)' }}>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Loyalty Points Preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'rgba(232, 200, 114, 0.1)', border: '1px solid rgba(232, 200, 114, 0.3)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)' }}>
        <span style={{ fontSize: '24px' }}>⭐</span>
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-accent-gold)', margin: 0 }}>
            You'll earn {Math.floor(total / 100)} AuraGlow Points!
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>Redeem towards your next clean beauty haul.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <button onClick={onBack} className="btn btn-secondary btn-pill" style={{ padding: '12px 24px' }} disabled={placing}>
          ← Back
        </button>
        <button
          onClick={onPlace}
          className="btn btn-primary btn-pill"
          disabled={placing}
          style={{ padding: '14px 40px', fontSize: 'var(--text-sm)', fontWeight: '700', minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
        >
          {placing ? (
            <>
              <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Processing...
            </>
          ) : '🛒 Place Order'}
        </button>
      </div>
    </div>
  );
}

/* ─── Main CheckoutPage ──────────────────────────────────────────────────── */
export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);

  const [delivery, setDelivery] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', province: '', postalCode: '',
    country: 'Sri Lanka', note: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const bundleDiscount = cart.length >= 3 ? Math.round(subtotal * 0.15) : 0;
  const shipping = subtotal - bundleDiscount > 15000 ? 0 : 500;
  const total = subtotal - bundleDiscount + shipping;

  const handleDeliveryChange = (field, val) => setDelivery(prev => ({ ...prev, [field]: val }));
  const handlePaymentChange = (field, val) => setPayment(prev => ({ ...prev, [field]: val }));

  const handlePlaceOrder = async () => {
    setPlacing(true);
    // Simulate Stripe payment processing delay
    await new Promise(r => setTimeout(r, 2200));

    const lastFour = (payment.cardNumber || '').replace(/\s/g, '').slice(-4) || '4242';
    const brand = payment.cardNumber?.startsWith('5') ? 'Mastercard' : payment.cardNumber?.startsWith('3') ? 'Amex' : 'Visa';

    try {
      const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
      const res = await fetch(`${API}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price, name: i.product?.name })),
          shippingAddress: delivery,
          paymentMethod: { type: 'card', lastFour, brand },
          subtotal,
          discountAmount: bundleDiscount,
          shippingFee: shipping,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        navigate('/orders/confirm', { state: { order: data.order } });
        return;
      }
    } catch (_) {/* fall through to local demo */}

    // Fallback: local demo confirmation
    const localOrder = {
      orderId: `AG-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
      total,
      shippingAddress: delivery,
      paymentMethod: { lastFour, brand },
    };
    clearCart();
    navigate('/orders/confirm', { state: { order: localOrder } });
  };

  // Redirect if cart is empty and not in a post-order state
  if (cart.length === 0 && step !== 3) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', padding: 'var(--space-8)', marginTop: 'var(--nav-height)' }}>
          <div style={{ fontSize: '4rem' }}>🛒</div>
          <h2 style={{ color: 'var(--color-text-primary)', fontWeight: '700', margin: 0 }}>Your bag is empty</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Add some items before checking out!</p>
          <Link to="/products" className="btn btn-primary btn-pill">Browse Products</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: 'var(--nav-height) auto 0', padding: 'var(--space-10) var(--space-8)', width: '100%', boxSizing: 'border-box', flex: 1 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/cart" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Shopping Bag</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent-rose)', fontWeight: '600' }}>Checkout</span>
        </div>

        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>
          Secure Checkout 🔒
        </h1>

        {/* Step Indicator */}
        <StepIndicator current={step} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-8)', alignItems: 'start' }}>

          {/* Left: Step Content */}
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
            {step === 1 && (
              <DeliveryStep
                data={delivery}
                onChange={handleDeliveryChange}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <PaymentStep
                data={payment}
                onChange={handlePaymentChange}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <ReviewStep
                delivery={delivery}
                payment={payment}
                cart={cart}
                formatPrice={formatPrice}
                subtotal={subtotal}
                discount={bundleDiscount}
                shipping={shipping}
                total={total}
                onBack={() => setStep(2)}
                onPlace={handlePlaceOrder}
                placing={placing}
              />
            )}
          </div>

          {/* Right: Live Order Summary Card */}
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', position: 'sticky', top: 'calc(var(--nav-height) + 20px)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-5) 0', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
              Order Summary
            </h3>

            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <img src={item.product?.image} alt={item.product?.name} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0, maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product?.name}</p>
                    <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', margin: 0 }}>×{item.quantity}</p>
                  </div>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-text-primary)' }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {bundleDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-accent-sage)' }}><span>Bundle (15% Off)</span><span>-{formatPrice(bundleDiscount)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-1)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-accent-rose)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['🔒 SSL Secured Checkout', '🌱 Clean Beauty Certified', '📦 3-5 Day Delivery', '💯 Satisfaction Guarantee'].map(b => (
                <div key={b} style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>{b}</div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
