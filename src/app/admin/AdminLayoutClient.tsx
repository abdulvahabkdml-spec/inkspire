'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText, PenTool, Mic2, LayoutDashboard, Tags,
  Image as ImageIcon, Star, MessageSquare, Settings,
  LogOut, Columns, X
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',          href: '/admin' },
  { icon: FileText,        label: 'All Articles',       href: '/admin/articles' },
  { icon: PenTool,          label: 'New Article',        href: '/admin/articles/new' },
  { icon: Mic2,            label: 'Voices Editor',      href: '/admin/voices' },
  { icon: Star,            label: 'Homepage Featured',  href: '/admin/hero' },
  { icon: Tags,            label: 'Tag Manager',        href: '/admin/tags' },
  { icon: ImageIcon,       label: 'Media Library',      href: '/admin/media' },
  { icon: MessageSquare,   label: 'Comments',           href: '/admin/comments' },
  { icon: Settings,        label: 'Site Settings',      href: '/admin/settings' },
];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSplit, setIsSplit] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black z-30 flex items-center justify-between px-5 border-b border-white/10">
        <h1 className="font-serif text-lg font-bold tracking-widest uppercase text-white">Historia</h1>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white/5 rounded-lg text-white"
        >
          <LayoutDashboard size={18} />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 min-h-screen bg-black border-r border-white/5 flex flex-col py-8 px-5 fixed top-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tighter uppercase text-white">Historia</h1>
            <div className="h-0.5 w-8 bg-white/20 mt-2"></div>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-4">Command Center</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar pb-6">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href && href !== '#';
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-widest font-bold rounded transition-all duration-300 ${
                  active
                    ? 'bg-white text-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-2">
          <button
            onClick={() => setIsSplit(!isSplit)}
            className={`flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-widest font-bold rounded transition-colors ${
              isSplit 
                ? 'bg-[#ec5b13] text-white shadow-lg shadow-[#ec5b13]/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <Columns size={14} />
            Split Preview
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-widest font-bold rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 md:ml-64 mt-16 md:mt-0 min-h-screen transition-all duration-500 ease-in-out ${isSplit ? 'hidden xl:block xl:mr-[400px] 2xl:mr-[500px]' : ''}`}>
        {children}
      </div>

      {/* Live Split Preview Pane */}
      <div 
        className={`fixed top-0 right-0 h-screen bg-black border-l border-white/10 shadow-2xl z-50 flex flex-col transition-all duration-500 ease-in-out transform ${
          isSplit ? 'w-full xl:w-[400px] 2xl:w-[500px] translate-x-0' : 'w-full xl:w-[400px] 2xl:w-[500px] translate-x-full'
        }`}
      >
        <div className="h-16 shrink-0 bg-black flex items-center justify-between px-6 border-b border-white/10">
           <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Live Frontend</span>
           </div>
           
           <div className="flex items-center gap-4">
              <a 
                href="/en" 
                target="_blank"
                className="text-[9px] uppercase tracking-widest text-[#ec5b13] font-bold hover:text-white transition-colors"
              >
                Open in Tab ↗
              </a>
              <button 
                onClick={() => setIsSplit(false)}
                className="text-slate-500 hover:text-white transition-transform hover:rotate-90"
                title="Close Split View"
              >
                <X size={16} />
              </button>
           </div>
        </div>
        <div className="flex-1 w-full bg-white relative">
           <iframe 
             src="/en" 
             className="absolute inset-0 w-full h-full border-0"
             title="Live Site Preview"
           />
        </div>
      </div>
    </div>
  );
}
