import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight } from 'lucide-react';
import api from '../../lib/api.js';
import Badge from '../../components/ui/Badge.jsx';
import { formatDate } from '../../lib/utils.js';

const TYPES   = ['all', 'callback', 'enquiry', 'listed-property', 'unlisted-property', 'contract'];
const STATUSES = ['new', 'contacted', 'qualified', 'closed'];

export default function LeadsInbox() {
  const qc = useQueryClient();
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [expanded,     setExpanded]     = useState(null);
  const [editNotes,    setEditNotes]    = useState({});

  const { data: leads = [] } = useQuery({
    queryKey: ['admin', 'leads', typeFilter],
    queryFn: () => api.get(`/leads${typeFilter !== 'all' ? `?type=${typeFilter}` : ''}`).then((r) => r.data),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }) => api.put(`/leads/${id}`, body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'leads'] }),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-6">Leads Inbox</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-4 py-1.5 text-xs tracking-wider uppercase font-medium border transition-all ${
              typeFilter === t ? 'bg-accent text-[#0a0a0a] border-accent' : 'border-border text-[var(--color-text-secondary)] hover:border-accent hover:text-accent'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {leads.length === 0 && <p className="text-[var(--color-text-secondary)] py-8 text-center">No leads found.</p>}
        {leads.map((lead) => (
          <div key={lead._id} className="border border-border bg-surface">
            {/* Row */}
            <button
              className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-[#0a0a0a] transition-colors"
              onClick={() => setExpanded(expanded === lead._id ? null : lead._id)}
            >
              {expanded === lead._id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className="font-medium text-sm flex-1">{lead.name}</span>
              <span className="text-xs text-[var(--color-text-secondary)] w-28 hidden sm:block">{lead.phone}</span>
              <span className="text-xs text-[var(--color-text-secondary)] w-32 hidden md:block capitalize">{lead.type.replace(/-/g, ' ')}</span>
              <Badge status={lead.status} />
              <span className="text-xs text-[var(--color-text-secondary)] hidden lg:block">{formatDate(lead.createdAt)}</span>
            </button>

            {/* Expanded */}
            {expanded === lead._id && (
              <div className="px-6 pb-5 border-t border-border pt-4 grid md:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  {[
                    ['Email',          lead.email],
                    ['Preferred Time', lead.preferredTime],
                    ['Budget',         lead.budget],
                    ['Location',       lead.location],
                    ['Message',        lead.message],
                    ['Company',        lead.companyName],
                    ['Project Scope',  lead.projectScope],
                    ['Timeline',       lead.timeline],
                    ['Property Desc',  lead.propertyDescription],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">{k}: </span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[var(--color-text-secondary)] tracking-wider uppercase mb-1 block">Status</label>
                    <select
                      value={lead.status}
                      onChange={(e) => update.mutate({ id: lead._id, status: e.target.value, notes: editNotes[lead._id] ?? lead.notes })}
                      className="input-field"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--color-text-secondary)] tracking-wider uppercase mb-1 block">Internal Notes</label>
                    <textarea
                      rows={3}
                      value={editNotes[lead._id] ?? lead.notes ?? ''}
                      onChange={(e) => setEditNotes((p) => ({ ...p, [lead._id]: e.target.value }))}
                      className="input-field resize-none text-sm"
                      placeholder="Add notes visible only to admin…"
                    />
                    <button
                      onClick={() => update.mutate({ id: lead._id, status: lead.status, notes: editNotes[lead._id] })}
                      className="mt-2 btn-outline py-1.5 px-4 text-xs"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
