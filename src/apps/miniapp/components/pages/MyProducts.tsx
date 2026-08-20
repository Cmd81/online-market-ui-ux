import React, { useState, useEffect } from 'react';
import { userProducts, categories } from '../../data';
import { Package, Clock, ShieldCheck, AlertCircle, Copy, CheckCircle2, ChevronRight, Link2, Key, User, QrCode, ExternalLink, Pause, Play, Trash2, Shield, MessageCircle, Bot, Server, Phone, Lock, Search, X } from 'lucide-react';
import { UserProduct } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { useDragScroll } from '../../hooks/useDragScroll';

const iconMap: Record<string, React.ElementType> = {
  Shield, MessageCircle, Bot, Server, Phone, Lock
};

export function MyProducts() {
  const initialCategory = sessionStorage.getItem('shopCategory') || categories[0]?.id || '1';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  useEffect(() => {
    sessionStorage.removeItem('shopCategory');
    if (initialCategory) {
      setTimeout(() => {
        const element = document.getElementById(`my-category-${initialCategory}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 100);
    }
  }, [initialCategory]);

  const categoriesScroll = useDragScroll();

  const handleCategoryClick = (categoryId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveCategory(categoryId);
    const element = e.currentTarget;
    const container = element.parentElement;
    if (container) {
      const scrollLeft = element.offsetLeft - (container.offsetWidth / 2) + (element.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredProducts = userProducts.filter(p => {
    const matchesCategory = p.categoryId === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchLower) || 
      (p.configName && p.configName.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });
  
  const [productsList, setProductsList] = useState(filteredProducts);
  
  useEffect(() => {
    setProductsList(filteredProducts);
  }, [activeCategory, searchQuery, userProducts]);

  const [selectedPanel, setSelectedPanel] = useState<UserProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [showChangeCredsModal, setShowChangeCredsModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [qrTitle, setQrTitle] = useState('');

  const openQRModal = (value: string, title: string) => {
    setQrValue(value);
    setQrTitle(title);
    setShowQRModal(true);
  };

  const openChangeCredsModal = () => {
    if (selectedPanel) {
      setNewUsername(selectedPanel.username || '');
      setNewPassword(selectedPanel.password || '');
      setShowChangeCredsModal(true);
    }
  };

  const handleUpdateCreds = () => {
    if (selectedPanel) {
      const index = userProducts.findIndex(p => p.id === selectedPanel.id);
      if (index > -1) {
        userProducts[index].username = newUsername;
        userProducts[index].password = newPassword;
        setProductsList([...userProducts]);
        setSelectedPanel({ ...userProducts[index] });
      }
      setShowChangeCredsModal(false);
    }
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const index = userProducts.findIndex(p => p.id === productToDelete);
      if (index > -1) {
        userProducts.splice(index, 1);
        setProductsList([...userProducts]);
        if (selectedPanel?.id === productToDelete) {
          setSelectedPanel(null);
        }
      }
      setProductToDelete(null);
    }
  };

  const handleToggleStatus = (id: string) => {
    const index = userProducts.findIndex(p => p.id === id);
    if (index > -1) {
      const product = userProducts[index];
      product.status = product.status === 'active' ? 'paused' : 'active';
      setProductsList([...userProducts]);
      if (selectedPanel?.id === id) {
        setSelectedPanel({...product});
      }
    }
  };

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (selectedPanel) {
    const isPaused = selectedPanel.status === 'paused';
    const isActive = selectedPanel.status === 'active';
    const isExpired = selectedPanel.status === 'expired';

    let statusBg = 'bg-red-500/10 text-red-500';
    if (isActive) statusBg = 'bg-green-500/10 text-green-500';
    if (isPaused) statusBg = 'bg-yellow-500/10 text-yellow-500';

    let statusText = 'منقضی شده';
    let statusTextColor = 'text-red-400';
    if (isActive) { statusText = 'فعال'; statusTextColor = 'text-green-400'; }
    if (isPaused) { statusText = 'متوقف شده'; statusTextColor = 'text-yellow-400'; }

    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
        <div className="flex items-center justify-between mt-2 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedPanel(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronRight size={24} className="text-gray-400" />
            </button>
            <h1 className="text-xl font-bold">اطلاعات سرویس</h1>
          </div>
        </div>
        
        {/* Block 1: Config Info */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${statusBg}`}>
              <Package size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">{selectedPanel.name}</h2>
              <span className={`text-sm font-medium ${statusTextColor}`}>{statusText}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">نام کانفیگ</span>
              <span className="text-sm font-medium text-gray-200">{selectedPanel.configName || '-'}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">زمان باقی‌مانده</span>
              <span className="text-sm font-medium text-gray-200">{selectedPanel.expiryDate || 'نامحدود'}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">حجم مصرفی / کل</span>
              <span className="text-sm font-medium text-gray-200 dir-ltr text-right block">{selectedPanel.usageCurrent || '0'} / {selectedPanel.usageLimit || 'نامحدود'}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">بسته رزرو</span>
              <span className="text-sm font-medium text-gray-400">ندارید</span>
            </div>
          </div>
        </div>

        {/* Block 2: Operations */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3 mt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">عملیات‌ها</h3>
          <div className="grid grid-cols-2 gap-2">
            {!isExpired && (
              <button 
                onClick={() => handleToggleStatus(selectedPanel.id)} 
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${isPaused ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'}`}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                {isPaused ? 'فعال‌سازی' : 'توقف موقت'}
              </button>
            )}
            
            <button 
              onClick={() => console.log('Renew', selectedPanel.id)}
              className={`flex items-center justify-center gap-2 py-2.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-sm font-medium transition-colors ${!isExpired ? '' : 'col-span-2'}`}
            >
              <Package size={16} />
              تمدید سرویس
            </button>
            
            <button 
              onClick={() => console.log('Change Link', selectedPanel.id)}
              className="flex items-center justify-center gap-2 py-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors"
            >
              <Link2 size={16} />
              تغییر لینک
            </button>

            <button 
              onClick={() => setProductToDelete(selectedPanel.id)} 
              className="flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              حذف سرویس
            </button>
          </div>
        </div>
        
        {/* Block 3: Connections */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <div className="space-y-3">
            {selectedPanel.configLink ? (
              <>
                <div className="bg-white/5 p-4 rounded-xl border border-blue-500/30 flex flex-col gap-3 mb-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-xl rounded-full translate-x-10 -translate-y-10"></div>
                  
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <Link2 size={16} className="text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-blue-100">لینک سابسکریپشن (توصیه شده)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col text-left bg-black/20 p-2.5 rounded-lg border border-white/5 z-10">
                    <span className="text-sm font-medium dir-ltr truncate w-full text-gray-300">{selectedPanel.configLink}</span>
                  </div>
                  
                  <div className="flex gap-2 z-10 mt-1">
                    <button 
                      onClick={() => handleCopy(selectedPanel.configLink || '', 'config')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      {copiedField === 'config' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      {copiedField === 'config' ? 'کپی شد' : 'کپی سابسکریپشن'}
                    </button>
                    <button 
                      onClick={() => openQRModal(selectedPanel.configLink || '', 'بارکد سابسکریپشن')}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center shrink-0 text-white"
                      title="نمایش بارکد"
                    >
                      <QrCode size={20} />
                    </button>
                  </div>
                </div>

                {/* Mock single configs inside sub */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Server size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">کانفیگ‌های تکی</span>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: '🇩🇪 Germany Auto', link: selectedPanel.configLink?.replace('mock-link', 'germany-1') || 'vless://mock1' },
                      { name: '🇳🇱 Netherlands Premium', link: selectedPanel.configLink?.replace('mock-link', 'netherlands-1') || 'vless://mock2' }
                    ].map((config, idx) => (
                      <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="flex flex-col text-right">
                            <span className="text-sm font-medium text-gray-200">{config.name}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button 
                            onClick={() => handleCopy(config.link, `single_config_${idx}`)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="کپی کانفیگ"
                          >
                            {copiedField === `single_config_${idx}` ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                          </button>
                          <button 
                            onClick={() => openQRModal(config.link, config.name)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="نمایش بارکد"
                          >
                            <QrCode size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Copy size={18} className="text-gray-400 shrink-0" />
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-medium text-gray-300">کپی همه کانفیگ‌ها</span>
                      <span className="text-[10px] text-orange-400 font-medium">توجه: این روش قابلیت آپدیت خودکار ندارد</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(selectedPanel.configLink || '', 'all_configs')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                  >
                    {copiedField === 'all_configs' ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Link2 size={18} className="text-gray-400 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-gray-500 text-right">آدرس پنل</span>
                      <a 
                        href={selectedPanel.panelUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium dir-ltr truncate w-full hover:text-purple-400 transition-colors"
                      >
                        {selectedPanel.panelUrl || '-'}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <a 
                      href={selectedPanel.panelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
                      title="باز کردن در صفحه جدید"
                    >
                      <ExternalLink size={16} className="text-gray-400" />
                    </a>
                    <button 
                      onClick={() => handleCopy(selectedPanel.panelUrl || '', 'url')}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="کپی لینک"
                    >
                      {copiedField === 'url' ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-400 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-gray-500 text-right">نام کاربری</span>
                      <span className="text-sm font-medium dir-ltr">{selectedPanel.username || '-'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(selectedPanel.username || '', 'user')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                  >
                    {copiedField === 'user' ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                  </button>
                </div>
                
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key size={18} className="text-gray-400 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-gray-500 text-right">رمز عبور</span>
                      <span className="text-sm font-medium dir-ltr">{selectedPanel.password || '-'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(selectedPanel.password || '', 'pass')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                  >
                    {copiedField === 'pass' ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                  </button>
                </div>
                
                <button 
                  onClick={openChangeCredsModal}
                  className="w-full mt-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-medium transition-colors border border-white/5 flex items-center justify-center gap-2"
                >
                  <Key size={16} />
                  تغییر نام کاربری و رمز عبور
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Change Credentials Modal */}
        {showChangeCredsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                  <Key size={32} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">تغییر اطلاعات ورود</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  نام کاربری و رمز عبور جدید را وارد کنید.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 block text-right">نام کاربری جدید</label>
                  <input 
                    type="text" 
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-left dir-ltr focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 block text-right">رمز عبور جدید</label>
                  <input 
                    type="text" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-left dir-ltr focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowChangeCredsModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                >
                  لغو
                </button>
                <button 
                  onClick={handleUpdateCreds}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                  <Trash2 size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold">حذف کانفیگ</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  آیا از حذف این سرویس اطمینان دارید؟ این عمل غیرقابل بازگشت است و کانفیگ برای همیشه پاک خواهد شد.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                >
                  لغو
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  حذف کانفیگ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mt-2 mb-6 h-10 w-full relative">
        <h1 className={`text-2xl font-bold absolute right-0 transition-all duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>سرویس‌های من</h1>
        
        {/* Search Toggle */}
        <div className={`flex items-center transition-all duration-300 h-full ${isSearchOpen ? 'w-full' : 'w-auto mr-auto absolute left-0'}`}>
          {isSearchOpen ? (
            <div className="flex items-center w-full h-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 animate-in fade-in slide-in-from-left-4">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="جستجوی سرویس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white px-3 py-1 w-full"
                autoFocus
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1 hover:bg-white/10 rounded-lg shrink-0">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors shrink-0"
            >
              <Search size={18} className="text-gray-300" />
            </button>
          )}
        </div>
      </div>
      
      {/* Categories Scroll */}
      <div 
        ref={categoriesScroll.scrollRef}
        {...categoriesScroll.events}
        className={`flex overflow-x-auto gap-3 pb-3 -mx-4 px-4 scroll-smooth shop-scrollbar select-none snap-x ${categoriesScroll.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {categories.map(cat => {
          const Icon = iconMap[cat.icon] || Shield;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`my-category-${cat.id}`}
              onClick={(e) => handleCategoryClick(cat.id, e)}
              className={`shrink-0 snap-center flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                  : 'glass-card text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {productsList.map(product => {
          const isPaused = product.status === 'paused';
          const isActive = product.status === 'active';
          const isExpired = product.status === 'expired';

          let statusBg = 'bg-red-500/10 text-red-500';
          if (isActive) statusBg = 'bg-green-500/10 text-green-500';
          if (isPaused) statusBg = 'bg-yellow-500/10 text-yellow-500';

          let statusBadge = 'bg-red-500/20 text-red-400';
          let statusText = 'منقضی شده';
          if (isActive) { statusBadge = 'bg-green-500/20 text-green-400'; statusText = 'فعال'; }
          if (isPaused) { statusBadge = 'bg-yellow-500/20 text-yellow-400'; statusText = 'متوقف شده'; }

          let borderColor = 'border-red-500';
          if (isActive) borderColor = 'border-green-500';
          if (isPaused) borderColor = 'border-yellow-500';
          
          return (
            <div key={product.id} className="glass-card overflow-hidden">
              <div className={`p-3 border-l-4 ${borderColor}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusBg}`}>
                      <Package size={16} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{product.name}</h3>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${statusBadge}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`bg-gray-900/50 rounded-lg p-2 mt-2 grid gap-1 ${(product.configName || (product.username && !product.configLink)) ? 'grid-cols-3' : (product.usageLimit ? 'grid-cols-2' : 'grid-cols-1')}`}>
                  {product.configName && (
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] text-gray-500 mb-0.5">نام کانفیگ</span>
                      <span className="text-xs font-medium truncate" title={product.configName}>{product.configName}</span>
                    </div>
                  )}
                  {(!product.configName && product.username && !product.configLink) && (
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] text-gray-500 mb-0.5">نام کاربری</span>
                      <span className="text-xs font-medium truncate" title={product.username}>{product.username}</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 mb-0.5 flex items-center gap-1"><Clock size={10} /> انقضا</span>
                    <span className="text-xs font-medium">{product.expiryDate || 'نامشخص'}</span>
                  </div>
                  {product.usageLimit && (
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 mb-0.5">مصرف</span>
                      <span className="text-xs font-medium">{product.usageCurrent}</span>
                    </div>
                  )}
                </div>

                {isExpired && (
                  <button 
                    onClick={() => console.log('Renew', product.id)}
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    تمدید سرویس
                  </button>
                )}
                {(isActive || isPaused) && (
                  <button 
                    onClick={() => setSelectedPanel(product)}
                    className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg text-xs font-medium transition-colors border border-white/5"
                  >
                    {product.configLink ? 'مدیریت کانفیگ' : 'مدیریت پنل'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {productsList.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm flex flex-col items-center gap-3">
            <AlertCircle size={40} className="opacity-20" />
            شما هنوز سرویسی خریداری نکرده‌اید.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold">حذف کانفیگ</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                آیا از حذف این سرویس اطمینان دارید؟ این عمل غیرقابل بازگشت است و کانفیگ برای همیشه پاک خواهد شد.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
              >
                لغو
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                حذف کانفیگ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">{qrTitle}</h3>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <QRCodeSVG value={qrValue} size={200} level="M" />
            </div>
            <button 
              onClick={() => setShowQRModal(false)}
              className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/5"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
