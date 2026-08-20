import React from 'react';
import { mockTransactions } from '../../data';
import { Loader2, Clock, Activity, CreditCard, PlusCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const fetchUserTransactionsPage = async (page: number) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const newItems = Array.from({ length: 10 }).map((_, i) => {
        const id = `user_tx_${page}_${i}`;
        const isDeposit = Math.random() > 0.6;
        return {
          id,
          type: isDeposit ? 'deposit' : 'purchase',
          amount: isDeposit ? 20000 + Math.floor(Math.random() * 80000) : -(5000 + Math.floor(Math.random() * 20000)),
          description: isDeposit ? 'افزایش موجودی' : 'خرید سرویس',
          date: `1402/10/${Math.max(1, 30 - page)} - 14:30`,
          status: 'success'
        };
      });
      if (page > 3) resolve([]);
      else resolve(newItems);
    }, 800);
  });
};

import { Tab } from '../../types';

interface TransactionsProps {
  onNavigate: (tab: Tab) => void;
}

export function Transactions({ onNavigate }: TransactionsProps) {
  const { 
    data: transactions, 
    loading, 
    lastElementRef,
    loadMore,
    reset
  } = useInfiniteScroll<any>(fetchUserTransactionsPage);

  React.useEffect(() => {
    reset();
  }, [reset]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mt-2 mb-6">
        <button onClick={() => onNavigate('home')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeft size={24} className="text-gray-400 rotate-180" />
        </button>
        <h1 className="text-2xl font-bold">تراکنش‌ها و لاگ‌ها</h1>
      </div>

      {/* Balance Summary */}
      <div className="glass p-5 flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-white/50 mb-1">مصرف ماه جاری</div>
          <div className="text-lg font-bold text-red-400 dir-ltr flex items-center justify-end gap-1">
            -24,500 <span className="text-[10px]">T</span>
          </div>
        </div>
        <div className="h-10 w-px bg-white/10"></div>
        <div className="text-left">
          <div className="text-xs text-white/50 mb-1 text-right">واریزی ماه جاری</div>
          <div className="text-lg font-bold text-green-400 dir-ltr flex items-center justify-end gap-1">
            +100,000 <span className="text-[10px]">T</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pb-4">
        {transactions.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500 text-sm glass">
            تراکنشی وجود ندارد
          </div>
        )}
        {transactions.map((tx, index) => {
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
            <div key={tx.id} ref={index === transactions.length - 1 ? lastElementRef : null}
            className="glass p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">{tx.description}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock size={10} />
                    <span>{tx.date}</span>
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
          );
        })}
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
