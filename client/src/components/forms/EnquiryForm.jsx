import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useLeadSubmit } from '../../hooks/useLeadSubmit.js';
import Loader from '../ui/Loader.jsx';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'Valid phone required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  message: z.string().max(1000).optional(),
});

export default function EnquiryForm({ projectId, projectTitle }) {
  const { submit, status, error } = useLeadSubmit();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => submit({ ...data, type: 'enquiry', projectId, message: projectTitle ? `Re: ${projectTitle}\n${data.message || ''}`.trim() : data.message });

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div key="success" className="flex flex-col items-center gap-3 py-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
            <CheckCircle2 size={36} className="text-[#38A169]" />
          </motion.div>
          <p className="font-display text-lg font-semibold">Enquiry Received</p>
          <p className="text-sm text-[var(--color-text-secondary)]">We'll get back to you within 24 hours.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input {...register('name')} placeholder="Your Name *" className="input-field" />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input {...register('phone')} placeholder="Phone Number *" className="input-field" />
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
          </div>
          <input {...register('email')} placeholder="Email (optional)" className="input-field" />
          <textarea {...register('message')} placeholder="Your message..." rows={3} className="input-field resize-none" />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'loading'}>
            {status === 'loading' ? <Loader size="sm" /> : 'Send Enquiry'}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
