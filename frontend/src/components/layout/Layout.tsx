import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSidebarStore, useAuthStore } from '../../stores';
import {
  LayoutDashboard, ShoppingCart, Package, MessageSquare,
  PanelLeftClose, PanelLeft, Plus, LogOut, User, UsersRound,
  Leaf
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', adminOnly: false },
  { to: '/orders', icon: ShoppingCart, label: 'Commandes', adminOnly: false },
  { to: '/orders/new', icon: Plus, label: 'Nouvelle Commande', adminOnly: false },
  { to: '/products', icon: Package, label: 'Produits', adminOnly: false },
  { to: '/chat', icon: MessageSquare, label: 'Assistant IA', adminOnly: false },
  { to: '/users', icon: UsersRound, label: 'Utilisateurs', adminOnly: true },
];

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Commandes',
  '/orders/new': 'Nouvelle Commande',
  '/products': 'Produits',
  '/chat': 'Assistant IA AgroBot',
  '/users': 'Gestion des Utilisateurs',
};

export default function Layout() {
  const { collapsed, toggle } = useSidebarStore();
  const { user, logout, isAdmin } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'AgroSmart';
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'Utilisateur';

  // Filter nav items based on role
  const visibleNavItems = navItems.filter(item => !item.adminOnly || admin);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon"><Leaf size={28} className="login-logo-leaf" /></div>
          <span className="logo-text">AgroSmart</span>
        </div>
        <nav className="sidebar-nav">
          <span className="nav-label">Menu Principal</span>
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section with logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          <div className="nav-item" style={{ cursor: 'default', marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: admin
                ? 'linear-gradient(135deg, var(--tertiary), var(--tertiary-container))'
                : 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <User size={16} color="white" />
            </div>
            <div className="nav-text" style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 13 }}>{displayName}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                {user?.is_superuser ? 'Super Admin' : user?.is_staff ? 'Administrateur' : 'Commercial'}
              </div>
            </div>
          </div>
          <button className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={18} />
            <span className="nav-text">Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="toggle-btn" onClick={toggle}>
              {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <h2 className="header-title">{title}</h2>
          </div>
          <div className="header-right">
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
              👤 {displayName}
            </span>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
