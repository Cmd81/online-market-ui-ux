import React, { useState } from 'react';
import { Users, Search, Filter, Settings, Crown, User as UserIcon, ChevronLeft, ArrowRight, Wallet, Ban, CheckCircle, Activity, ShoppingBag, CreditCard, Plus, Minus, UserCog, Edit2, ShieldAlert, Copy, Check , Loader2} from 'lucide-react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useDebounce } from '../../hooks/useDebounce';

// Simulate an API call
const fetchUsersPage = async (page: number, query: string, filterType: string) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const newItems = Array.from({ length: 15 }).map((_, i) => {
        const id = `u_${page}_${i}`;
        const role = Math.random() > 0.8 ? 'reseller' : 'user';
        return {
          id,
          name: `کاربر تستی ${page}-${i}`,
          username: `@user_${page}_${i}`,
          role,
          balance: Math.floor(Math.random() * 100) * 10000,
          joinedAt: `1402/10/${Math.max(1, 30 - page)}`,
          hasBot: role === 'reseller' ? Math.random() > 0.5 : false,
          level: role === 'reseller' ? ['bronze', 'silver', 'gold'][Math.floor(Math.random() * 3)] : 'none'
        };
      });
      if (page > 3) resolve([]);
      else resolve(newItems);
    }, 600);
  });
};

import { User, ResellerLevel } from '../../types';

export function AdminUsers({ resellerLevels }: { resellerLevels: ResellerLevel[] }) {
  const [filter, setFilter] = useState<'all' | 'user' | 'reseller'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'settings' | 'services' | 'transactions'>('info');
  const [isBanned, setIsBanned] = useState(false);
  const [amountValue, setAmountValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'user' | 'service'>('user');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { 
    data: users, 
    setData: setUsers, 
    loading, 
    lastElementRef,
    loadMore,
    reset
  } = useInfiniteScroll<any>(
    (page) => fetchUsersPage(page, debouncedSearchQuery, filter)
  );

  React.useEffect(() => {
    reset();
  }, [filter, debouncedSearchQuery, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredUsers = React.useMemo(() => users.filter(user => {
    if (filter === 'user' && user.role !== 'user') return false;
    if (filter === 'reseller' && user.role !== 'reseller') return false;
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      if (searchType === 'user') {
        return user.name.toLowerCase().includes(q) || user.username.toLowerCase().includes(q) || user.id.includes(q);
      }
      return true; // Simple mock behavior
    }  return true;
  }), [users, filter, debouncedSearchQuery, searchType]);




  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmountValue('');
      return;
    }
    // Format with commas
    const formatted = parseInt(rawValue, 10).toLocaleString('en-US');
    setAmountValue(formatted);
  };


  if (selectedUser) {
    return (
      <div className="p-4 space-y-5 animate-in slide-in-from-right duration-300 pb-20">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button 
            onClick={() => setSelectedUser(null)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-bold">پروفایل کاربر</h1>
        </div>

        {/* User Header Summary */}
        <div className="glass p-5 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
          {isBanned && (
            <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center pointer-events-none">
              <span className="text-red-500/20 font-black text-6xl -rotate-12 select-none">BANNED</span>
            </div>
          )}
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            {selectedUser.role === 'reseller' ? (selectedUser.hasBot ? <Crown size={40} /> : <Settings size={40} />) : <UserIcon size={40} />}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold flex flex-wrap items-center justify-center gap-2">
              {selectedUser.name}
              {selectedUser.role === 'reseller' && (
                <>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">نماینده</span>
                  {selectedUser.hasBot && <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded">ربات‌دار</span>}
                  {selectedUser.level && selectedUser.level !== 'none' && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">سطح {resellerLevels.find(l => l.id === selectedUser.level)?.name || selectedUser.level}</span>}
                </>
              )}
            </h2>
            <div className="text-gray-400 text-sm mt-1">{selectedUser.username}</div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(selectedUser.id);
                // Simple visual feedback
                const el = e.currentTarget;
                const originalText = el.innerHTML;
                el.innerHTML = `<span class="flex items-center gap-1 text-green-400"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>کپی شد</span>`;
                setTimeout(() => {
                  if(el) el.innerHTML = originalText;
                }, 2000);
              }}
              className="text-gray-400 hover:text-white text-xs mt-2 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md w-fit mx-auto transition-all active:scale-95 border border-white/5"
              title="کپی کردن آیدی عددی"
            >
              <span>{selectedUser.id}</span>
              <Copy size={12} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${activeTab === 'info' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            اطلاعات
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            تنظیمات
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${activeTab === 'services' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            سرویس‌ها
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${activeTab === 'transactions' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            تراکنش‌ها
          </button>
        </div>

        {/* Content based on Tab */}
        {activeTab === 'info' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="glass p-4 space-y-4">
              <h3 className="font-bold text-sm text-gray-300 flex items-center gap-2 mb-4">
                <UserIcon size={16} className="text-blue-400" />
                اطلاعات حساب
              </h3>
              
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">موجودی کیف پول</span>
                <span className="text-sm font-mono text-green-400">{selectedUser.balance.toLocaleString()} T</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">تعداد خرید کل</span>
                <span className="text-sm text-white">{selectedUser.totalPurchasesCount || 0} عدد</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">تعداد زیرمجموعه‌ها</span>
                <span className="text-sm text-white">{selectedUser.totalReferrals} نفر</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">درآمد از زیرمجموعه</span>
                <span className="text-sm text-white font-mono">{selectedUser.referralIncome.toLocaleString()} T</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">تاریخ عضویت</span>
                <span className="text-sm text-white">1402/10/12</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="glass p-4 space-y-4">
              <h3 className="font-bold text-sm text-gray-300 flex items-center gap-2 mb-4">
                <UserCog size={16} className="text-blue-400" />
                تغییر نوع کاربر
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setSelectedUser({...selectedUser, role: 'user'})}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${selectedUser.role === 'user' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  <UserIcon size={20} />
                  <span className="text-xs">کاربر عادی</span>
                </button>
                <button 
                  onClick={() => setSelectedUser({...selectedUser, role: 'reseller'})}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${selectedUser.role === 'reseller' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  <Settings size={20} />
                  <span className="text-xs">نماینده</span>
                </button>
              </div>

              {selectedUser.role === 'reseller' && (
                <div className="pt-4 border-t border-white/10 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedUser.hasBot ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        <Crown size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">ربات اختصاصی</div>
                        <div className="text-xs text-gray-400">وضعیت ربات این نماینده</div>
                      </div>
                    </div>
                    <div>
                      {selectedUser.hasBot ? (
                        <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md">دارد</span>
                      ) : (
                        <span className="text-xs bg-gray-500/10 text-gray-400 px-2 py-1 rounded-md">ندارد</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-2">سطح نماینده:</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {resellerLevels.map(level => (
                        <button 
                          key={level.id}
                          onClick={() => setSelectedUser({...selectedUser, level: level.id})}
                          className={`p-2 rounded-lg border text-xs text-center transition-colors ${selectedUser.level === level.id ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                          {level.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="glass p-4 space-y-4">
              <h3 className="font-bold text-sm text-gray-300 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-blue-400" />
                  مدیریت موجودی
                </div>
                <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg font-mono">
                  فعلی: {selectedUser.balance.toLocaleString()} T
                </div>
              </h3>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={amountValue}
                  onChange={handleAmountChange}
                  placeholder="مبلغ (تومان)..." 
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-left font-mono"
                  dir="ltr"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors">
                  <Plus size={16} />
                  افزایش موجودی
                </button>
                <button className="flex-1 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors">
                  <Minus size={16} />
                  کاهش موجودی
                </button>
              </div>
            </div>

            <div className="glass p-4 space-y-4 border-red-500/20 border">
              <h3 className="font-bold text-sm text-red-400 flex items-center gap-2 mb-4">
                <ShieldAlert size={16} />
                وضعیت کاربر
              </h3>
              
              <button 
                onClick={() => setIsBanned(!isBanned)}
                className={`w-full py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors ${
                  isBanned 
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                }`}
              >
                {isBanned ? (
                  <>
                    <CheckCircle size={16} />
                    آزاد کردن کاربر
                  </>
                ) : (
                  <>
                    <Ban size={16} />
                    بن کردن کاربر
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                {isBanned ? 'کاربر در حال حاضر مسدود است و نمی‌تواند از سیستم استفاده کند.' : 'با بن کردن، کاربر دیگر قادر به استفاده از سیستم و سرویس‌های خود نخواهد بود.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-3 animate-in fade-in">
            {[1, 2].map((i) => (
              <div key={i} className="glass p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">سرویس آلمان V2Ray</h3>
                      <div className="text-xs text-gray-400 mt-1">حجم: 50 گیگابایت (12 گیگ مصرف شده)</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-md font-medium">
                    فعال
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-white/5">
                  <span>انقضا: 1402/11/12</span>
                  <span>IP Limit: 2</span>
                </div>
              </div>
            ))}
            
            <div className="text-center py-4">
              <button className="text-blue-400 text-sm font-medium hover:text-blue-300">
                مشاهده همه سرویس‌ها
              </button>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-3 animate-in fade-in">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">افزایش موجودی</h3>
                    <div className="text-xs text-gray-400 mt-1">1402/10/12 - 14:30</div>
                  </div>
                </div>
                <div className="text-sm font-bold font-mono text-green-400">
                  + 50,000 T
                </div>
              </div>
            ))}
            
            <div className="text-center py-4">
              <button className="text-blue-400 text-sm font-medium hover:text-blue-300">
                مشاهده همه تراکنش‌ها
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-3 mt-2 mb-6">
        <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
      </div>
      
      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <button 
            onClick={() => setSearchType('user')}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors border ${searchType === 'user' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            جستجو بر اساس کاربر
          </button>
          <button 
            onClick={() => setSearchType('service')}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors border ${searchType === 'service' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            جستجو بر اساس سرویس
          </button>
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchType === 'user' ? "جستجوی کاربر (نام، شناسه...)" : "جستجوی نام سرویس..."} 
            className="w-full bg-black/20 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            همه کاربران
          </button>
          <button 
            onClick={() => setFilter('user')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors ${filter === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            کاربران عادی
          </button>
          <button 
            onClick={() => setFilter('reseller')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors ${filter === 'reseller' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            نماینده‌ها
          </button>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        {filteredUsers.map((user, index) => (
          <div 
            key={user.id} 
            ref={index === filteredUsers.length - 1 ? lastElementRef : null}
            className="glass p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setSelectedUser(user)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                {user.role === 'reseller' ? (user.hasBot ? <Crown size={20} /> : <Settings size={20} />) : <UserIcon size={20} />}
              </div>
              <div>
                <div className="font-medium text-sm flex items-center gap-2">
                  {user.name}
                  {user.role === 'reseller' && (
                    <>
                      <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">نماینده</span>
                      {user.hasBot && <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded">ربات‌دار</span>}
                      {user.level && user.level !== 'none' && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">سطح {resellerLevels.find(l => l.id === user.level)?.name || user.level}</span>}
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">{user.username}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left shrink-0">
              <div className="text-xs font-bold font-mono text-green-400">{user.balance.toLocaleString()} T</div>
              <ChevronLeft size={16} className="text-gray-500" />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
