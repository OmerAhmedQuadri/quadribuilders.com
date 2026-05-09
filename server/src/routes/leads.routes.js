import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import Lead from '../models/Lead.model.js';
import auth from '../middleware/auth.middleware.js';
import { sendLeadEmail } from '../services/email.service.js';

const router = Router();

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Too many submissions, please try again later' },
});

const leadSchema = z.object({
  type: z.enum(['callback', 'enquiry', 'listed-property', 'unlisted-property', 'contract']),
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(1000).optional(),
  preferredTime: z.string().optional(),
  projectId: z.string().optional(),
  propertyDescription: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
  companyName: z.string().optional(),
  projectScope: z.string().optional(),
  timeline: z.string().optional(),
});

router.post('/', leadLimiter, async (req, res) => {
  const result = leadSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
  }
  try {
    const lead = await Lead.create(result.data);
    sendLeadEmail(lead).catch((err) => console.error('Email error:', err.message));
    res.status(201).json({ message: 'Enquiry received', id: lead._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type)   filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    const leads = await Lead.find(filter).populate('projectId', 'title slug').sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status, notes }, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
