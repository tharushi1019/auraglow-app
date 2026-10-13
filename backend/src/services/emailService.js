/**
 * =============================================================================
 *  AuraGlow — Email Service (backend/src/services/emailService.js)
 *  Module 5: Payment & Email Notifications (Nodemailer + Gmail SMTP)
 *  Templates: Order Confirmation, Welcome, Skin Quiz Completion
 * =============================================================================
 */

const nodemailer = require('nodemailer');

// ── Transporter Setup ─────────────────────────────────────────────────────────
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

// ── Shared Email Layout Wrapper ───────────────────────────────────────────────
function wrapInLayout(bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>AuraGlow</title>
</head>
<body style="margin:0;padding:0;background:#F5EEE8;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EEE8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(212,122,106,0.15);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#D47A6A 0%,#C4956A 50%,#B07D9A 100%);padding:36px 40px;text-align:center;">
            <div style="font-size:32px;margin-bottom:6px;">&#127800;</div>
            <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:700;letter-spacing:2px;">AuraGlow</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:1px;">PERSONALIZED CLEAN BEAUTY &amp; SKINCARE</p>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:40px;">${bodyContent}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#2D2522;padding:28px 40px;text-align:center;">
            <p style="margin:0;color:#C4A090;font-size:13px;">AuraGlow Clean Cosmetics &amp; Skincare</p>
            <p style="margin:6px 0 0;color:#7A6B65;font-size:12px;">Islandwide Express Delivery &middot; Sri Lanka</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Template 1: Order Confirmation / Invoice ──────────────────────────────────
function buildOrderConfirmationTemplate(order) {
  const orderId = order.orderId || order.id || 'AG-XXXX';
  const customerName = order.shippingAddress?.firstName || 'Valued Customer';
  const items = order.items || [];
  const subtotal = (order.subtotal || 0).toLocaleString();
  const shipping = (order.shippingFee || 0).toLocaleString();
  const total = (order.total || order.total_amount || 0).toLocaleString();

  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '3-5 Business Days';

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:14px 12px;border-bottom:1px solid #F0E6DF;">
        <span style="font-weight:600;color:#2D2522;">${item.name || item.product_name || 'Product'}</span>
        ${item.selected_shade ? `<br/><span style="font-size:12px;color:#9A8A84;">Shade: ${item.selected_shade}</span>` : ''}
      </td>
      <td style="padding:14px 12px;text-align:center;border-bottom:1px solid #F0E6DF;color:#52443F;">${item.quantity}</td>
      <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #F0E6DF;font-weight:600;color:#D47A6A;">LKR ${(item.price || item.unit_price || 0).toLocaleString()}</td>
    </tr>`).join('');

  const addr = order.shippingAddress || {};

  const body = `
    <h2 style="margin:0 0 8px;color:#2D2522;font-size:24px;">Thank You, ${customerName}! &#127800;</h2>
    <p style="margin:0 0 28px;color:#7A6B65;font-size:15px;line-height:1.6;">Your order has been confirmed and is being prepared with care.</p>

    <div style="background:#FAF7F5;border-radius:12px;padding:20px 24px;margin-bottom:28px;border-left:4px solid #D47A6A;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td><span style="color:#9A8A84;font-size:13px;">Order Reference</span><br/><strong style="color:#2D2522;font-size:16px;">${orderId}</strong></td>
          <td style="text-align:right;"><span style="color:#9A8A84;font-size:13px;">Estimated Delivery</span><br/><strong style="color:#2D2522;font-size:14px;">${estimatedDelivery}</strong></td>
        </tr>
      </table>
    </div>

    <h3 style="margin:0 0 12px;color:#2D2522;font-size:16px;">Items Ordered</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="background:linear-gradient(90deg,#D47A6A,#C4956A);">
          <th style="padding:12px;text-align:left;color:#fff;font-size:13px;">Product</th>
          <th style="padding:12px;text-align:center;color:#fff;font-size:13px;">Qty</th>
          <th style="padding:12px;text-align:right;color:#fff;font-size:13px;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="padding:6px 0;color:#7A6B65;font-size:14px;">Subtotal</td>
        <td style="padding:6px 0;text-align:right;color:#52443F;font-size:14px;">LKR ${subtotal}</td>
      </tr>
      ${parseFloat(order.discountAmount) > 0 ? `<tr><td style="padding:6px 0;color:#4CAF50;font-size:14px;">Discount Applied</td><td style="padding:6px 0;text-align:right;color:#4CAF50;font-size:14px;">- LKR ${(order.discountAmount || 0).toLocaleString()}</td></tr>` : ''}
      <tr>
        <td style="padding:6px 0;color:#7A6B65;font-size:14px;">Shipping</td>
        <td style="padding:6px 0;text-align:right;color:#52443F;font-size:14px;">${parseFloat(order.shippingFee) === 0 ? 'FREE' : `LKR ${shipping}`}</td>
      </tr>
      <tr><td colspan="2" style="border-top:2px solid #E8B4A0;padding-top:12px;"></td></tr>
      <tr>
        <td style="color:#2D2522;font-size:18px;font-weight:700;">Total Paid</td>
        <td style="text-align:right;color:#D47A6A;font-size:22px;font-weight:700;">LKR ${total}</td>
      </tr>
    </table>

    <div style="background:#FAF7F5;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <h3 style="margin:0 0 10px;color:#2D2522;font-size:15px;">&#128205; Delivery Address</h3>
      <p style="margin:0;color:#52443F;font-size:14px;line-height:1.8;">
        ${addr.firstName || ''} ${addr.lastName || ''}<br/>
        ${addr.address || ''}<br/>
        ${addr.city || ''}, ${addr.province || ''}<br/>
        ${addr.country || 'Sri Lanka'}
      </p>
    </div>

    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://auraglow-app.netlify.app'}/orders/${orderId}"
         style="display:inline-block;background:linear-gradient(135deg,#D47A6A,#C4956A);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;">
        Track Your Order &#8594;
      </a>
    </div>`;

  return wrapInLayout(body);
}

// ── Template 2: Welcome / Registration Email ──────────────────────────────────
function buildWelcomeTemplate(user) {
  const firstName = (user.name || 'Beauty Lover').split(' ')[0];

  const body = `
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:56px;margin-bottom:12px;">&#127800;</div>
      <h2 style="margin:0;color:#2D2522;font-size:28px;font-weight:700;">Welcome to AuraGlow, ${firstName}!</h2>
      <p style="margin:12px 0 0;color:#7A6B65;font-size:16px;line-height:1.6;">Your personalized clean beauty journey begins here.</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="width:50%;padding:8px;">
          <div style="background:#FAF7F5;border-radius:12px;padding:20px;text-align:center;">
            <div style="font-size:28px;margin-bottom:8px;">&#128300;</div>
            <h3 style="margin:0 0 6px;color:#2D2522;font-size:14px;font-weight:700;">Skin Quiz</h3>
            <p style="margin:0;color:#7A6B65;font-size:13px;">Personalized recommendations based on your unique skin profile.</p>
          </div>
        </td>
        <td style="width:50%;padding:8px;">
          <div style="background:#FAF7F5;border-radius:12px;padding:20px;text-align:center;">
            <div style="font-size:28px;margin-bottom:8px;">&#10024;</div>
            <h3 style="margin:0 0 6px;color:#2D2522;font-size:14px;font-weight:700;">Clean Beauty</h3>
            <p style="margin:0;color:#7A6B65;font-size:13px;">Cruelty-free, paraben-free and dermatologically tested products.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="width:50%;padding:8px;">
          <div style="background:#FAF7F5;border-radius:12px;padding:20px;text-align:center;">
            <div style="font-size:28px;margin-bottom:8px;">&#128666;</div>
            <h3 style="margin:0 0 6px;color:#2D2522;font-size:14px;font-weight:700;">Express Delivery</h3>
            <p style="margin:0;color:#7A6B65;font-size:13px;">Islandwide delivery. Free shipping on orders over LKR 3,000.</p>
          </div>
        </td>
        <td style="width:50%;padding:8px;">
          <div style="background:#FAF7F5;border-radius:12px;padding:20px;text-align:center;">
            <div style="font-size:28px;margin-bottom:8px;">&#129302;</div>
            <h3 style="margin:0 0 6px;color:#2D2522;font-size:14px;font-weight:700;">AI Advisor</h3>
            <p style="margin:0;color:#7A6B65;font-size:13px;">AI-powered Glow Advisor creates your personalized skincare routine.</p>
          </div>
        </td>
      </tr>
    </table>

    <div style="background:linear-gradient(135deg,#D47A6A,#C4956A);border-radius:16px;padding:24px;text-align:center;margin-bottom:32px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.9);font-size:13px;text-transform:uppercase;letter-spacing:1px;">New Member Offer</p>
      <h3 style="margin:0 0 8px;color:#FFFFFF;font-size:26px;font-weight:700;">10% OFF</h3>
      <p style="margin:0 0 16px;color:rgba(255,255,255,0.9);font-size:14px;">Your first order &mdash; automatically applied at checkout!</p>
      <span style="background:rgba(255,255,255,0.2);color:#fff;padding:8px 20px;border-radius:50px;font-size:13px;font-weight:600;letter-spacing:1px;">WELCOME10</span>
    </div>

    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://auraglow-app.netlify.app'}/skin-quiz"
         style="display:inline-block;background:linear-gradient(135deg,#D47A6A,#C4956A);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;margin:0 6px 12px;">
        Take Skin Quiz &#10024;
      </a>
      <a href="${process.env.FRONTEND_URL || 'https://auraglow-app.netlify.app'}/products"
         style="display:inline-block;background:transparent;color:#D47A6A;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;border:2px solid #D47A6A;margin:0 6px 12px;">
        Shop Now &#8594;
      </a>
    </div>`;

  return wrapInLayout(body);
}

// ── Template 3: Skin Quiz Completion Email ────────────────────────────────────
function buildSkinQuizTemplate(user, skinProfile) {
  const firstName = (user.name || 'Beauty Lover').split(' ')[0];
  const skinType = skinProfile?.skin_type || 'combination';
  const concerns = Array.isArray(skinProfile?.concerns) ? skinProfile.concerns : [];
  const skinTone = skinProfile?.skin_tone || 'medium';
  const undertone = skinProfile?.undertone || 'neutral';

  const skinTypeEmoji = { dry: '&#128167;', oily: '&#10024;', combination: '&#9878;', sensitive: '&#127807;', normal: '&#127800;' }[skinType.toLowerCase()] || '&#127800;';

  const concernBadges = concerns.map(c =>
    `<span style="display:inline-block;background:#FAF7F5;color:#D47A6A;border:1px solid #E8B4A0;border-radius:50px;padding:6px 16px;font-size:13px;font-weight:600;margin:4px;">${c}</span>`
  ).join('');

  const body = `
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:52px;margin-bottom:12px;">&#128300;</div>
      <h2 style="margin:0;color:#2D2522;font-size:26px;font-weight:700;">Your Skin Profile is Ready, ${firstName}!</h2>
      <p style="margin:12px 0 0;color:#7A6B65;font-size:15px;line-height:1.6;">We analyzed your answers and created your personalized beauty profile.</p>
    </div>

    <div style="background:linear-gradient(135deg,#FAF7F5,#FDF0EB);border-radius:16px;padding:28px;margin-bottom:28px;border:1px solid #E8B4A0;">
      <h3 style="margin:0 0 20px;color:#2D2522;font-size:17px;font-weight:700;">Your Skin Profile</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:10px 0;border-bottom:1px solid #F0E6DF;">
          <span style="color:#9A8A84;font-size:13px;">Skin Type</span><br/>
          <strong style="color:#2D2522;font-size:16px;">${skinTypeEmoji} ${skinType.charAt(0).toUpperCase() + skinType.slice(1)}</strong>
        </td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #F0E6DF;">
          <span style="color:#9A8A84;font-size:13px;">Skin Tone</span><br/>
          <strong style="color:#2D2522;font-size:15px;">&#127912; ${skinTone.charAt(0).toUpperCase() + skinTone.slice(1)} (${undertone} undertone)</strong>
        </td></tr>
        <tr><td style="padding:10px 0;">
          <span style="color:#9A8A84;font-size:13px;">Skin Concerns</span><br/>
          <div style="margin-top:8px;">${concernBadges || '<span style="color:#9A8A84;font-size:13px;">No specific concerns noted</span>'}</div>
        </td></tr>
      </table>
    </div>

    <div style="background:#2D2522;border-radius:16px;padding:24px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#C4A090;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Recommended For You</p>
      <h3 style="margin:0 0 8px;color:#FFFFFF;font-size:20px;">Your Personalized Products Are Waiting</h3>
      <p style="margin:0 0 20px;color:#9A8A84;font-size:14px;line-height:1.6;">Based on your ${skinType} skin profile, we curated the perfect routine for you.</p>
      <a href="${process.env.FRONTEND_URL || 'https://auraglow-app.netlify.app'}/products"
         style="display:inline-block;background:linear-gradient(135deg,#D47A6A,#C4956A);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;">
        See Your Recommendations &#8594;
      </a>
    </div>

    <div style="text-align:center;padding:20px;background:#FAF7F5;border-radius:12px;">
      <div style="font-size:28px;margin-bottom:8px;">&#129302;</div>
      <h3 style="margin:0 0 8px;color:#2D2522;font-size:16px;">Try the Glow AI Advisor</h3>
      <p style="margin:0 0 16px;color:#7A6B65;font-size:14px;">Get a complete morning &amp; evening skincare routine tailored to your profile.</p>
      <a href="${process.env.FRONTEND_URL || 'https://auraglow-app.netlify.app'}/routine-advisor"
         style="display:inline-block;background:transparent;color:#D47A6A;text-decoration:none;padding:10px 28px;border-radius:50px;font-size:14px;font-weight:600;border:2px solid #D47A6A;">
        Get My Routine &#10024;
      </a>
    </div>`;

  return wrapInLayout(body);
}

// ── Core Send Function ────────────────────────────────────────────────────────
async function sendEmail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.log(`\n📧 [Simulated Email] To: ${to} | Subject: ${subject}`);
    console.log('   (Set SMTP_USER & SMTP_PASS in backend/.env to send real emails)\n');
    return true;
  }
  try {
    const info = await t.sendMail({
      from: `"AuraGlow Beauty \uD83C\uDF38" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ [Email] Sent to ${to} — ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`❌ [Email] Failed to send to ${to}:`, err.message);
    return false;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Send order confirmation invoice email */
async function sendOrderInvoice(order) {
  const recipient = order?.shippingAddress?.email || order?.contact_email;
  if (!recipient) { console.warn('[Email] No recipient email, skipping invoice.'); return; }
  return sendEmail({
    to: recipient,
    subject: `\uD83C\uDF38 Your AuraGlow Order is Confirmed! #${order.orderId || order.id}`,
    html: buildOrderConfirmationTemplate(order),
  });
}

/** Send welcome email when a new user registers */
async function sendWelcomeEmail(user) {
  if (!user?.email) return;
  return sendEmail({
    to: user.email,
    subject: '\uD83C\uDF38 Welcome to AuraGlow — Your Beauty Journey Starts Now!',
    html: buildWelcomeTemplate(user),
  });
}

/** Send skin quiz completion email */
async function sendSkinQuizEmail(user, skinProfile) {
  if (!user?.email) return;
  return sendEmail({
    to: user.email,
    subject: '\uD83D\uDD2C Your AuraGlow Skin Profile is Ready!',
    html: buildSkinQuizTemplate(user, skinProfile),
  });
}

module.exports = { sendOrderInvoice, sendWelcomeEmail, sendSkinQuizEmail };
