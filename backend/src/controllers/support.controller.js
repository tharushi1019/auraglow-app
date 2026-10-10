/**
 * =============================================================================
 *  AuraGlow — Support Controller (backend/src/controllers/support.controller.js)
 *  Customer Support Portal & Inquiry Submission
 * =============================================================================
 */

let mockInquiries = [];

exports.submitInquiry = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      submittedAt: new Date().toISOString(),
      status: 'open',
    };

    mockInquiries.push(inquiry);
    console.log(`💬 [Support Inquiry] From: ${name} (${email}) - ${subject}`);

    return res.status(200).json({
      success: true,
      message: 'Thank you for contacting AuraGlow Support. Our clean beauty specialists will respond within 24 hours!',
      inquiry,
    });
  } catch (err) {
    next(err);
  }
};

exports.getInquiries = async (req, res, next) => {
  try {
    return res.json({ success: true, inquiries: mockInquiries });
  } catch (err) {
    next(err);
  }
};
