import React from 'react';
import { Home, ShoppingBag, Package, MessageSquare, Receipt, Settings2 } from 'lucide-react';
import { Tab } from '../types';
import { mockUser } from '../data';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: 'home', icon: Home, label: 'خانه' },
    { id: 'shop', icon: ShoppingBag, label: 'فروشگاه' },
    ...(mockUser.role === 'admin' ? [{ id: 'admin_panels' as Tab, icon: Settings2, label: 'مدیریت' }] : []),
    { id: 'products', icon: Package, label: 'سرویس‌ها' },
    { id: 'tickets', icon: MessageSquare, label: 'تیکت' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass rounded-none border-t border-white/10 bg-black/40 flex justify-between items-center px-4 sm:px-8 py-4 max-w-md mx-auto overflow-x-auto gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 cursor-pointer group min-w-[3.5rem] ${isActive ? 'nav-active' : ''}`}
          >
            <Icon size={20} className={`${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity`} />
            <span className={`text-[10px] ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
