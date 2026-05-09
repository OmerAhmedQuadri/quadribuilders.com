import { cn } from '../../lib/utils.js';

const colors = {
  completed: 'bg-[#38A169]/10 text-[#38A169] border-[#38A169]/20',
  ongoing:   'bg-accent/10 text-accent border-accent/20',
  upcoming:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  new:       'bg-accent/10 text-accent border-accent/20',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  qualified: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  closed:    'bg-[#38A169]/10 text-[#38A169] border-[#38A169]/20',
};

export default function Badge({ status, children, className }) {
  return (
    <span className={cn(
      'inline-flex items-center border px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium',
      colors[status] || 'bg-[#222] text-[var(--color-text-secondary)] border-border',
      className
    )}>
      {children || status}
    </span>
  );
}
