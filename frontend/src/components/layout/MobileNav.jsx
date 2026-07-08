import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const memberLinks = [
  { to: '/member/reports', label: 'Reports' },
  { to: '/member/reports/new', label: 'New' },
];

const managerLinks = [
  { to: '/manager/dashboard', label: 'Dashboard' },
  { to: '/manager/team-reports', label: 'Team' },
  { to: '/manager/projects', label: 'Projects' },
];

export default function MobileNav() {
  const { user, logout } = useAuth();
  const links = user?.role === 'MANAGER' ? managerLinks : memberLinks;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 flex z-50">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            `flex-1 text-center py-3 text-xs font-semibold ${isActive ? 'text-brand-600' : 'text-gray-400'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
      <button onClick={logout} className="flex-1 text-center py-3 text-xs font-semibold text-gray-400">
        Log out
      </button>
    </div>
  );
}