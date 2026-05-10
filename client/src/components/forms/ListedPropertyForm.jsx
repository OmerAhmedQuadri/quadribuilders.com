import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import api from '../../lib/api.js';
import { useLeadSubmit } from '../../hooks/useLeadSubmit.js';
import Loader from '../ui/Loader.jsx';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  projectId: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export default function ListedPropertyForm() {
  const { submit, status, error } = useLeadSubmit();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'listed'],
    queryFn: () => api.get('/projects?listed=true').then((r) => r.data),
  });

  const onSubmit = (data) => submit({ ...data, type: 'listed-property' });

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div key="s" className="flex flex-col items-center gap-3 py-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
            <CheckCircle2 size={40} className="text-[#38A169]" />
          </motion.div>
          <p className="font-display text-xl font-semibold">Interest Registered!</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Our property team will be in touch shortly.</p>
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
          {projects.length > 0 && (
            <select {...register('projectId')} className="input-field">
              <option value="">Select Property (optional)</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          )}
          <input {...register('budget')} placeholder="Budget Range (e.g. ₹80L–1.2Cr)" className="input-field" />
          <textarea {...register('message')} placeholder="Any specific requirements?" rows={3} className="input-field resize-none" />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'loading'}>
            {status === 'loading' ? <Loader size="sm" /> : 'Express Interest'}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
