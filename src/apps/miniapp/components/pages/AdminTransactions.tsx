import React, { useState, useEffect, useCallback, useRef } from 'react';
import { mockTransactions } from '../../data';
import { Clock, Activity, CreditCard, PlusCircle, CheckCircle2, ChevronLeft, Search, Filter, Loader2, BarChart2, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Tab } from '../../types';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useDebounce } from '../../hooks/useDebounce';

// Simulate an API call
const fetchTransactionsPage = async (page: number, query: string, filterType: string) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      // In a real app, this would be an API call to the backend
      // Generate some dummy data for demonstration
      const newItems = Array.from({ length: 10 }).map((_, i) => {
        const id = `tx_${page}_${i}`;
        const isDeposit = Math.random() > 0.5;
        return {
          id,
          type: isDeposit ? 'deposit' : 'purchase',
          amount: isDeposit ? 50000 + Math.floor(Math.random() * 100000) : -(10000 + Math.floor(Math.random() * 50000)),
          description: isDeposit ? 'افزایش موجودی' : 'خرید سرویس',
          date: `1402/10/${Math.max(1, 30 - page)} - 14:30`,
          status: 'success',
          userId: `u${Math.floor(Math.random() * 100)}`,
          userName: `کاربر ${page}-${i}`
        };
      });
      
      // Stop after 5 pages
      if (page > 5) resolve([]);
      else resolve(newItems);
    }, 1000);
  });
};

export function AdminTransactions() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'reports'>('transactions');
  const [filter, setFilter] = useState<'all' | 'deposit' | 'purchase' | 'usage'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Use our infinite scroll hook
  const { 
    data: transactions, 
    setData: setTransactions, 
    loading, 
    hasMore, 
    lastElementRef,
    loadMore,
    reset
  } = useInfiniteScroll<any>(
    (page) => fetchTransactionsPage(page, debouncedSearchQuery, filter)
  );

  // Reset when filter or search changes
  useEffect(() => {
    reset();
  }, [filter, debouncedSearchQuery, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredTransactions = React.useMemo(() => transactions.filter(tx => {
    if (filter === 'deposit' && tx.type !== 'deposit') return false;
    if (filter === 'purchase' && tx.type !== 'purchase') return false;
    if (filter === 'usage' && tx.type !== 'usage_deduction') return false;
    if (debouncedSearchQuery) {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      return (
        (tx.userName && tx.userName.toLowerCase().includes(lowerQuery)) ||
        (tx.userId && tx.userId.toLowerCase().includes(lowerQuery)) ||
        tx.description.toLowerCase().includes(lowerQuery)
      );
    }  return true;
  }), [transactions, filter, debouncedSearchQuery]);

  return (
    <div className="p-4 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mt-2 mb-4">
        <h1 className="text-2xl font-bold">تراکنش‌ها و آمار</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-black/20 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'transactions' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <CreditCard size={16} />
          <span>تراکنش‌ها</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'reports' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart2 size={16} />
          <span>آمار و گزارشات</span>
        </button>
      </div>

      {activeTab === 'reports' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <div className="text-xl font-bold dir-ltr mb-1">125M <span className="text-xs text-gray-400">T</span></div>
              <div className="text-xs text-gray-400">درآمد کل</div>
            </div>
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <ArrowUpRight className="text-green-400" size={20} />
              </div>
              <div className="text-xl font-bold dir-ltr mb-1">45M <span className="text-xs text-gray-400">T</span></div>
              <div className="text-xs text-gray-400">درآمد ماهانه</div>
            </div>
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                <Activity className="text-purple-400" size={20} />
              </div>
              <div className="text-xl font-bold dir-ltr mb-1">12M <span className="text-xs text-gray-400">T</span></div>
              <div className="text-xs text-gray-400">درآمد هفتگی</div>
            </div>
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                <Clock className="text-orange-400" size={20} />
              </div>
              <div className="text-xl font-bold dir-ltr mb-1">2.5M <span className="text-xs text-gray-400">T</span></div>
              <div className="text-xs text-gray-400">درآمد روزانه</div>
            </div>
          </div>
          
          <div className="glass p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-gray-200">گزارشات آماری نوع تراکنش</h3>
              <Activity className="text-blue-400" size={16} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">خرید سرویس</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">افزایش موجودی</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">مصرف توکن/منابع</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-gray-200">تفکیک کاربران (میزان درآمد)</h3>
              <Users className="text-purple-400" size={16} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">کاربر عادی</span>
                  <span className="font-medium">40%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">نماینده</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">ربات نماینده</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Balance Summary */}
      <div className="glass p-5 flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-white/50 mb-1">جمع خروجی‌ها (این ماه)</div>
          <div className="text-lg font-bold text-red-400 dir-ltr flex items-center justify-end gap-1">
            -2,450,000 <span className="text-[10px]">T</span>
          </div>
        </div>
        <div className="h-10 w-px bg-white/10"></div>
        <div className="text-left">
          <div className="text-xs text-white/50 mb-1 text-right">جمع واریزی‌ها (این ماه)</div>
          <div className="text-lg font-bold text-green-400 dir-ltr flex items-center justify-end gap-1">
            +15,000,000 <span className="text-[10px]">T</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو کاربر، آیدی یا نوع..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            همه تراکنش‌ها
          </button>
          <button 
            onClick={() => setFilter('deposit')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors ${filter === 'deposit' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            واریزی‌ها
          </button>
          <button 
            onClick={() => setFilter('purchase')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors ${filter === 'purchase' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            خریدها
          </button>
          <button 
            onClick={() => setFilter('usage')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors ${filter === 'usage' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            کسورات مصرف
          </button>
        </div>
      </div>

      <div className="space-y-3 pb-4 mt-4">
        {filteredTransactions.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500 text-sm glass rounded-xl border border-white/5">
            تراکنشی یافت نشد
          </div>
        )}

        {filteredTransactions.map((tx, index) => {
          const isPositive = tx.amount > 0;
          const isUsage = tx.type === 'usage_deduction';
          
          let Icon = CreditCard;
          let color = isPositive ? 'text-green-400' : 'text-red-400';
          let bg = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

          if (isUsage) {
            Icon = Activity;
            color = 'text-yellow-400';
            bg = 'bg-yellow-500/10';
          } else if (tx.type === 'deposit') {
            Icon = PlusCircle;
          } else if (tx.type === 'referral_reward') {
            Icon = CheckCircle2;
          }
          
          return (
            <div 
              key={tx.id} 
              ref={index === filteredTransactions.length - 1 ? lastElementRef : null}
              className="glass p-4 rounded-xl border border-white/5 flex flex-col gap-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">{tx.description}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      {tx.userName && (
                        <span className="bg-white/5 px-2 py-0.5 rounded-md text-gray-400">
                          {tx.userName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {tx.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <div className={`font-bold dir-ltr flex items-center justify-end ${color}`}>
                    {isPositive ? '+' : ''}{tx.amount.toLocaleString('en-US')} <span className="text-[9px] ml-1 font-normal">T</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 opacity-60 flex items-center justify-end gap-0.5">
                    {tx.status === 'success' ? 'موفق' : 'ناموفق'}
                    {tx.status === 'success' && <CheckCircle2 size={10} className="text-green-500" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}
        </div>
      </div>
      )}
    </div>
  );
}
