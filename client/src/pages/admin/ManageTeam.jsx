import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api.js';
import Modal from '../../components/ui/Modal.jsx';
import Loader from '../../components/ui/Loader.jsx';

export default function ManageTeam() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const { data: members = [], isLoading } = useQuery({ queryKey: ['team'], queryFn: () => api.get('/team').then((r) => r.data) });
  const { register, handleSubmit, reset } = useForm();

  const save = useMutation({
    mutationFn: (data) => modal === 'new' ? api.post('/team', data).then((r) => r.data) : api.put(`/team/${modal._id}`, data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team'] }); setModal(null); },
  });
  const del = useMutation({
    mutationFn: (id) => api.delete(`/team/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold">Team</h1>
        <button onClick={() => { reset({ name: '', role: '', bio: '', photo: '', linkedin: '', order: 0 }); setModal('new'); }} className="btn-primary py-2 px-4 text-xs"><Plus size={14} /> Add Member</button>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m._id} className="bg-surface border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm">{m.name}</div>
                  <div className="text-xs text-accent mt-0.5">{m.role}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { reset(m); setModal(m); }} className="text-[var(--color-text-secondary)] hover:text-accent"><Pencil size={13} /></button>
                  <button onClick={() => { if (confirm('Delete?')) del.mutate(m._id); }} className="text-[var(--color-text-secondary)] hover:text-danger"><Trash2 size={13} /></button>
                </div>
              </div>
              {m.bio && <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{m.bio}</p>}
            </div>
          ))}
          {members.length === 0 && <p className="text-[var(--color-text-secondary)] col-span-3 py-8 text-center">No team members yet.</p>}
        </div>
      )}
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'new' ? 'Add Member' : 'Edit Member'}>
        <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
          <input {...register('name')} placeholder="Name *" className="input-field" required />
          <input {...register('role')} placeholder="Role / Title" className="input-field" />
          <textarea {...register('bio')} placeholder="Bio" rows={3} className="input-field resize-none" />
          <input {...register('photo')} placeholder="Photo URL" className="input-field" />
          <input {...register('linkedin')} placeholder="LinkedIn URL" className="input-field" />
          <input {...register('order')} type="number" placeholder="Display order" className="input-field" />
          <button type="submit" className="btn-primary w-full justify-center" disabled={save.isPending}>{save.isPending ? <Loader size="sm" /> : 'Save'}</button>
        </form>
      </Modal>
    </div>
  );
}
