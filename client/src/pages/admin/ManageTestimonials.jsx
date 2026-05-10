import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api.js';
import Modal from '../../components/ui/Modal.jsx';
import Loader from '../../components/ui/Loader.jsx';

export default function ManageTestimonials() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const { data: list = [], isLoading } = useQuery({ queryKey: ['testimonials'], queryFn: () => api.get('/testimonials').then((r) => r.data) });
  const { register, handleSubmit, reset } = useForm();

  const save = useMutation({
    mutationFn: (data) => {
      const body = { ...data, rating: Number(data.rating), isVisible: !!data.isVisible };
      return modal === 'new' ? api.post('/testimonials', body).then((r) => r.data) : api.put(`/testimonials/${modal._id}`, body).then((r) => r.data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials'] }); setModal(null); },
  });
  const del = useMutation({
    mutationFn: (id) => api.delete(`/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold">Testimonials</h1>
        <button onClick={() => { reset({ name: '', role: '', quote: '', photo: '', rating: 5, isVisible: true, order: 0 }); setModal('new'); }} className="btn-primary py-2 px-4 text-xs"><Plus size={14} /> Add</button>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> : (
        <div className="space-y-3">
          {list.map((t) => (
            <div key={t._id} className="bg-surface border border-border p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold text-sm">{t.name} <span className="text-accent text-xs">{'★'.repeat(t.rating)}</span></div>
                <div className="text-xs text-[var(--color-text-secondary)] mb-2">{t.role}</div>
                <p className="text-xs text-[var(--color-text-secondary)] italic line-clamp-2">"{t.quote}"</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { reset(t); setModal(t); }} className="text-[var(--color-text-secondary)] hover:text-accent"><Pencil size={13} /></button>
                <button onClick={() => { if (confirm('Delete?')) del.mutate(t._id); }} className="text-[var(--color-text-secondary)] hover:text-danger"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-[var(--color-text-secondary)] py-8 text-center">No testimonials yet.</p>}
        </div>
      )}
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'new' ? 'Add Testimonial' : 'Edit Testimonial'}>
        <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
          <input {...register('name')} placeholder="Name *" className="input-field" required />
          <input {...register('role')} placeholder="Role (e.g. Homeowner, Banjara Hills)" className="input-field" />
          <textarea {...register('quote')} placeholder="Quote *" rows={4} className="input-field resize-none" required />
          <input {...register('photo')} placeholder="Photo URL" className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <select {...register('rating')} className="input-field">
              {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
            </select>
            <input {...register('order')} type="number" placeholder="Display order" className="input-field" />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('isVisible')} className="accent-accent" />
            Visible on website
          </label>
          <button type="submit" className="btn-primary w-full justify-center" disabled={save.isPending}>{save.isPending ? <Loader size="sm" /> : 'Save'}</button>
        </form>
      </Modal>
    </div>
  );
}
