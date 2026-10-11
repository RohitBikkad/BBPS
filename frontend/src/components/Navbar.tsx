import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User, School, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import { NotificationItem, Role } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, role, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchUnread = async () => {
    try {
      const res = await api.get<{ unreadCount: number }>('/notifications/unread-count');
      setUnreadCount(res.data.unreadCount);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get<NotificationItem[]>('/notifications');
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const getRoleLabel = (r: Role | null) => {
    if (r === 'ROLE_PRINCIPAL') return { label: 'Principal / Admin', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (r === 'ROLE_SUPERVISOR') return { label: 'Supervisor', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    return { label: 'Teaching Staff', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  const roleInfo = getRoleLabel(role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & School Name */}
          <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => setActiveTab('dashboard')}>
            <img src="/logo.png" alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full border border-slate-200 shadow-xs" />
            <div className="leading-tight">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base block">
                Bluebell Blossom
              </span>
              <span className="text-[10px] text-purple-700 font-semibold tracking-wide uppercase block">
                Pre-Primary School
              </span>
            </div>
          </div>

          {/* Center navigation for Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>

            {role === 'ROLE_PRINCIPAL' && (
              <>
                <button
                  onClick={() => setActiveTab('daily-approval')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'daily-approval' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Attendance Approval
                </button>
                <button
                  onClick={() => setActiveTab('staff-management')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'staff-management' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Staff Management
                </button>
              </>
            )}

            {role === 'ROLE_SUPERVISOR' && (
              <button
                onClick={() => setActiveTab('supervisor-team')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'supervisor-team' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Team Attendance
              </button>
            )}

            {role === 'ROLE_STAFF' && (
              <button
                onClick={() => setActiveTab('my-attendance')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'my-attendance' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                My Attendance
              </button>
            )}

            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'leaves' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Leaves
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'reports' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Reports
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'calendar' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Calendar
            </button>
          </nav>

          {/* Right Header items */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* User Role Badge (Read-only) */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 border border-slate-200">
              <span className="hidden sm:inline text-slate-500 font-medium">Role:</span>
              <span className={`px-2 py-0.5 rounded-full border text-[11px] ${roleInfo.color}`}>
                {role === 'ROLE_PRINCIPAL' ? 'Principal' : role === 'ROLE_SUPERVISOR' ? 'Supervisor' : 'Staff'}
              </span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={handleOpenNotifications}
                className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition-colors ${n.isRead ? 'bg-white' : 'bg-emerald-50/40'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill / Logout */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{user?.fullName}</div>
                <div className="text-[10px] text-slate-500">{user?.employeeId} • {user?.department}</div>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
