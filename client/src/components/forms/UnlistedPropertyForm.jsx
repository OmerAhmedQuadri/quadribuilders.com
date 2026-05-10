import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useLeadSubmit } from '../../hooks/useLeadSubmit.js';
import Loader from '../ui/Loader.jsx';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  propertyDescription: z.string().min(10, 'Please describe the property you\'re looking for'),
  budget: z.string().optional(),
  location: z.string().optional(),
});

export default function UnlistedPropertyForm() {
  const { submit, status, error } = useLeadSubmit();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => submit({ ...data, type: 'unlisted-property' });

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div key="s" className="flex flex-col items-center gap-3 py-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
            <CheckCircle2 size={40} className="text-[#38A169]" />
          </motion.div>
          <p className="font-display text-xl font-semibold">Enquiry Submitted</p>
          <p className="text-sm text-[var(--color-text-secondary)]">We'll search our off-market network and reach out within 48 hours.</p>
        </motion.div>
      ) : (
        <motion.form key="f" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register('name')} placeholder="Your Name *" className="input-field" />
            {errors.name && <p className="text-xs text-danger mt-1">Name is required</p>}
          </div>
          <div>
            <input {...register('phone')} placeholder="Phone Number *" className="input-field" />
            {errors.phone && <p className="text-xs text-danger mt-1">Valid phone required</p>}
          </div>
          <input {...register('email')} placeholder="Email (optional)" className="input-field" />
          <div>
            <textarea {...register('propertyDescription')} placeholder="Describe the property you're looking for — type, size, configuration *" rows={4} className="input-field resize-none" />
            {errors.propertyDescription && <p className="text-xs text-danger mt-1">{errors.propertyDescription.message}</p>}
          </div>
          <input {...register('budget')} placeholder="Budget Range" className="input-field" />
          <input {...register('location')} placeholder="Preferred Location / Area" className="input-field" />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'loading'}>
            {status === 'loading' ? <Loader size="sm" /> : 'Submit Off-Market Enquiry'}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
