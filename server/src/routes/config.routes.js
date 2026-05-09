import { Router } from 'express';
import SiteConfig from '../models/SiteConfig.model.js';
import auth from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const config = await SiteConfig.findOne();
    if (!config) return res.status(404).json({ message: 'Site config not found' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const config = await SiteConfig.findOneAndUpdate({}, req.body, {
      new: true, upsert: true, runValidators: true,
    });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
