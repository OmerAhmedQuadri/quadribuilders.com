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
  companyName: z.string().optional(),
  projectScope: z.string().min(10, 'Please describe the project scope'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  location: z.string().optional(),
});

export default function ContractForm() {
  const { submit, status, error } = useLeadSubmit();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => submit({ ...data, type: 'contract' });

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div key="s" className="flex flex-col items-center gap-3 py-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
            <CheckCircle2 size={40} className="text-[#38A169]" />
          </motion.div>
          <p className="font-display text-xl font-semibold">Proposal Request Received</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Our business development team will contact you within 2 business days.</p>
        </motion.div>
      ) : (
        <motion.form key="f" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input {...register('name')} placeholder="Contact Name *" className="input-field" />
              {errors.name && <p className="text-xs text-danger mt-1">Required</p>}
            </div>
            <div>
              <input {...register('phone')} placeholder="Phone *" className="input-field" />
              {errors.phone && <p className="text-xs text-danger mt-1">Required</p>}
            </div>
          </div>
          <input {...register('email')} placeholder="Email" className="input-field" />
          <input {...register('companyName')} placeholder="Company / Organisation Name" className="input-field" />
          <div>
            <textarea {...register('projectScope')} placeholder="Describe the project scope — location, type, scale *" rows={4} className="input-field resize-none" />
            {errors.projectScope && <p className="text-xs text-danger mt-1">{errors.projectScope.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input {...register('budget')} placeholder="Approximate Budget" className="input-field" />
            <input {...register('timeline')} placeholder="Expected Timeline" className="input-field" />
          </div>
          <input {...register('location')} placeholder="Project Location" className="input-field" />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'loading'}>
            {status === 'loading' ? <Loader size="sm" /> : 'Submit Contract Enquiry'}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
