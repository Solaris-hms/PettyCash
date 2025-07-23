// src/components/layout/SideNavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ClipboardList, ChevronsRight, LogOut, X } from 'lucide-react';

// Reusable NavLink item (no changes needed here)
const NavListItem = ({ to, children, icon: Icon }) => (
    <li>
        <NavLink to={to} className={({isActive}) => `flex items-center w-full h-12 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            {Icon && <Icon className="mr-3 flex-shrink-0" size={20} />}
            <span className="truncate">{children}</span>
        </NavLink>
    </li>
);

// Main Component with Responsive Classes
const SideNavBar = ({ isSidebarOpen, onClose, user, onLogout }) => {
  return (
    <aside className={`
      bg-slate-900 text-white w-64 flex flex-col
      fixed inset-y-0 left-0 z-30
      transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
      transition-transform duration-300 ease-in-out
      shadow-xl
    `}>
      {/* Header with Logo and Close Button for Mobile */}
      <div className="flex items-center justify-between h-20 border-b border-slate-700 px-4">
        <h1 className="text-xl font-bold tracking-wider text-white">PettyCash Pro</h1>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
            {user?.role === 'admin' && <NavListItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavListItem>}
            {user?.role === 'employee' && (
                <>
                    <NavListItem to="/forecast" icon={ChevronsRight}>Daily Forecast</NavListItem>
                    <NavListItem to="/approval-request" icon={PlusCircle}>Approval Request</NavListItem>
                    <NavListItem to="/my-requests" icon={ClipboardList}>My Requests</NavListItem>
                </>
            )}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 py-4 mt-auto border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center h-10 px-4 text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          <LogOut className="mr-2" size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNavBar;