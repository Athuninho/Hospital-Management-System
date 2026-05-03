import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Pill, TestTube, LogOut, BedDouble, CalendarClock } from 'lucide-react';

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Pill, TestTube, LogOut, BedDouble, CalendarClock } from 'lucide-react';
import auth from '../../services/auth';

export default function Sidebar() {
  const user = auth.getUserFromToken();
  const role = user?.role || 'reception';

  // menu visibility by role
  const menu = [
    { title: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin','doctor','nurse','reception','lab','pharmacy','billing'] },
    { title: 'Queue & Appts', path: '/queue', icon: <CalendarClock size={20} />, roles: ['reception','doctor','nurse'] },
    { title: 'Patients', path: '/patients', icon: <Users size={20} />, roles: ['reception','doctor','nurse'] },
    { title: 'Billing & NHIF', path: '/billing', icon: <CreditCard size={20} />, roles: ['billing','admin'] },
    { title: 'Pharmacy', path: '/pharmacy', icon: <Pill size={20} />, roles: ['pharmacy','admin'] },
    { title: 'Laboratory', path: '/lab', icon: <TestTube size={20} />, roles: ['lab','admin'] },
    { title: 'Inpatient Wards', path: '/wards', icon: <BedDouble size={20} />, roles: ['nurse','doctor','admin'] },
  ].filter(item => item.roles.includes(role));

  function handleLogout() {
    auth.logout();
    window.location.href = '/login';
  }

  return (
    <div className="w-64 h-screen bg-primary text-white flex flex-col justify-between fixed">
      <div>
        <div className="p-6 font-bold text-2xl border-b border-white/20 tracking-wide flex items-center gap-2">
          <span className="bg-white text-primary rounded-full w-8 h-8 flex items-center justify-center">H</span>
          Mombasa HMS
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          {menu.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-white/20">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-slate-200 hover:text-white">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
