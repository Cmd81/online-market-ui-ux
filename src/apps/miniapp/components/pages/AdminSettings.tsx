import React, { useState } from 'react';
import { Settings, PlusCircle, CreditCard, Trash2, ChevronRight, Save, Gift, Users, Edit2, Smartphone, MessageSquare, QrCode, Copy, Megaphone, Check } from 'lucide-react';
import { mockPaymentCards } from '../../data';
import { PaymentCard, ResellerLevel } from '../../types';
import { AdminBot } from './AdminBot';

export type AdminPermKey = 'settings' | 'panels' | 'tickets' | 'transactions' | 'profit' | 'users';
export interface AdminUser {
  id: string;
  permissions: Record<AdminPermKey, boolean>;
}

export const ADMIN_MENUS: { key: AdminPermKey, label: string }[] = [
  { key: 'settings', label: 'تنظیمات' },
  { key: 'panels', label: 'سرویس‌ها' },
  { key: 'tickets', label: 'تیکت' },
  { key: 'transactions', label: 'تراکنش' },
  { key: 'profit', label: 'سود' },
  { key: 'users', label: 'کاربران' },
];

export function AdminSettings({ resellerLevels, setResellerLevels }: { resellerLevels: ResellerLevel[], setResellerLevels: (levels: ResellerLevel[]) => void }) {
  const [activeTab, setActiveTab] = useState<'main' | 'payments' | 'lottery' | 'roles' | 'reseller_levels' | 'bot' | 'force_join'>('main');

  // Payments State
  const [paymentTab, setPaymentTab] = useState<'card' | 'plisio' | 'sms_verify'>('card');
  const [plisioSettings, setPlisioSettings] = useState({
    apiKey: '',
    address: '',
    isActive: false
  });
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>(mockPaymentCards);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ cardNumber: '', ownerName: '', bankName: '' });
  const [smsAutoVerify, setSmsAutoVerify] = useState({ isActive: false, apiUrl: 'https://api.example.com/verify-sms', secretKey: '' });
  const [unmatchedSms, setUnmatchedSms] = useState([
    { id: '1', sender: 'BankMelli', text: 'انتقال وجه 1,000,000 ریال\nموجودی: ...', date: '1402/10/12 14:30' },
    { id: '2', sender: 'BankSaderat', text: 'واریز 5,000,000 ریال\nموجودی: ...', date: '1402/10/12 15:45' }
  ]);

  // Force Join State
  const [forceJoinChannels, setForceJoinChannels] = useState([
    { id: '1', name: 'کانال اطلاع رسانی', link: '@mychannel' }
  ]);
  const [newChannel, setNewChannel] = useState({ name: '', link: '' });

  // Lottery State
  const [lotterySettings, setLotterySettings] = useState({
    isActive: false,
    prizeAmount: '50000',
    winnerCount: '3',
    timeHours: '24'
  });
  const [savedLotterySettings, setSavedLotterySettings] = useState(lotterySettings);

  // Admin Access State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 'u123',
      permissions: { settings: true, panels: true, tickets: true, transactions: true, profit: true, users: true }
    }
  ]);
  const [newAdminId, setNewAdminId] = useState('');

  

  const [deleteLevelConfirm, setDeleteLevelConfirm] = useState<{id: string, name: string} | null>(null);
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [editLevelName, setEditLevelName] = useState('');
  const [newLevelName, setNewLevelName] = useState('');

  const handleAddLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLevelName) {
      const nextLevelNumber = resellerLevels.length > 0 ? Math.max(...resellerLevels.map(l => l.levelNumber)) + 1 : 1;
      setResellerLevels([...resellerLevels, { id: 'l' + Date.now(), name: newLevelName, userCount: 0, levelNumber: nextLevelNumber }]);
      setNewLevelName('');
    }
  };

  const handleEditLevel = (id: string, name: string) => {
    setEditingLevelId(id);
    setEditLevelName(name);
  };

  const handleSaveLevel = (id: string) => {
    if (editLevelName.trim()) {
      setResellerLevels(resellerLevels.map(l => l.id === id ? { ...l, name: editLevelName.trim() } : l));
    }
    setEditingLevelId(null);
  };

  const confirmDeleteLevel = (id: string, name: string) => {
    setDeleteLevelConfirm({ id, name });
  };

  const executeDeleteLevel = () => {
    if (deleteLevelConfirm) {
      setResellerLevels(resellerLevels.filter(l => l.id !== deleteLevelConfirm.id || l.isFixed));
      setDeleteLevelConfirm(null);
    }
  };

  const toggleCardStatus = (id: string) => {
    setPaymentCards(paymentCards.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.cardNumber || !newCard.ownerName || !newCard.bankName) return;
    
    const card: PaymentCard = {
      id: `card_${Date.now()}`,
      cardNumber: newCard.cardNumber.replace(/\D/g, ''),
      ownerName: newCard.ownerName,
      bankName: newCard.bankName,
      isActive: true
    };
    
    setPaymentCards([...paymentCards, card]);
    setShowAddCard(false);
    setNewCard({ cardNumber: '', ownerName: '', bankName: '' });
  };

  const handleDeleteCard = (id: string) => {
    setPaymentCards(paymentCards.filter(c => c.id !== id));
  };

  const handleSaveLottery = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedLotterySettings(lotterySettings);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminId && !adminUsers.find(a => a.id === newAdminId)) {
      setAdminUsers([...adminUsers, {
        id: newAdminId,
        permissions: { settings: false, panels: false, tickets: false, transactions: false, profit: false, users: false }
      }]);
      setNewAdminId('');
    }
  };

  const handleRemoveAdmin = (id: string) => {
    setAdminUsers(adminUsers.filter(a => a.id !== id));
  };

  const toggleAdminPermission = (adminId: string, permKey: AdminPermKey) => {
    setAdminUsers(adminUsers.map(a => 
      a.id === adminId 
        ? { ...a, permissions: { ...a.permissions, [permKey]: !a.permissions[permKey] } }
        : a
    ));
  };

  if (activeTab === 'payments') {
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button onClick={() => setActiveTab('main')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">تنظیمات درگاه پرداخت</h1>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl mb-4">
          <button 
            onClick={() => setPaymentTab('card')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${paymentTab === 'card' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            کارت بانکی
          </button>
          <button 
            onClick={() => setPaymentTab('plisio')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${paymentTab === 'plisio' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Plisio
          </button>
          <button 
            onClick={() => setPaymentTab('sms_verify')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${paymentTab === 'sms_verify' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            پیامک
          </button>
        </div>

        {paymentTab === 'card' && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-base font-semibold text-gray-200">کارت‌های بانکی</h2>
              <button 
                onClick={() => setShowAddCard(!showAddCard)}
                className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300"
              >
                <PlusCircle size={14} /> افزودن کارت
              </button>
            </div>

            {showAddCard && (
              <form onSubmit={handleAddCard} className="glass p-4 mb-4 space-y-3">
                <input 
                  type="text" 
                  placeholder="شماره کارت (۱۶ رقم)"
                  value={newCard.cardNumber}
                  onChange={e => setNewCard({...newCard, cardNumber: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right"
                  maxLength={16}
                />
                <input 
                  type="text" 
                  placeholder="نام صاحب حساب"
                  value={newCard.ownerName}
                  onChange={e => setNewCard({...newCard, ownerName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="نام بانک (مثال: ملی)"
                  value={newCard.bankName}
                  onChange={e => setNewCard({...newCard, bankName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium transition-colors">
                    ذخیره کارت
                  </button>
                  <button type="button" onClick={() => setShowAddCard(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-medium transition-colors">
                    انصراف
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {paymentCards.map((card) => (
                <div key={card.id} className={`glass p-4 border ${card.isActive ? 'border-green-500/50' : 'border-white/10'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm dir-ltr tracking-widest">{card.cardNumber.match(/.{1,4}/g)?.join(' ')}</h3>
                        <div className="text-xs text-gray-400 mt-0.5">{card.ownerName} - بانک {card.bankName}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleCardStatus(card.id)} className={`px-2 py-1 text-[10px] rounded-lg transition-colors ${card.isActive ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                        {card.isActive ? 'فعال' : 'غیرفعال'}
                      </button>
                      <button onClick={() => handleDeleteCard(card.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {paymentCards.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm glass">
                  هیچ کارتی یافت نشد
                </div>
              )}
            </div>
          </>
        )}

        {paymentTab === 'plisio' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-base font-semibold text-gray-200">تنظیمات درگاه Plisio</h2>
              <button 
                onClick={() => setPlisioSettings({...plisioSettings, isActive: !plisioSettings.isActive})} 
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${plisioSettings.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
              >
                {plisioSettings.isActive ? 'درگاه فعال است' : 'درگاه غیرفعال است'}
              </button>
            </div>
            
            <form className="glass p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); alert('تنظیمات با موفقیت ذخیره شد'); }}>
              <div>
                <label className="block text-xs text-gray-400 mb-1">API Key</label>
                <input 
                  type="text" 
                  value={plisioSettings.apiKey} 
                  onChange={(e) => setPlisioSettings({...plisioSettings, apiKey: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr" 
                  placeholder="کلید API درگاه Plisio" 
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">آدرس وب‌سایت (Callback URL)</label>
                <input 
                  type="url" 
                  value={plisioSettings.address} 
                  onChange={(e) => setPlisioSettings({...plisioSettings, address: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr" 
                  placeholder="https://example.com/api/callback" 
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-4">
                <Save size={18} />
                ذخیره تنظیمات Plisio
              </button>
            </form>
          </div>
        )}

        {paymentTab === 'sms_verify' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h2 className="text-base font-semibold text-gray-200">اتصال ربات پیامک</h2>
                <p className="text-xs text-gray-400 mt-1">تایید خودکار پرداختی‌ها از طریق پیامک بانکی</p>
              </div>
            </div>

            <div className="glass p-5 space-y-4">
              <div className="flex justify-center mb-6 mt-2">
                <div className="p-4 bg-white rounded-xl">
                  <QrCode size={120} className="text-black" />
                </div>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed text-center mb-6">
                📲 با اسکن QR کد بالا در گوشی یا با کپی کد زیر و مراجعه به بخش Settings &gt; سه نقطه بالای صفحه &gt; Import Remote from Clipboard می توانید تنظیمات را به طور خودکار ایمپورت کنید.
              </p>

              <div className="relative group">
                <textarea
                  readOnly
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-xs focus:outline-none transition-colors dir-ltr text-left text-gray-400 font-mono resize-none leading-relaxed"
                  value={'{"name":"DDBOT @vpnonlane_bot","url":"https://ddbot3.dee2vaneh.site/onlane_bot/sms.php?from=ibank","method":"POST","useFormData":true,"formDataParameters":[{"key":"sms","value":"{sms_body}"},{"key":"sender","value":"{sms_sender}"},{"key":"timestamp","value":"{sms_timestamp}"},{"key":"checksum","value":"{sms_checksum}"},{"key":"secret","value":"4123ae8f227646b5d70ed3870ae76d58"}]}'}
                />
                <button 
                  onClick={() => navigator.clipboard.writeText('{"name":"DDBOT @vpnonlane_bot","url":"https://ddbot3.dee2vaneh.site/onlane_bot/sms.php?from=ibank","method":"POST","useFormData":true,"formDataParameters":[{"key":"sms","value":"{sms_body}"},{"key":"sender","value":"{sms_sender}"},{"key":"timestamp","value":"{sms_timestamp}"},{"key":"checksum","value":"{sms_checksum}"},{"key":"secret","value":"4123ae8f227646b5d70ed3870ae76d58"}]}')}
                  className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="کپی تنظیمات"
                >
                  <Copy size={16} />
                </button>
              </div>

              <div className="h-[1px] bg-white/10 my-6"></div>

              <p className="text-sm text-gray-300 leading-relaxed text-center mb-6">
                📲 برای تنظیم دستی برنامه ابتدا ویدیو آموزشی را از پشتیبانی دریافت کرده و سپس این اطلاعات را در اپلیکیشن جایگذاری کنید:
              </p>

              <div className="space-y-3 font-mono text-sm text-left dir-ltr bg-black/20 p-4 rounded-xl border border-white/5">
                <div><span className="text-gray-500">Method:</span> <span className="text-blue-400 ml-2">POST</span></div>
                <div><span className="text-gray-500">Url:</span> <span className="text-green-400 break-all ml-2">https://ddbot3.dee2vaneh.site/onlane_bot/sms.php?from=ibank</span></div>
                <div className="pt-2"><span className="text-gray-500 block mb-2">Parameters:</span></div>
                <div className="pl-4 border-l-2 border-white/10 space-y-1">
                  <div><span className="text-gray-500">Key:</span> <span className="text-gray-300 ml-2">sms</span></div>
                  <div><span className="text-gray-500">Value:</span> <span className="text-gray-300 break-all ml-2">{'{sms_body}'} 4123ae8f227646b5d70ed3870ae76d58</span></div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-semibold text-gray-200">پیامک‌های مچ‌نشده</h2>
                {unmatchedSms.length > 0 && (
                  <button 
                    onClick={() => setUnmatchedSms([])}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    پاک کردن همه
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {unmatchedSms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm glass rounded-xl">
                    هیچ پیامک مچ‌نشده‌ای وجود ندارد
                  </div>
                ) : (
                  unmatchedSms.map((sms) => (
                    <div key={sms.id} className="glass p-4 rounded-xl border border-white/5 relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={14} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-200">{sms.sender}</span>
                        </div>
                        <span className="text-xs text-gray-500">{sms.date}</span>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-pre-line dir-rtl leading-relaxed">
                        {sms.text}
                      </p>
                      <button 
                        onClick={() => setUnmatchedSms(unmatchedSms.filter(s => s.id !== sms.id))}
                        className="absolute top-2 left-2 p-1.5 opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'lottery') {
    const isLotterySettingsDirty = JSON.stringify(lotterySettings) !== JSON.stringify(savedLotterySettings);
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button onClick={() => setActiveTab('main')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">تنظیمات قرعه‌کشی روزانه</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-semibold text-gray-200">وضعیت قرعه‌کشی</h2>
            <button 
              onClick={() => setLotterySettings({...lotterySettings, isActive: !lotterySettings.isActive})} 
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${lotterySettings.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
            >
              {lotterySettings.isActive ? 'فعال' : 'غیرفعال'}
            </button>
          </div>
          
          <form className="glass p-5 space-y-4" onSubmit={handleSaveLottery}>
            <div>
              <label className="block text-xs text-gray-400 mb-1">مبلغ جایزه (تومان)</label>
              <input 
                type="text" 
                value={lotterySettings.prizeAmount} 
                onChange={(e) => setLotterySettings({...lotterySettings, prizeAmount: e.target.value.replace(/\D/g, '')})} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">تعداد برندگان</label>
                <input 
                  type="number" 
                  value={lotterySettings.winnerCount} 
                  onChange={(e) => setLotterySettings({...lotterySettings, winnerCount: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right" 
                  min="1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">دوره زمانی (ساعت)</label>
                <input 
                  type="number" 
                  value={lotterySettings.timeHours} 
                  onChange={(e) => setLotterySettings({...lotterySettings, timeHours: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right" 
                  min="1"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!isLotterySettingsDirty}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Save size={18} />
              {isLotterySettingsDirty ? 'ذخیره تغییرات' : 'تغییری وجود ندارد'}
            </button>
          </form>
        </div>
      </div>
    );
  }

    if (activeTab === 'reseller_levels') {
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button onClick={() => setActiveTab('main')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">دسته‌بندی نمایندگان</h1>
        </div>

        <div className="glass p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-200">افزودن دسته‌بندی جدید</h2>
          <p className="text-xs text-gray-400">نام دسته‌بندی جدید (مثلا: نماینده طلایی، سطح یک و ...) را وارد کنید.</p>
          <form onSubmit={handleAddLevel} className="flex gap-2">
            <input 
              type="text" 
              value={newLevelName} 
              onChange={(e) => setNewLevelName(e.target.value)} 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="نام دسته نمایندگی" 
              required 
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl text-sm font-medium transition-colors">
              افزودن
            </button>
          </form>
        </div>

        <div className="space-y-3 mt-6">
          <h2 className="text-sm font-semibold text-gray-200 px-1">لیست دسته‌های نمایندگی</h2>
          {resellerLevels.map((level) => (
            <div key={level.id} className="glass p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Users size={20} />
                </div>
                {editingLevelId === level.id ? (
                  <div className="flex flex-col gap-1">
                    <input 
                      type="text" 
                      value={editLevelName} 
                      onChange={(e) => setEditLevelName(e.target.value)} 
                      className="bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-medium">{level.name} <span className="text-xs text-gray-500 font-normal mr-2">سطح {level.levelNumber}</span></div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {level.isFixed ? 'دسته پیش‌فرض و ثابت • ' : ''}
                      {level.userCount || 0} نماینده
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {editingLevelId === level.id ? (
                  <button onClick={() => handleSaveLevel(level.id)} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors" title="ذخیره">
                    <Save size={14} />
                  </button>
                ) : (
                  <button onClick={() => handleEditLevel(level.id, level.name)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors" title="ویرایش">
                    <Edit2 size={14} />
                  </button>
                )}
                {!level.isFixed && (
                  <button onClick={() => confirmDeleteLevel(level.id, level.name)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="حذف">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        
        {deleteLevelConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1a1c23] border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-100">حذف دسته‌بندی</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                آیا از حذف دسته‌ی <span className="font-bold text-white">{deleteLevelConfirm.name}</span> اطمینان دارید؟
                <br /><br />
                <span className="text-xs text-yellow-500">
                  توجه: نمایندگان داخل این گروه، به صورت خودکار به گروه پایین‌تر منتقل خواهند شد.
                </span>
              </p>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setDeleteLevelConfirm(null)} 
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
                >
                  انصراف
                </button>
                <button 
                  onClick={executeDeleteLevel} 
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                >
                  تایید و حذف
                </button>
              </div>
            </div>
          </div>
        )}
</div>
      </div>
    );
  }

  if (activeTab === 'roles') {
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button onClick={() => setActiveTab('main')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">مدیریت دسترسی ادمین‌ها</h1>
        </div>

        <div className="glass p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-200">افزودن ادمین جدید</h2>
          <p className="text-xs text-gray-400">با وارد کردن آیدی کاربری، یک ادمین جدید برای ربات تعریف کنید.</p>
          <form onSubmit={handleAddAdmin} className="flex gap-2">
            <input 
              type="text" 
              value={newAdminId}
              onChange={(e) => setNewAdminId(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right"
              placeholder="آیدی کاربر (مثال: u123)"
              required
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl text-sm font-medium transition-colors">
              افزودن
            </button>
          </form>
        </div>

        <div className="space-y-4 mt-6">
          <h2 className="text-sm font-semibold text-gray-200 px-1">لیست ادمین‌ها و دسترسی‌ها</h2>
          {adminUsers.map((admin) => (
            <div key={admin.id} className="glass p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">ادمین</div>
                    <div className="text-xs text-gray-400 dir-ltr text-right">{admin.id}</div>
                  </div>
                </div>
                <button onClick={() => handleRemoveAdmin(admin.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {ADMIN_MENUS.map(menu => {
                  const hasPerm = admin.permissions[menu.key];
                  return (
                    <label key={menu.key} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${hasPerm ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}>
                        {hasPerm && <Check size={12} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={hasPerm}
                        onChange={() => toggleAdminPermission(admin.id, menu.key)}
                      />
                      <span className="text-xs text-gray-300">{menu.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          {adminUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm glass">
              هیچ ادمینی ثبت نشده است
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'force_join') {
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button onClick={() => setActiveTab('main')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">جوین اجباری</h1>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (newChannel.name && newChannel.link) {
              setForceJoinChannels([...forceJoinChannels, { ...newChannel, id: Date.now().toString() }]);
              setNewChannel({ name: '', link: '' });
            }
          }}
          className="glass p-4 mb-4 space-y-3"
        >
          <input 
            type="text" 
            placeholder="نام کانال (مثلا: کانال اصلی)"
            value={newChannel.name}
            onChange={e => setNewChannel({...newChannel, name: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <input 
            type="text" 
            placeholder="لینک کانال (با @ یا https://)"
            value={newChannel.link}
            onChange={e => setNewChannel({...newChannel, link: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium transition-colors">
            افزودن کانال
          </button>
        </form>

        <div className="space-y-3">
          {forceJoinChannels.map((channel) => (
            <div key={channel.id} className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-200">{channel.name}</h3>
                <p className="text-xs text-gray-400 mt-1 dir-ltr text-right">{channel.link}</p>
              </div>
              <button 
                onClick={() => setForceJoinChannels(forceJoinChannels.filter(c => c.id !== channel.id))}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                title="حذف کانال"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {forceJoinChannels.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm glass rounded-xl">
              هیچ کانالی برای جوین اجباری ثبت نشده است
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'bot') {
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button onClick={() => setActiveTab('main')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">تنظیمات ربات</h1>
        </div>
        <AdminBot />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <h1 className="text-2xl font-bold text-center mt-2 mb-6">تنظیمات</h1>

      <div>
        <h2 className="text-base font-semibold mb-3 px-1 text-gray-200">تنظیمات اصلی</h2>
        <div className="glass overflow-hidden">
          <button onClick={() => setActiveTab('payments')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-gray-400" />
              <span className="text-sm font-medium">تنظیمات درگاه پرداخت</span>
            </div>
            <ChevronRight size={18} className="text-gray-600 rotate-180" />
          </button>
          
          <div className="h-[1px] bg-white/5 mx-4"></div>
          
          <button onClick={() => setActiveTab('lottery')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Gift size={18} className="text-gray-400" />
              <span className="text-sm font-medium">تنظیمات قرعه‌کشی روزانه</span>
            </div>
            <ChevronRight size={18} className="text-gray-600 rotate-180" />
          </button>
          
          <div className="h-[1px] bg-white/5 mx-4"></div>

          <button onClick={() => setActiveTab('bot')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-gray-400" />
              <span className="text-sm font-medium">تنظیمات ربات تلگرام اختصاصی</span>
            </div>
            <ChevronRight size={18} className="text-gray-600 rotate-180" />
          </button>
          
          <div className="h-[1px] bg-white/5 mx-4"></div>
          
          <button onClick={() => setActiveTab('reseller_levels')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-gray-400" />
              <span className="text-sm font-medium">دسته‌بندی نمایندگان</span>
            </div>
            <ChevronRight size={18} className="text-gray-600 rotate-180" />
          </button>
          
          <div className="h-[1px] bg-white/5 mx-4"></div>

          <button onClick={() => setActiveTab('force_join')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Megaphone size={18} className="text-gray-400" />
              <span className="text-sm font-medium">جوین اجباری</span>
            </div>
            <ChevronRight size={18} className="text-gray-600 rotate-180" />
          </button>
          <div className="h-[1px] bg-white/5 mx-4"></div>

          <button onClick={() => setActiveTab('roles')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-gray-400" />
              <span className="text-sm font-medium">مدیریت دسترسی ادمین‌ها</span>
            </div>
            <ChevronRight size={18} className="text-gray-600 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
