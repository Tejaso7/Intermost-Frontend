'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Building,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Newspaper,
  BarChart3,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/utils';
import AdminChatWidget from './AdminChatWidget';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Countries', href: '/admin/countries', icon: Globe },
  { name: 'Colleges', href: '/admin/colleges', icon: Building },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Users },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Team', href: '/admin/team', icon: Users },
  { name: 'Knowledge Base', href: '/admin/knowledge-base', icon: Database },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUsername, setAdminUsername] = useState('Admin');
  const [showWelcome, setShowWelcome] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check authentication and session expiry
    const token = storage.get<string>('access_token');
    const sessionExpires = storage.get<string>('session_expires');
    const username = storage.get<string>('admin_username');
    const loginTime = storage.get<string>('login_time');
    
    if (token && sessionExpires) {
      const expiryDate = new Date(sessionExpires);
      const now = new Date();
      
      if (now > expiryDate) {
        // Session expired - clear and redirect
        handleLogout();
        return;
      }
      
      setIsAuthenticated(true);
      if (username) setAdminUsername(username);
      
      // Show welcome message on first load after login
      if (loginTime) {
        const loginDate = new Date(loginTime);
        const timeSinceLogin = now.getTime() - loginDate.getTime();
        // Show welcome if logged in within last 5 seconds
        if (timeSinceLogin < 5000) {
          setShowWelcome(true);
          setTimeout(() => setShowWelcome(false), 5000);
        }
      }
      
      setIsLoading(false);
    } else if (pathname !== '/admin/login') {
      // Redirect to login if not authenticated
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    storage.remove('access_token');
    storage.remove('refresh_token');
    storage.remove('admin_username');
    storage.remove('login_time');
    storage.remove('session_expires');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="spinner" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600">Intermost</span>
            <span className="text-sm text-gray-500">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600">{adminUsername.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{adminUsername}</p>
                <p className="text-xs text-gray-500">Session expires in 24h</p>
              </div>
              <ChevronDown className="hidden md:block w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Welcome Banner */}
        {showWelcome && (
          <div className="mx-4 md:mx-6 mt-4 p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl shadow-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👋</span>
                <div>
                  <p className="font-semibold text-lg">Welcome back, {adminUsername}!</p>
                  <p className="text-primary-100 text-sm">Your session is valid for 24 hours. Happy managing!</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
          {children}
        </main>

        {/* Admin AI Chat Widget */}
        <AdminChatWidget />
      </div>
    </div>
  );
}
