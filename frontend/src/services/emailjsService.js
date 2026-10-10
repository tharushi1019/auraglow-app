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
    to_name: 'AuraGlow Support Team',
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject || 'Customer Support Inquiry',
    message: formData.message,
    reply_to: formData.email,
  };

  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.log('📧 [EmailJS Demo Mode] Support email sent:', templateParams);
    return { success: true, mode: 'demo' };
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID || 'template_support',
      templateParams,
      PUBLIC_KEY
    );
    console.log('✅ [EmailJS Success] Support email dispatched:', result.status, result.text);
    return { success: true, mode: 'live', result };
  } catch (error) {
    console.error('❌ [EmailJS Error] Support email failed:', error);
    return { success: false, error: error.text || error.message };
  }
}

/**
 * Send order confirmation invoice via EmailJS
 */
export async function sendOrderInvoiceEmail(order) {
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

  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.log('📧 [EmailJS Demo Mode] Order Invoice sent:', templateParams);
    return { success: true, mode: 'demo' };
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID || 'template_invoice',
      templateParams,
      PUBLIC_KEY
    );
    console.log('✅ [EmailJS Success] Invoice email dispatched:', result.status, result.text);
    return { success: true, mode: 'live', result };
  } catch (error) {
    console.error('❌ [EmailJS Error] Invoice email failed:', error);
    return { success: false, error: error.text || error.message };
  }
}
