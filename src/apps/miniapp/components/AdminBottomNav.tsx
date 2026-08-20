import React from 'react';
import { Settings, Server, Activity, CircleDollarSign, MessageSquare, Users, Home } from 'lucide-react';
import { Tab } from '../types';

interface AdminBottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function AdminBottomNav({ currentTab, onTabChange }: AdminBottomNavProps) {
  const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: 'admin_settings', icon: Settings, label: 'تنظیمات' },
    { id: 'admin_panels', icon: Server, label: 'سرویس‌ها' },
    { id: 'admin_tickets', icon: MessageSquare, label: 'تیکت' },
    { id: 'home', icon: Home, label: 'خروج' },
    { id: 'admin_transactions', icon: Activity, label: 'تراکنش' },
    { id: 'admin_profit', icon: CircleDollarSign, label: 'سود' },
    { id: 'admin_users', icon: Users, label: 'کاربران' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass rounded-none border-t border-white/10 bg-black/40 flex justify-between items-center px-1 py-3 max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        // Consider 'admin' as 'admin_panels' for backward compatibility
        const isActive = currentTab === item.id || (currentTab === 'admin' && item.id === 'admin_panels');
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 cursor-pointer group ${isActive ? 'text-blue-400' : 'text-gray-400'} transition-colors`}
          >
            <Icon size={18} className={`${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} transition-opacity`} />
            <span className={`text-[8px] sm:text-[9px] ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} transition-opacity whitespace-nowrap`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
