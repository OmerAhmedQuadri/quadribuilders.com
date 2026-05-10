import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import MDEditor from '@uiw/react-md-editor';
import api from '../../lib/api.js';
import Modal from '../../components/ui/Modal.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { formatDate } from '../../lib/utils.js';

export default function ManageBlog() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: () => api.get('/blog/admin/all').then((r) => r.data),
  });

  const { register, handleSubmit, reset, control } = useForm();

  const openNew  = () => { reset({ title: '', excerpt: '', content: '', author: 'QuadriBuilders', tags: '', coverImage: '', isPublished: false }); setModal('new'); };
  const openEdit = (p) => { reset({ ...p, tags: p.tags?.join(', ') || '' }); setModal(p); };

  const save = useMutation({
    mutationFn: (data) => {
      const body = { ...data, tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean), isPublished: !!data.isPublished };
      return modal === 'new'
        ? api.post('/blog', body).then((r) => r.data)
        : api.put(`/blog/${modal._id}`, body).then((r) => r.data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'blog'] }); setModal(null); },
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/blog/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold">Blog</h1>
        <button onClick={openNew} className="btn-primary py-2 px-4 text-xs"><Plus size={14} /> New Post</button>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> : (
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-xs text-[var(--color-text-secondary)] tracking-wider uppercase">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 hidden md:table-cell">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Published</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[var(--color-text-secondary)]">{p.author}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{p.isPublished ? 'Published' : 'Draft'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[var(--color-text-secondary)]">{p.publishedAt ? formatDate(p.publishedAt) : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-[var(--color-text-secondary)] hover:text-accent"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm('Delete this post?')) del.mutate(p._id); }} className="text-[var(--color-text-secondary)] hover:text-danger"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">No posts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'new' ? 'New Post' : 'Edit Post'}>
        <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
          <input {...register('title')} placeholder="Title *" className="input-field" required />
          <input {...register('author')} placeholder="Author" className="input-field" />
          <input {...register('coverImage')} placeholder="Cover Image URL" className="input-field" />
          <textarea {...register('excerpt')} placeholder="Excerpt (shown on blog listing)" rows={2} className="input-field resize-none" />
          <input {...register('tags')} placeholder="Tags (comma-separated)" className="input-field" />
          <div data-color-mode="dark">
            <label className="text-xs text-[var(--color-text-secondary)] tracking-wider uppercase mb-1 block">Content (Markdown)</label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => <MDEditor value={field.value} onChange={field.onChange} height={300} />}
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('isPublished')} className="accent-accent" />
            Publish immediately
          </label>
          <button type="submit" className="btn-primary w-full justify-center" disabled={save.isPending}>
            {save.isPending ? <Loader size="sm" /> : 'Save Post'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
