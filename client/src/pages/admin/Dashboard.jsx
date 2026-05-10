import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Inbox, FolderKanban, FileText } from 'lucide-react';
import api from '../../lib/api.js';
import Badge from '../../components/ui/Badge.jsx';
import { formatDate } from '../../lib/utils.js';

const LEAD_LABEL = {
  callback: 'Callback', enquiry: 'Enquiry',
  'listed-property': 'Listed Prop', 'unlisted-property': 'Off-Market', contract: 'Contract',
};

export default function Dashboard() {
  const { data: leads = [] } = useQuery({
    queryKey: ['admin', 'leads'],
    queryFn: () => api.get('/leads').then((r) => r.data),
  });
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => api.get('/projects').then((r) => r.data),
  });
  const { data: posts = [] } = useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: () => api.get('/blog/admin/all').then((r) => r.data),
  });

  const newLeads = leads.filter((l) => l.status === 'new');
  const byType = leads.reduce((acc, l) => { acc[l.type] = (acc[l.type] || 0) + 1; return acc; }, {});

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Leads',    value: leads.length,    icon: Inbox,         to: '/admin/leads' },
          { label: 'New Leads',      value: newLeads.length, icon: Inbox,         to: '/admin/leads' },
          { label: 'Projects',       value: projects.length, icon: FolderKanban,  to: '/admin/projects' },
          { label: 'Blog Posts',     value: posts.length,    icon: FileText,      to: '/admin/blog' },
        ].map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="bg-surface border border-border p-5 hover:border-accent transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--color-text-secondary)] tracking-wider uppercase">{label}</span>
              <Icon size={14} className="text-[var(--color-text-secondary)]" />
            </div>
            <div className="font-display text-4xl font-semibold text-accent">{value}</div>
          </Link>
        ))}
      </div>

      {/* Lead type breakdown */}
      {Object.keys(byType).length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-lg font-semibold mb-4">Leads by Type</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(byType).map(([type, count]) => (
              <div key={type} className="bg-surface border border-border px-4 py-2 text-sm">
                <span className="text-[var(--color-text-secondary)]">{LEAD_LABEL[type] || type}</span>
                <span className="ml-3 text-accent font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">Recent Leads</h2>
          <Link to="/admin/leads" className="text-xs text-accent hover:underline">View all →</Link>
        </div>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-xs text-[var(--color-text-secondary)] tracking-wider uppercase">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 10).map((lead) => (
                <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{LEAD_LABEL[lead.type]}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{lead.phone}</td>
                  <td className="px-4 py-3"><Badge status={lead.status} /></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">No leads yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
