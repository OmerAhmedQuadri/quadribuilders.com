import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api.js';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Loader from '../../components/ui/Loader.jsx';

const emptyProject = { title: '', type: 'residential', status: 'ongoing', isListed: false, isFeatured: false, location: '', price: '', area: '', bedrooms: '', shortDescription: '', description: '', images: '', features: '', order: 0 };

export default function ManageProjects() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'new' | project-obj

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => api.get('/projects').then((r) => r.data),
  });

  const { register, handleSubmit, reset } = useForm();

  const openNew  = () => { reset(emptyProject); setModal('new'); };
  const openEdit = (p) => { reset({ ...p, images: p.images?.join('\n') || '', features: p.features?.join('\n') || '' }); setModal(p); };

  const save = useMutation({
    mutationFn: (data) => {
      const body = { ...data, images: data.images.split('\n').filter(Boolean), features: data.features.split('\n').filter(Boolean), bedrooms: data.bedrooms || undefined, isListed: !!data.isListed, isFeatured: !!data.isFeatured };
      return modal === 'new'
        ? api.post('/projects', body).then((r) => r.data)
        : api.put(`/projects/${modal._id}`, body).then((r) => r.data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setModal(null); },
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold">Projects</h1>
        <button onClick={openNew} className="btn-primary py-2 px-4 text-xs">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> : (
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-xs text-[var(--color-text-secondary)] tracking-wider uppercase">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 hidden md:table-cell">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Listed</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 hidden md:table-cell capitalize text-[var(--color-text-secondary)]">{p.type}</td>
                  <td className="px-4 py-3"><Badge status={p.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[var(--color-text-secondary)]">{p.isListed ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-[var(--color-text-secondary)] hover:text-accent"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm('Delete this project?')) del.mutate(p._id); }} className="text-[var(--color-text-secondary)] hover:text-danger"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">No projects yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'new' ? 'Add Project' : 'Edit Project'}>
        <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
          <input {...register('title')} placeholder="Title *" className="input-field" required />
          <div className="grid grid-cols-2 gap-3">
            <select {...register('type')} className="input-field">
              {['residential','commercial','contract','mixed-use'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select {...register('status')} className="input-field">
              {['completed','ongoing','upcoming'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input {...register('location')} placeholder="Location" className="input-field" />
            <input {...register('price')} placeholder="Price (e.g. ₹1.2Cr)" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input {...register('area')} placeholder="Area (sq ft)" className="input-field" />
            <input {...register('bedrooms')} type="number" placeholder="Bedrooms" className="input-field" />
          </div>
          <textarea {...register('shortDescription')} placeholder="Short description" rows={2} className="input-field resize-none" />
          <textarea {...register('description')} placeholder="Full description" rows={4} className="input-field resize-none" />
          <textarea {...register('images')} placeholder="Image URLs (one per line)" rows={3} className="input-field resize-none text-xs" />
          <textarea {...register('features')} placeholder="Features (one per line)" rows={3} className="input-field resize-none text-xs" />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" {...register('isListed')} className="accent-accent" />
              Listed for sale
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="accent-accent" />
              Featured on home
            </label>
          </div>
          <input {...register('order')} type="number" placeholder="Display order" className="input-field" />
          <button type="submit" className="btn-primary w-full justify-center" disabled={save.isPending}>
            {save.isPending ? <Loader size="sm" /> : 'Save Project'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
