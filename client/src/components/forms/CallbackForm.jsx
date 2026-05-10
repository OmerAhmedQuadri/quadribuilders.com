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
  preferredTime: z.string().optional(),
});

export default function CallbackForm() {
  const { submit, status, error } = useLeadSubmit();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => submit({ ...data, type: 'callback' });

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          className="flex flex-col items-center gap-3 py-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          >
            <CheckCircle2 size={40} className="text-[#38A169]" />
          </motion.div>
          <p className="font-display text-xl font-semibold">We'll call you back!</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Our team will reach out at your preferred time.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register('name')} placeholder="Your Name *" className="input-field" />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input {...register('phone')} placeholder="Phone Number *" className="input-field" />
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
          </div>
          <select {...register('preferredTime')} className="input-field">
            <option value="">Preferred Time (optional)</option>
            <option value="Morning (9am–12pm)">Morning (9am–12pm)</option>
            <option value="Afternoon (12pm–4pm)">Afternoon (12pm–4pm)</option>
            <option value="Evening (4pm–7pm)">Evening (4pm–7pm)</option>
          </select>
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'loading'}>
            {status === 'loading' ? <Loader size="sm" /> : 'Request Callback'}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
