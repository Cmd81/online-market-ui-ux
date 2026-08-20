import React, { useState } from 'react';
import { Bot, Save, CheckCircle2, AlertCircle, Loader2, User, Crown, Shield, Clock, PlusCircle, Trash2 } from 'lucide-react';

export function AdminBot() {
  const [activeTab, setActiveTab] = useState<'basic' | 'pro' | 'pro_plans'>('basic');
  
  // Basic settings
  const [botToken, setBotToken] = useState('');
  const [adminId, setAdminId] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Pro settings
  const [isPro, setIsPro] = useState(false);
  const [proDaysLeft, setProDaysLeft] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Pro plans (Admin only)
  const [proPlans, setProPlans] = useState([
    { id: 1, days: 30, price: 500000, name: 'یک ماهه' },
    { id: 2, days: 90, price: 1400000, name: 'سه ماهه' },
    { id: 3, days: 365, price: 5000000, name: 'سالانه' }
  ]);
  const [newPlan, setNewPlan] = useState({ name: '', days: '', price: '' });

  const handleAutoFill = () => {
    // Mock user numeric ID
    setAdminId('123456789');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botToken || !adminId) {
      setStatus('error');
      setStatusMessage('لطفا تمام فیلدها را پر کنید.');
      return;
    }
    setStatus('checking');
    setStatusMessage('در حال اتصال به سرور تلگرام و بررسی توکن...');
    
    setTimeout(() => {
      setStatus('success');
      setStatusMessage('ربات با موفقیت فعال شد و به آیدی عددی شما متصل گردید.');
    }, 2000);
  };

  const handlePurchase = (plan: any) => {
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      setIsPro(true);
      setProDaysLeft(plan.days);
      alert('ربات پرو با موفقیت خریداری شد.');
    }, 1500);
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.days || !newPlan.price) return;
    setProPlans([
      ...proPlans,
      {
        id: Date.now(),
        name: newPlan.name,
        days: parseInt(newPlan.days),
        price: parseInt(newPlan.price)
      }
    ]);
    setNewPlan({ name: '', days: '', price: '' });
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-4">
        <button 
          onClick={() => setActiveTab('basic')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${activeTab === 'basic' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          تنظیمات پایه
        </button>
        <button 
          onClick={() => setActiveTab('pro')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${activeTab === 'pro' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-amber-400 hover:bg-amber-500/10'}`}
        >
          <Crown size={14} /> ربات پرو
        </button>
        <button 
          onClick={() => setActiveTab('pro_plans')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${activeTab === 'pro_plans' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10'}`}
        >
          <Shield size={14} /> مدیریت پلن‌ها
        </button>
      </div>

      {activeTab === 'basic' && (
        <form className="glass p-5 space-y-5 animate-in fade-in duration-300" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm text-gray-300 font-medium">توکن ربات (Bot Token)</label>
            <input 
              type="text" 
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left"
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-300 font-medium">آیدی عددی ادمین (Numeric ID)</label>
              <button 
                type="button" 
                onClick={handleAutoFill}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <User size={14} />
                استفاده از اکانت فعلی
              </button>
            </div>
            <input 
              type="text" 
              inputMode="numeric"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left"
              placeholder="مثلا: 123456789"
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'checking'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {status === 'checking' ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            ثبت و بررسی ربات
          </button>

          {status !== 'idle' && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              status === 'checking' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
              status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
              'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {status === 'checking' && <Loader2 size={20} className="animate-spin shrink-0" />}
              {status === 'success' && <CheckCircle2 size={20} className="shrink-0" />}
              {status === 'error' && <AlertCircle size={20} className="shrink-0" />}
              <div>
                <p className="text-sm font-medium">وضعیت ربات:</p>
                <p className="text-xs mt-1 opacity-90 leading-relaxed">{statusMessage}</p>
              </div>
            </div>
          )}
        </form>
      )}

      {activeTab === 'pro' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Pro Status */}
          <div className={`glass p-5 flex flex-col items-center justify-center text-center space-y-3 ${isPro ? 'border border-amber-500/30 bg-amber-500/5' : ''}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isPro ? 'bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-gray-500/20 text-gray-400'}`}>
              <Crown size={32} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isPro ? 'text-amber-400' : 'text-gray-300'}`}>
                {isPro ? 'ربات شما پرو است' : 'شما کاربر عادی هستید'}
              </h2>
              {isPro ? (
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-300">
                  <Clock size={16} className="text-amber-400" />
                  <span>اعتبار باقی‌مانده: <span className="font-bold text-amber-400">{proDaysLeft} روز</span></span>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2 max-w-[250px] mx-auto">
                  با ارتقا به نسخه پرو به امکانات مدیریتی پیشرفته دسترسی پیدا کنید.
                </p>
              )}
            </div>
          </div>

          {/* Pro Features */}
          <div className="glass p-5">
            <h3 className="text-sm font-bold text-gray-200 mb-4">امکانات نسخه پرو:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">قابلیت خاموش کردن محصولات رییس و ربات‌های بالاسری برای کاربران خودتان</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">اضافه کردن پنل خدمات اختصاصی خودتان (مشابه مرزنشین و کانفیگ‌های شخصی)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">شخصی‌سازی کامل منوها و پاسخ‌های ربات</span>
              </li>
            </ul>
          </div>

          {/* Purchase Plans */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-200 px-1">خرید اشتراک پرو:</h3>
            {proPlans.map(plan => (
              <div key={plan.id} className="glass p-4 flex items-center justify-between border border-white/5 hover:border-amber-500/20 transition-colors group">
                <div>
                  <h4 className="font-bold text-gray-200">{plan.name}</h4>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} /> {plan.days} روز اعتبار
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-bold text-amber-400">{plan.price.toLocaleString('fa-IR')} تومان</span>
                  <button 
                    onClick={() => handlePurchase(plan)}
                    disabled={isPurchasing}
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isPurchasing ? 'در حال خرید...' : 'خرید اشتراک'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pro_plans' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="glass p-5 border border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-purple-400" />
              <h2 className="text-sm font-bold text-purple-400">مخصوص مدیر کل سیستم</h2>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              در این بخش می‌توانید پلن‌های خرید ربات پرو را برای نمایندگان خود تعریف کنید. هزینه خرید این پلن‌ها مستقیما به حساب شما واریز می‌شود.
            </p>
          </div>

          <form onSubmit={handleAddPlan} className="glass p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-200 mb-3">افزودن پلن جدید</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">نام پلن</label>
                <input 
                  type="text" 
                  value={newPlan.name}
                  onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                  placeholder="مثلا: شش ماهه"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">تعداد روز</label>
                <input 
                  type="number" 
                  value={newPlan.days}
                  onChange={e => setNewPlan({...newPlan, days: e.target.value})}
                  placeholder="180"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors text-left dir-ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">قیمت (تومان)</label>
              <input 
                type="number" 
                value={newPlan.price}
                onChange={e => setNewPlan({...newPlan, price: e.target.value})}
                placeholder="2000000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors text-left dir-ltr"
              />
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <PlusCircle size={16} /> ایجاد پلن
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-200 px-1">پلن‌های فعلی:</h3>
            {proPlans.map(plan => (
              <div key={plan.id} className="glass p-3 flex items-center justify-between border border-white/5">
                <div>
                  <h4 className="font-medium text-sm text-gray-200">{plan.name}</h4>
                  <div className="text-xs text-gray-400 mt-0.5 flex gap-3">
                    <span>{plan.days} روز</span>
                    <span>{plan.price.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>
                <button 
                  onClick={() => setProPlans(proPlans.filter(p => p.id !== plan.id))}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
