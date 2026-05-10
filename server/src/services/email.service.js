import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

const LABEL = {
  callback:            'Callback Request',
  enquiry:             'General Enquiry',
  'listed-property':   'Listed Property Interest',
  'unlisted-property': 'Off-Market Property Enquiry',
  contract:            'Contract Development',
};

const row = (label, value) =>
  value
    ? `<tr><td style="padding:6px 12px;color:#888;width:160px;vertical-align:top">${label}</td><td style="padding:6px 12px;color:#f5f5f0">${value}</td></tr>`
    : '';

export const sendLeadEmail = async (lead) => {
  if (!process.env.SMTP_USER) {
    console.log('[Email] SMTP not configured — skipping');
    return;
  }

  const date = new Date(lead.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short',
  });

  const rows = [
    row('Type',             LABEL[lead.type] || lead.type),
    row('Name',             lead.name),
    row('Phone',            lead.phone),
    row('Email',            lead.email),
    row('Message',          lead.message),
    row('Preferred Time',   lead.preferredTime),
    row('Budget',           lead.budget),
    row('Location',         lead.location),
    row('Property Details', lead.propertyDescription),
    row('Company',          lead.companyName),
    row('Project Scope',    lead.projectScope),
    row('Timeline',         lead.timeline),
    row('Submitted',        date),
  ].join('');

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">
    <div style="background:#111;border:1px solid #222;border-radius:4px;overflow:hidden">
      <div style="background:#ffbd59;padding:20px 24px">
        <h1 style="margin:0;color:#0a0a0a;font-size:18px;font-weight:600">New Lead — QuadriBuilders</h1>
        <p style="margin:4px 0 0;color:#0a0a0a;opacity:0.7;font-size:13px">${LABEL[lead.type] || lead.type}</p>
      </div>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <div style="padding:16px 24px;border-top:1px solid #222">
        <a href="${process.env.ADMIN_URL || 'http://localhost:5000'}/admin/leads"
           style="display:inline-block;background:#ffbd59;color:#0a0a0a;padding:10px 20px;border-radius:2px;text-decoration:none;font-size:13px;font-weight:600">
          View in Admin →
        </a>
      </div>
    </div>
  </div></body></html>`;

  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to:   process.env.EMAIL_TO,
    subject: `[QuadriBuilders] New ${LABEL[lead.type] || 'Lead'} — ${lead.name}`,
    html,
    text: `New Lead\nType: ${LABEL[lead.type]}\nName: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email || '-'}\nSubmitted: ${date}`,
  });
};
