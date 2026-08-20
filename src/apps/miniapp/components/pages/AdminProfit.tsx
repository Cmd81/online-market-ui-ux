import React, { useState } from 'react';
import { CircleDollarSign, Shield, MessageCircle, Bot, Server, Phone, Lock, Save, Check, Calculator } from 'lucide-react';
import { categories } from '../../data';
import { useDragScroll } from '../../hooks/useDragScroll';
import { Product } from '../../types';

const iconMap: Record<string, React.ElementType> = {
  Shield, MessageCircle, Bot, Server, Phone, Lock
};

interface AdminProfitProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export function AdminProfit({ products, setProducts }: AdminProfitProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [activeGroup, setActiveGroup] = useState<'all' | 'user' | 'reseller' | 'bot_owner'>('all');
  const [bulkPercentage, setBulkPercentage] = useState('');
  
  const categoriesScroll = useDragScroll();

  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Local state for modified prices and active status
  // In a real app, these would be nested by group: Record<string, Record<string, number>>
  const [modifiedPrices, setModifiedPrices] = useState<Record<string, number>>({});
  const [modifiedStatus, setModifiedStatus] = useState<Record<string, boolean>>({});

  const handleCategoryClick = (catId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveCategory(catId);
    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const activeProducts = products.filter(p => p.categoryId === activeCategory);
  
  // Flatten products with plans
  const flatProducts: any[] = activeProducts.flatMap(p => {
    if (['vpn', 'personal_vpn'].includes(p.categoryId) && p.plans && p.plans.length > 0) {
      return p.plans.map(plan => ({
        ...p,
        id: plan.id,
        panelId: p.id,
        name: plan.name || p.name,
        price: plan.salePrice !== undefined ? Number(plan.salePrice) : (Number(plan.price) || 0),
        originalPrice: Number(plan.price) || 0,
        isActive: plan.isActive !== false
      }));
    }
    return [{
      ...p,
      panelId: p.id,
      price: p.salePrice !== undefined ? Number(p.salePrice) : (Number(p.price) || 0),
      originalPrice: Number(p.price) || 0,
      isActive: true
    }];
  });

  const handlePriceChange = (id: string, value: string) => {
    const englishValue = value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    const num = parseInt(englishValue.replace(/\D/g, ''), 10);
    setModifiedPrices(prev => ({ ...prev, [id]: isNaN(num) ? 0 : num }));
  };

  const toggleStatus = (id: string, currentStatus: boolean) => {
    setModifiedStatus(prev => ({ 
      ...prev, 
      [id]: prev[id] !== undefined ? !prev[id] : !currentStatus 
    }));
  };

  const handleSave = (id: string) => {
    setSavingId(id);
    
    // Find the flat product to know its panelId
    const flatP = flatProducts.find(p => p.id === id);
    if (flatP) {
      const panelId = flatP.panelId;
      const newSalePrice = modifiedPrices[id] !== undefined ? modifiedPrices[id] : flatP.price;
      const newIsActive = modifiedStatus[id] !== undefined ? modifiedStatus[id] : flatP.isActive;
      
      setProducts(products.map(p => {
        if (p.id === panelId) {
          if (p.plans && p.plans.length > 0) {
            return {
              ...p,
              plans: p.plans.map(plan => 
                plan.id === id ? { ...plan, salePrice: newSalePrice, isActive: newIsActive } : plan
              )
            };
          } else {
            return {
              ...p,
              salePrice: newSalePrice,
              isActive: newIsActive
            };
          }
        }
        return p;
      }));
    }

    setTimeout(() => {
      setSavingId(null);
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
    }, 600);
  };

  const handleBulkApply = () => {
    // Convert Persian digits to English digits before parsing
    const englishPercentage = bulkPercentage.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    const percentage = parseFloat(englishPercentage);
    if (isNaN(percentage) || percentage < 0) return;

    const newPrices = { ...modifiedPrices };
    flatProducts.forEach(product => {
      // Calculate new price based on original cost + percentage profit
      const newPrice = product.originalPrice + (product.originalPrice * (percentage / 100));
      newPrices[product.id] = Number(newPrice.toFixed(2)); // Exact price without thousand rounding
    });
    
    setModifiedPrices(newPrices);
    setBulkPercentage('');
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-black/40 border border-white/10 p-6 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <CircleDollarSign size={24} />
              </div>
              <h1 className="text-xl font-bold text-white">مدیریت سود و قیمت‌گذاری</h1>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mt-3">
              حاشیه سود خود را برای دسته‌های مختلف کاربری تنظیم کنید. می‌توانید قیمت‌ها را به صورت تکی یا گروهی تغییر دهید.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div 
        ref={categoriesScroll.scrollRef}
        {...categoriesScroll.events}
        className={`flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scroll-smooth shop-scrollbar select-none snap-x ${categoriesScroll.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {categories.map(cat => {
          const Icon = iconMap[cat.icon] || Shield;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`category-${cat.id}`}
              onClick={(e) => handleCategoryClick(cat.id, e)}
              className={`shrink-0 snap-center flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-bold whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Group Selection (Segmented Control) */}
      <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex overflow-x-auto scrollbar-hide">
        {[
          { id: 'all', label: 'همه کاربران' },
          { id: 'user', label: 'کاربران عادی' },
          { id: 'reseller', label: 'نماینده‌ها' },
          { id: 'bot_owner', label: 'ربات‌دارها' }
        ].map(group => (
          <button 
            key={group.id}
            onClick={() => setActiveGroup(group.id as any)}
            className={`flex-1 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeGroup === group.id 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Bulk Apply */}
      {flatProducts.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-5 rounded-2xl border border-blue-500/20 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Calculator size={16} className="text-blue-400" />
              محاسبه و اعمال گروهی
            </h3>
            <p className="text-xs text-gray-400">درصد سود دلخواه خود را وارد کنید تا روی تمام محصولات این دسته اعمال شود.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-32">
              <input 
                type="text" 
                inputMode="numeric"
                value={bulkPercentage}
                onChange={(e) => setBulkPercentage(e.target.value)}
                placeholder="مثال: 20"
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right text-white font-mono"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">%</span>
            </div>
            <button 
              onClick={handleBulkApply}
              disabled={!bulkPercentage}
              className="h-[42px] px-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors shrink-0"
            >
              اعمال سود
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {flatProducts.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm bg-white/5 border border-white/10 rounded-3xl">
            <p className="font-medium text-orange-400 mb-2">محصولی یافت نشد</p>
          </div>
        ) : (
          flatProducts.map(product => {
            const currentPrice = modifiedPrices[product.id] !== undefined ? modifiedPrices[product.id] : product.price;
            const originalPrice = product.originalPrice;
            const profit = currentPrice - originalPrice;
            
            const isEnabled = modifiedStatus[product.id] !== undefined ? modifiedStatus[product.id] : product.isActive;

            return (
              <div key={product.id} className={`p-5 rounded-3xl border flex flex-col gap-4 transition-all duration-300 relative overflow-hidden ${isEnabled ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-black/40 border-red-500/20 opacity-75'}`}>
                {/* Background Glow */}
                {isEnabled && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                )}
                
                <div className="flex justify-between items-start relative z-10">
                  <span className="font-bold text-sm text-white leading-tight pl-2">{product.name}</span>
                  <button 
                    onClick={() => toggleStatus(product.id, isEnabled)}
                    className={`text-[10px] px-2.5 py-1 rounded-full transition-colors shrink-0 font-medium ${isEnabled ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'}`}
                  >
                    {isEnabled ? 'فعال' : 'غیرفعال'}
                  </button>
                </div>
                
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative z-10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">قیمت خرید (پایه):</span>
                    <span className="font-mono text-gray-300">{originalPrice.toLocaleString('en-US')} <span className="text-[10px] text-gray-500 font-sans">تومان</span></span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs relative">
                    <span className="text-gray-400">فروش به کاربر:</span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="text" 
                        className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 w-24 text-left font-mono font-medium focus:outline-none focus:border-blue-500 focus:bg-blue-500/10 transition-all" 
                        value={currentPrice.toLocaleString('en-US')}
                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                        disabled={!isEnabled}
                      />
                      <span className="text-[10px] text-gray-500">تومان</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-white/10 pt-3 flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">سود شما:</span>
                    <div className={`flex items-center gap-1 font-mono font-bold text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {profit > 0 ? '+' : ''}{profit.toLocaleString('en-US')}
                      <span className="text-[10px] font-sans opacity-70">تومان</span>
                    </div>
                  </div>
                </div>
                  
                <button
                  onClick={() => handleSave(product.id)}
                  disabled={!isEnabled || savingId === product.id}
                  className={`w-full relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all mt-auto ${
                    savedId === product.id 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : savingId === product.id
                      ? 'bg-blue-600/50 text-white cursor-wait'
                      : !isEnabled
                      ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/5'
                  }`}
                >
                  {savedId === product.id ? (
                    <>
                      <Check size={16} />
                      تغییرات ذخیره شد
                    </>
                  ) : savingId === product.id ? (
                    'در حال ثبت...'
                  ) : (
                    <>
                      <Save size={16} />
                      ثبت و بروزرسانی
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
