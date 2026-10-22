import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, FileText, History, Home } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function Header() {
  const location = useLocation();
  const { t } = useTranslation();
  
  const links = [
    { path: '/', label: t('home_link'), icon: Home },
    { path: '/history', label: t('history_link'), icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground tracking-tight text-lg hidden sm:block">
              MediClear
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {links.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}