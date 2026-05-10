import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Settings, FolderKanban, FileText, Users, Star, Inbox, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { PageLoader } from '../../components/ui/Loader.jsx';

const Dashboard         = lazy(() => import('./Dashboard.jsx'));
const EditSiteConfig    = lazy(() => import('./EditSiteConfig.jsx'));
const ManageProjects    = lazy(() => import('./ManageProjects.jsx'));
const ManageBlog        = lazy(() => import('./ManageBlog.jsx'));
const ManageTeam        = lazy(() => import('./ManageTeam.jsx'));
const ManageTestimonials = lazy(() => import('./ManageTestimonials.jsx'));
const LeadsInbox        = lazy(() => import('./LeadsInbox.jsx'));

const nav = [
  { to: '/admin',             label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/leads',       label: 'Leads Inbox',  icon: Inbox },
  { to: '/admin/projects',    label: 'Projects',     icon: FolderKanban },
  { to: '/admin/blog',        label: 'Blog',         icon: FileText },
  { to: '/admin/team',        label: 'Team',         icon: Users },
  { to: '/admin/testimonials',label: 'Testimonials', icon: Star },
  { to: '/admin/config',      label: 'Site Config',  icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('qb_admin_token')) navigate('/admin/login');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('qb_admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-56 bg-surface border-r border-border flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-5 border-b border-border">
          <Link to="/">
            <img src="/logo.png" alt="QuadriBuilders" className="h-7 w-auto" />
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-none ${
                  isActive
                    ? 'bg-accent/10 text-accent border-l-2 border-accent'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[#0a0a0a]'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-danger transition-colors w-full">
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface border-b border-border px-5 py-3 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--color-text-secondary)]">
            <Menu size={20} />
          </button>
          <span className="font-display text-sm font-semibold">Admin Panel</span>
        </header>
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route index                  element={<Dashboard />} />
              <Route path="leads"           element={<LeadsInbox />} />
              <Route path="projects"        element={<ManageProjects />} />
              <Route path="blog"            element={<ManageBlog />} />
              <Route path="team"            element={<ManageTeam />} />
              <Route path="testimonials"    element={<ManageTestimonials />} />
              <Route path="config"          element={<EditSiteConfig />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
