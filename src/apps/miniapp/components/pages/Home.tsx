import React, { useState, useEffect } from 'react';
import { mockUser, mockTransactions } from '../../data';
import { Gift, Wallet, Users, ArrowRight, Zap, Star, ShieldCheck, Copy, LogOut, ChevronLeft, Clock, Activity, CreditCard, PlusCircle, CheckCircle2, Receipt, Lock, Shield, MessageCircle, Bot, Server, Phone, Briefcase, X } from 'lucide-react';
import { Tab } from '../../types';

interface HomeProps {
  onNavigate: (tab: Tab) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [lotteryStatus, setLotteryStatus] = useState<'idle' | 'loading' | 'won'>('idle');
  const [canPlay, setCanPlay] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isResellerModalOpen, setIsResellerModalOpen] = useState(false);
  
  const lotteryConfig = JSON.parse(localStorage.getItem('lotteryConfig') || '{"isActive":true,"volume":"1","maxWinners":"10","guaranteedWinForNewUsers":false}');

  useEffect(() => {
    const checkLottery = () => {
      const lastPlayed = localStorage.getItem('lastLotteryTime');
      if (lastPlayed) {
        const lastTime = new Date(lastPlayed).getTime();
        const now = new Date().getTime();
        const diff = now - lastTime;
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (diff < twentyFourHours) {
          setCanPlay(false);
          const remaining = twentyFourHours - diff;
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours} ساعت و ${minutes} دقیقه`);
        } else {
          setCanPlay(true);
        }
      }
    };
    
    checkLottery();
    const interval = setInterval(checkLottery, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleLottery = () => {
    if (!canPlay) return;
    
    setLotteryStatus('loading');
    setTimeout(() => {
      // Check if max winners reached for today
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem('lotteryWinnersDate');
      let winnersCount = parseInt(localStorage.getItem('lotteryWinnersCount') || '0', 10);
      
      if (storedDate !== today) {
        winnersCount = 0;
        localStorage.setItem('lotteryWinnersDate', today);
      }
      
      const maxWinners = parseInt(lotteryConfig.maxWinners || '10', 10);
      
      const isFirstTime = !localStorage.getItem('hasPlayedLotteryBefore');
      localStorage.setItem('hasPlayedLotteryBefore', 'true');
      
      if (isFirstTime && lotteryConfig.guaranteedWinForNewUsers) {
        winnersCount += 1;
        localStorage.setItem('lotteryWinnersCount', winnersCount.toString());
        setLotteryStatus('won');
      } else if (winnersCount >= maxWinners) {
        alert('ظرفیت برندگان امروز پر شده است. فردا دوباره تلاش کنید!');
      } else {
        winnersCount += 1;
        localStorage.setItem('lotteryWinnersCount', winnersCount.toString());
        setLotteryStatus('won');
      }
      
      setCanPlay(false);
      localStorage.setItem('lastLotteryTime', new Date().toISOString());
      setTimeLeft('23 ساعت و 59 دقیقه');
      
      if (winnersCount >= maxWinners && lotteryStatus !== 'won') {
         setLotteryStatus('idle');
      }
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  };

  const navigateToShop = (category?: string) => {
    if (category) {
      sessionStorage.setItem('shopCategory', category);
    } else {
      sessionStorage.removeItem('shopCategory');
    }
    onNavigate('shop');
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header (Combined Profile & Balance) */}
      <div className="p-5 flex items-center justify-between border-b border-white/5 bg-white/5 -mx-4 -mt-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 border border-white/20 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20">
            {mockUser.name.charAt(0)}
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{mockUser.name}</span>
              <span className="text-[9px] bg-white/10 text-white/80 px-1.5 py-0.5 rounded-full border border-white/10">
                {mockUser.role === "admin" ? "مدیر" : mockUser.role === "reseller" ? "نماینده" : mockUser.role === "bot_owner" ? "ربات‌دار" : "کاربر عادی"}
              </span>
            </div>
            <div className="text-xs text-white/50">{mockUser.username}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] text-white/40 tracking-widest">موجودی کیف پول</div>
          <div className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 dir-ltr">
            {mockUser.balance.toLocaleString('en-US')} T
          </div>
        </div>
      </div>
      {/* User Level Progress */}
      {mockUser.role !== "user" && (
        <div className="glass p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-between items-end mb-3 relative z-10">
            <div>
              <div className="text-xs text-yellow-400 font-medium mb-1 flex items-center gap-1"><Star size={12} /> سطح {mockUser.level === "gold" ? "طلایی" : mockUser.level === "silver" ? "نقره‌ای" : mockUser.level === "bronze" ? "برنزی" : "عادی"}</div>
              <div className="text-[10px] text-gray-400">{mockUser.role === "reseller" ? "نماینده فروش" : mockUser.role === "bot_owner" ? "ربات‌دار" : "مدیر"}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold">{mockUser.totalPurchasesCount || 0} / {mockUser.level === "none" ? 10 : mockUser.level === "bronze" ? 50 : mockUser.level === "silver" ? 100 : "MAX"} خرید</div>
              <div className="text-[9px] text-gray-400">تا ارتقاء سطح</div>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 mb-1 relative z-10">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-1.5 rounded-full" style={{ width: `${Math.min(100, ((mockUser.totalPurchasesCount || 0) / (mockUser.level === "none" ? 10 : mockUser.level === "bronze" ? 50 : 100)) * 100)}%` }}></div>
          </div>
        </div>
      )}

      {/* Main Actions */}
      <div className="flex gap-3">
        <button 
          onClick={() => console.log('Add funds')}
          className="flex-1 bg-white text-gray-900 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
        >
          افزایش موجودی
        </button>
        <button 
          onClick={() => navigateToShop()}
          className="flex-1 glass text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors"
        >
          خرید سرویس
        </button>
      </div>

      {/* Lottery Section */}
      {lotteryConfig.isActive && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-indigo-500/20 p-4">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Gift size={24} className={lotteryStatus === 'loading' ? 'animate-bounce' : ''} />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">قرعه‌کشی روزانه</h3>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  {lotteryStatus === 'won' ? (
                    <span className="text-green-400">شما {lotteryConfig.volume} گیگابایت برنده شدید!</span>
                  ) : canPlay ? (
                    <span>شانس خود را امتحان کنید ({lotteryConfig.volume} گیگابایت)</span>
                  ) : (
                    <span>زمان بعدی: {timeLeft}</span>
                  )}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLottery}
              disabled={!canPlay || lotteryStatus === 'loading'}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                !canPlay 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                  : lotteryStatus === 'loading'
                  ? 'bg-indigo-500 text-white cursor-wait'
                  : lotteryStatus === 'won'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg'
              }`}
            >
              {lotteryStatus === 'loading' ? 'در حال قرعه‌کشی...' : lotteryStatus === 'won' ? 'دریافت شد' : canPlay ? 'شرکت کن' : 'فردا بیا'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold mb-3 px-1 text-gray-200">دسترسی سریع</h2>
        <div className="grid grid-cols-4 gap-2">
          <QuickAction icon={Lock} label="فیلترشکن شخصی" color="text-yellow-400" bg="bg-yellow-400/10" onClick={() => navigateToShop('personal_vpn')} />
          <QuickAction icon={Shield} label="پنل فروش فیلترشکن" color="text-purple-400" bg="bg-purple-400/10" onClick={() => navigateToShop('vpn')} />
          <QuickAction icon={MessageCircle} label="تلگرام" color="text-blue-400" bg="bg-blue-400/10" onClick={() => navigateToShop('telegram')} />
          <QuickAction icon={Bot} label="هوش‌مصنوعی" color="text-cyan-400" bg="bg-cyan-400/10" onClick={() => navigateToShop('ai')} />
          <QuickAction icon={Server} label="سرور مجازی" color="text-indigo-400" bg="bg-indigo-400/10" onClick={() => navigateToShop('server')} />
          <QuickAction icon={Phone} label="شماره مجازی" color="text-pink-400" bg="bg-pink-400/10" onClick={() => navigateToShop('virtual_number')} />
          <QuickAction icon={Users} label="زیرمجموعه" color="text-green-400" bg="bg-green-400/10" onClick={() => onNavigate('referral')} />
          <QuickAction icon={Briefcase} label="نمایندگی" color="text-teal-400" bg="bg-teal-400/10" onClick={() => setIsResellerModalOpen(true)} />
          <QuickAction icon={Receipt} label="تراکنش‌ها" color="text-orange-400" bg="bg-orange-400/10" onClick={() => onNavigate('transactions')} />
        </div>
      </div>

      {/* Reseller Modal */}
      {isResellerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-teal-400" />
                درخواست نمایندگی
              </h2>
              <button onClick={() => setIsResellerModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto shop-scrollbar space-y-4">
              <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-xl">
                <p className="text-sm text-teal-200 leading-relaxed">
                  با دریافت نمایندگی، می‌توانید کسب‌وکار خود را شروع کنید و محصولات ما را با پنل و ربات اختصاصی خودتان به فروش برسانید.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">شرایط و ویژگی‌ها:</h3>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                    <span>خرید با <strong>قیمت همکاری و ارزان‌تر</strong> از فروشگاه اصلی</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                    <span>امکان داشتن <strong>ربات فروشگاهی اختصاصی</strong> برای خودتان</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                    <span>امکان <strong>اضافه کردن پنل‌های شخصی خودتان</strong> (با هزینه مجزا)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                    <span>حداقل حجم خرید ماهانه توافقی بر اساس سطح نمایندگی</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-gray-200">چگونه شروع کنم؟</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  ابتدا باید یک تیکت در بخش پشتیبانی ثبت کنید و درخواست نمایندگی خود را ارسال نمایید. کارشناسان ما جهت هماهنگی حجم خرید و راه‌اندازی ربات اختصاصی با شما ارتباط برقرار می‌کنند.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 shrink-0">
              <button 
                onClick={() => {
                  setIsResellerModalOpen(false);
                  onNavigate('tickets');
                }} 
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                ثبت تیکت درخواست
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Section */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-base font-semibold text-gray-200">تراکنش‌های اخیر</h2>
          <button onClick={() => onNavigate('transactions')} className="text-xs text-purple-400 flex items-center gap-1 hover:text-purple-300">
            همه <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="space-y-3">
          {mockTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm glass">
              تراکنشی وجود ندارد
            </div>
          )}
          {mockTransactions.slice(0, 3).map((tx) => {
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
              <div key={tx.id} className="glass p-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[13px] mb-0.5">{tx.description}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock size={10} />
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <div className={`font-bold dir-ltr flex items-center justify-end text-[13px] ${color}`}>
                    {isPositive ? '+' : ''}{tx.amount.toLocaleString('en-US')} <span className="text-[9px] ml-1 font-normal">T</span>
                  </div>
                  <div className="text-[9px] text-gray-500 mt-0.5 opacity-60 flex items-center justify-end gap-0.5">
                    {tx.status === 'success' ? 'موفق' : 'ناموفق'}
                    {tx.status === 'success' && <CheckCircle2 size={10} className="text-green-500" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile Settings */}
      <div>
        <h2 className="text-base font-semibold mb-3 px-1 text-gray-200">تنظیمات حساب</h2>
        <div className="glass overflow-hidden">
          <MenuButton icon={Copy} label="کپی شناسه کاربری" onClick={() => handleCopy(mockUser.id)} value={mockUser.id} />
          <div className="h-[1px] bg-white/5 mx-4"></div>
          <MenuButton icon={LogOut} label="خروج از حساب" onClick={() => console.log('Logout')} color="text-red-400" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, color, bg, onClick }: any) {
  return (
    <button onClick={onClick} className="glass p-3 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-1`}>
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-medium text-gray-300 text-center leading-tight">{label}</span>
    </button>
  );
}

function MenuButton({ icon: Icon, label, onClick, value, color = "text-gray-200" }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={color !== "text-gray-200" ? color : "text-gray-400"} />
        <span className={`text-sm font-medium ${color}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-gray-500">{value}</span>}
        <ChevronLeft size={16} className="text-gray-600" />
      </div>
    </button>
  );
}
