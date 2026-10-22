import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Menu, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AuraAssistant } from '../assistant/AuraAssistant';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === '/' && !location.search) {
      // Already on true home (language selection), do nothing to prevent exiting to browser tab
      return;
    }
    
    // Safely go back in history, or fallback to home
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleForward = () => {
    navigate(1);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-16 bg-card/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-1">
            <button onClick={handleBack} className={`p-1.5 rounded-md ${location.pathname === '/' ? 'text-muted-foreground/30 cursor-not-allowed' : 'text-muted-foreground hover:bg-muted'}`}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2 ml-1">
              <Heart className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">MediClear</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleForward} className="p-1.5 text-muted-foreground hover:bg-muted rounded-md hidden sm:block">
              <ChevronRight className="w-6 h-6" />
            </button>
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md shrink-0 ml-1"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border p-4 space-y-2">
             <Link to="/" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>{t('home_link')}</Link>
             <Link to="/history" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>{t('history_link')}</Link>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center px-6 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30 h-16">
          <div className="flex gap-2 items-center">
            <button onClick={handleBack} disabled={location.pathname === '/' && !location.search} className={`p-1.5 bg-background border border-border shadow-sm rounded-full transition-all ${location.pathname === '/' && !location.search ? 'text-muted-foreground/30 cursor-not-allowed' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`} title="Go Back">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleForward} className="p-1.5 bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all" title="Go Forward">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
      <AuraAssistant />
    </div>
  );
}