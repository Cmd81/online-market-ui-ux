import React from 'react';
import { mockUser, mockReferrals } from '../../data';
import { Users, Copy, Gift, TrendingUp } from 'lucide-react';

export function Referral() {
  const handleCopy = () => {
    navigator.clipboard.writeText(`https://t.me/MiniAppBot?start=${mockUser.referralCode}`);
    console.log('Copied link');
  };

  return (
    <div className="p-4 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-center mt-2 mb-4">زیرمجموعه‌گیری</h1>
      
      {/* Invite Card */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-bl-full border-b border-l border-purple-500/20"></div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-4">
            <Gift size={24} />
          </div>
          <h2 className="text-lg font-bold mb-2">دوستان خود را دعوت کنید!</h2>
          <p className="text-sm text-gray-400 mb-5 leading-relaxed">
            با دعوت هر کاربر جدید، ۱۵٪ از اولین خرید آنها را به عنوان پاداش در کیف پول خود دریافت کنید.
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-sm dir-ltr">
              <span className="text-gray-400 truncate">t.me/bot?start={mockUser.referralCode}</span>
            </div>
            <button 
              onClick={handleCopy}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Users size={16} />
            <span className="text-xs font-medium">کل زیرمجموعه‌ها</span>
          </div>
          <p className="text-2xl font-bold">{mockUser.totalReferrals}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">درآمد کل</span>
          </div>
          <p className="text-xl font-bold">{mockUser.referralIncome.toLocaleString('en-US')} <span className="text-[10px] text-gray-500 font-normal">تومان</span></p>
        </div>
      </div>

      {/* List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3 px-1">لیست زیرمجموعه‌ها</h3>
        <div className="glass-card divide-y divide-white/5">
          {mockReferrals.map(ref => (
            <div key={ref.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                  {ref.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{ref.name}</p>
                  <p className="text-[10px] text-gray-500">{ref.joinDate}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-green-400">+{ref.rewardEarned.toLocaleString('en-US')} T</p>
                <p className="text-[9px] text-gray-500 mt-0.5">پاداش</p>
              </div>
            </div>
          ))}
          {mockReferrals.length === 0 && (
            <div className="p-6 text-center text-xs text-gray-500">
              هنوز کسی با لینک شما ثبت‌نام نکرده است.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
