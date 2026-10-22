import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, History, Home, LogIn } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  
  const links = [
    { path: '/', label: t('home_link'), icon: Home },
    { path: '/history', label: t('history_link'), icon: History },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card text-card-foreground fixed inset-y-0 left-0 z-40">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            MediClear
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-2">
        {links.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border mt-auto">
        <Link 
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground bg-primary/5 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <LogIn className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Account</span>
            <span className="text-xs text-muted-foreground">Sign In / Register</span>
          </div>
        </Link>
      </div>

    </aside>
  );
}
