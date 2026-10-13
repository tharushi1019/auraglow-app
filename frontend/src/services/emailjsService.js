/**
 * =============================================================================
 *  AuraGlow — EmailJS Integration Service (frontend/src/services/emailjsService.js)
 *  Lecturer-Recommended Email Configuration Module
 * =============================================================================
 */

import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

/**
 * Send customer support inquiry via EmailJS
 */
export async function sendSupportEmail(formData) {
  const templateParams = {
    name: formData.name,
    from_name: formData.name,
    email: formData.email,
    from_email: formData.email,
    reply_to: formData.email,
    subject: formData.subject || 'Customer Support Inquiry',
    message: formData.message,
    to_name: 'AuraGlow Support Team',
  };

  if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_ID) {
    console.log('📧 [EmailJS Demo Mode] Support email sent:', templateParams);
    return { success: true, mode: 'demo' };
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log('✅ [EmailJS Success] Support inquiry dispatched:', result.status, result.text);
    return { success: true, mode: 'live', result };
  } catch (error) {
    console.error('❌ [EmailJS Error] Support email failed:', error);
    return { success: false, error: error.text || error.message };
  }
}

/**
 * Order invoice notification — Handled on the server via Nodemailer (Gmail SMTP).
 * EmailJS is reserved strictly for customer support inquiries.
 */
export async function sendOrderInvoiceEmail(order) {
  // If the user hasn't configured a separate, dedicated EmailJS invoice template,
  // do not dispatch to the Contact Us template. Nodemailer handles full HTML invoices.
  const INVOICE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_INVOICE_TEMPLATE_ID || '';
  if (!INVOICE_TEMPLATE_ID) {
    console.log('ℹ️ [Email] Order invoice dispatched via backend Nodemailer.');
    return { success: true, mode: 'nodemailer' };
  }

  const recipient = order?.shippingAddress?.email || order?.contact_email || 'customer@example.com';
  const templateParams = {
    to_name: `${order?.shippingAddress?.firstName || 'Valued'} ${order?.shippingAddress?.lastName || 'Customer'}`,
    to_email: recipient,
    order_id: order?.orderId || order?.id || 'AG-DEMO-2026',
    order_total: `LKR ${(order?.total || order?.total_amount || 0).toLocaleString()}`,
    order_status: order?.status || 'Confirmed',
    item_count: (order?.items || []).length,
    placed_at: new Date(order?.placedAt || Date.now()).toLocaleDateString(),
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      INVOICE_TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    return { success: true, mode: 'live', result };
  } catch (error) {
    console.warn('[EmailJS Invoice note]:', error.text || error.message);
    return { success: false, error: error.text || error.message };
  }
}
