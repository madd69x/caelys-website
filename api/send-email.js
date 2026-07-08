import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Add CORS headers for local development if needed, though Vercel handles it mostly
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type, email, name, vertical } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: 'Missing email or name' });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return res.status(500).json({ message: 'Email credentials not configured on the server.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  let subject = '';
  let text = '';

  if (type === 'delegate') {
    subject = 'CAELYS 2027 Registration Confirmed';
    text = `Dear ${name},\n\nYour registration for CAELYS 2027 (${vertical}) has been successfully received.\n\nWe look forward to seeing you in Jodhpur!\n\nBest,\nThe CAELYS Team`;
  } else if (type === 'team') {
    subject = 'CAELYS 2027 Team Application Received';
    text = `Dear ${name},\n\nThank you for applying to join the CAELYS 2027 Secretariat in the ${vertical} department.\n\nWe have received your application and our core team will review it shortly. We will reach out to you if your profile matches our requirements.\n\nBest,\nThe CAELYS Team`;
  } else {
    return res.status(400).json({ message: 'Invalid registration type.' });
  }

  try {
    await transporter.sendMail({
      from: `"CAELYS 2027" <${user}>`,
      to: email,
      subject: subject,
      text: text
    });
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Error sending email', error: error.message });
  }
}
