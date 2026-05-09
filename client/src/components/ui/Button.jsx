import { cn } from '../../lib/utils.js';

const variants = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost:   'btn-ghost',
};

export default function Button({ variant = 'primary', className, children, ...props }) {
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
