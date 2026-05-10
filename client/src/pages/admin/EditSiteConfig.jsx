import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
import api from '../../lib/api.js';
import Loader from '../../components/ui/Loader.jsx';

const Field = ({ label, children }) => (
  <div>
    <label className="text-xs text-[var(--color-text-secondary)] tracking-wider uppercase mb-1 block">{label}</label>
    {children}
  </div>
);

export default function EditSiteConfig() {
  const qc = useQueryClient();
  const { data: config, isLoading } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: () => api.get('/config').then((r) => r.data),
  });

  const { register, handleSubmit, reset } = useForm();
  useEffect(() => { if (config) reset(config); }, [config, reset]);

  const save = useMutation({
    mutationFn: (data) => api.put('/config', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['siteConfig'] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold">Site Configuration</h1>
        {save.isSuccess && (
          <span className="flex items-center gap-1.5 text-xs text-[#38A169]"><CheckCircle2 size={14} />Saved</span>
        )}
      </div>

      <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-6">
        <section>
          <h2 className="font-display text-lg font-semibold mb-4 border-b border-border pb-2">Company Info</h2>
          <div className="space-y-4">
            <Field label="Company Name"><input {...register('companyName')} className="input-field" /></Field>
            <Field label="Tagline"><input {...register('tagline')} className="input-field" /></Field>
            <Field label="Description"><textarea {...register('description')} rows={3} className="input-field resize-none" /></Field>
            <Field label="Phone (one per line)"><textarea {...register('phone')} rows={2} className="input-field resize-none text-sm" placeholder="+91 98765 43210" /></Field>
            <Field label="Email (one per line)"><textarea {...register('email')} rows={2} className="input-field resize-none text-sm" /></Field>
            <Field label="Address"><input {...register('address')} className="input-field" /></Field>
            <Field label="Google Maps Embed URL"><input {...register('mapEmbedUrl')} className="input-field text-sm" /></Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-4 border-b border-border pb-2">Hero Section</h2>
          <div className="space-y-4">
            <Field label="Headline"><input {...register('hero.headline')} className="input-field" /></Field>
            <Field label="Sub-headline"><input {...register('hero.subheadline')} className="input-field" /></Field>
            <Field label="CTA Button Text"><input {...register('hero.ctaText')} className="input-field" /></Field>
            <Field label="CTA Link"><input {...register('hero.ctaLink')} className="input-field" /></Field>
            <Field label="Background Image URL"><input {...register('hero.backgroundImage')} className="input-field text-sm" /></Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-4 border-b border-border pb-2">Social Links</h2>
          <div className="space-y-4">
            {['instagram', 'linkedin', 'facebook', 'twitter', 'youtube'].map((s) => (
              <Field key={s} label={s.charAt(0).toUpperCase() + s.slice(1)}>
                <input {...register(`social.${s}`)} className="input-field" placeholder={`https://${s}.com/...`} />
              </Field>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-4 border-b border-border pb-2">SEO</h2>
          <div className="space-y-4">
            <Field label="Meta Title"><input {...register('seo.metaTitle')} className="input-field" /></Field>
            <Field label="Meta Description"><textarea {...register('seo.metaDescription')} rows={2} className="input-field resize-none" /></Field>
            <Field label="OG Image URL"><input {...register('seo.ogImage')} className="input-field text-sm" /></Field>
          </div>
        </section>

        <button type="submit" className="btn-primary" disabled={save.isPending}>
          {save.isPending ? <Loader size="sm" /> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
