import { BarChart3, LayoutDashboard, LogOut, Map, PlusCircle } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { clearSession, getStoredUser } from '../api/client.js';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/report', label: 'Report', icon: PlusCircle },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Shell() {
  const navigate = useNavigate();
  const user = getStoredUser();

  function logout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CM</span>
          <div>
            <strong>CivicMind AI</strong>
            <small>{user?.role ?? 'citizen'}</small>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button className="icon-text ghost" type="button" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}

