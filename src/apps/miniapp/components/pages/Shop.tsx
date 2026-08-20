import React, { useState } from 'react';
import { categories, userProducts, mockUser } from '../../data';
import { Shield, MessageCircle, Bot, Server, Phone, Lock, ChevronLeft, ChevronRight, X, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useDragScroll } from '../../hooks/useDragScroll';
import { Tab, Product, ServiceGroup } from '../../types';

const iconMap: Record<string, React.ElementType> = {
  Shield, MessageCircle, Bot, Server, Phone, Lock
};

interface ShopProps {
  onNavigate?: (tab: Tab) => void;
  products: Product[];
  serviceGroups?: ServiceGroup[];
}

export function Shop({ onNavigate, products, serviceGroups = [] }: ShopProps) {

  const getDiscountedPrice = (product) => {
    const basePrice = product.salePrice !== undefined ? product.salePrice : product.price;
    if (!product.serviceGroupId) return basePrice;
    const group = serviceGroups.find(g => g.id === product.serviceGroupId);
    if (!group) return basePrice;
    const discountKey = `${mockUser.role}_${mockUser.level}`;
    const discountPercent = group.discounts[discountKey] || 0;
    return basePrice * (1 - discountPercent / 100);
  };

  const initialCategory = sessionStorage.getItem('shopCategory') || categories[0].id;
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  
  React.useEffect(() => {
    sessionStorage.removeItem('shopCategory');
    if (initialCategory) {
      setTimeout(() => {
        const el = document.getElementById(`category-${initialCategory}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 100);
    }
  }, [initialCategory]);

  const categoriesScroll = useDragScroll();
  const subcategoriesScroll = useDragScroll();
  
  const [purchasingProduct, setPurchasingProduct] = useState<Product | null>(null);
  const [configName, setConfigName] = useState('');
  const [panelUsername, setPanelUsername] = useState('');
  const [panelPassword, setPanelPassword] = useState('');
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const isProductAllowed = (p) => {
    if (!p.serviceGroupId) return true;
    const group = serviceGroups.find(g => g.id === p.serviceGroupId);
    if (group && group.allowedRoles && group.allowedRoles.length > 0) {
      if (!group.allowedRoles.includes(mockUser.role)) return false;
    }
    return true;
  };

  const filteredProducts = products
    .filter(p => p.categoryId === activeCategory && p.isActive !== false && isProductAllowed(p))
    .filter(p => activeSubcategory === 'all' || p.subcategoryId === activeSubcategory)
    .flatMap(p => {
    if (['vpn', 'personal_vpn'].includes(p.categoryId) && p.plans && p.plans.length > 0) {
      return p.plans
        .filter(plan => plan.isActive !== false)
        .map(plan => ({
          ...p,
          id: plan.id,
          panelId: p.id,
          name: plan.name || p.name,
          price: Number(plan.price) || 0,
          description: plan.description || p.description,
          features: plan.features ? (typeof plan.features === 'string' ? plan.features.split(',').map(s => s.trim()).filter(Boolean) : plan.features) : p.features,
          volume: Number(plan.volume) || 0,
          duration: Number(plan.duration) || 0,
          pricingMethod: plan.pricingMethod || 'account',
          templateId: plan.templateId,
          serviceGroupId: plan.serviceGroupId || p.serviceGroupId,
        }));
    }
    return [p];
  }).filter(p => isProductAllowed(p));

  const handleCategoryClick = (catId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveCategory(catId);
    setActiveSubcategory('all');
    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handleSubcategoryClick = (subcatId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveSubcategory(subcatId);
    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handleBuy = (product: Product) => {
    setPurchasingProduct(product);
    setConfigName('');
    setPanelUsername('');
    setPanelPassword('');
    setPurchaseError('');
    setPurchaseSuccess(false);
  };

  const confirmPurchase = () => {
    if (!purchasingProduct) return;
    setPurchaseError('');
    
    if (purchasingProduct.categoryId === 'vpn') {
      if (panelUsername.length <= 5 || panelPassword.length <= 5) {
        setPurchaseError('نام کاربری و رمز عبور باید بیشتر از ۵ کاراکتر باشند.');
        return;
      }
      if (!/^[a-zA-Z0-9]+$/.test(panelUsername) || !/^[a-zA-Z0-9]+$/.test(panelPassword)) {
        setPurchaseError('فقط حروف انگلیسی و اعداد مجاز است.');
        return;
      }
      if (panelUsername === panelPassword) {
        setPurchaseError('نام کاربری و رمز عبور نباید یکسان باشند.');
        return;
      }
    }
    
    // Add to userProducts
    const newProduct = {
      id: `up_${Date.now()}`,
      productId: purchasingProduct.id,
      name: purchasingProduct.name,
      configName: purchasingProduct.categoryId === 'personal_vpn' && configName ? configName : undefined,
      status: 'active' as const,
      expiryDate: purchasingProduct.categoryId === 'personal_vpn' ? 'نامحدود' : '۱۴۰۳/۰۶/۱۵',
      usageLimit: purchasingProduct.categoryId === 'personal_vpn' ? 'نامحدود' : (purchasingProduct.categoryId === 'vpn' ? '۵۰ گیگابایت' : undefined),
      usageCurrent: purchasingProduct.categoryId === 'personal_vpn' ? '۰ گیگابایت' : (purchasingProduct.categoryId === 'vpn' ? '۰ گیگابایت' : undefined),
      configLink: purchasingProduct.categoryId === 'personal_vpn' ? `vless://mock-uuid-1234-5678@example.com:443?type=tcp&security=tls#${encodeURIComponent(configName || 'Personal_VPN')}` : undefined,
      panelUrl: purchasingProduct.categoryId !== 'personal_vpn' ? 'https://panel.example.com' : undefined,
      username: purchasingProduct.categoryId === 'vpn' ? panelUsername : (purchasingProduct.categoryId !== 'personal_vpn' ? 'user_test' : undefined),
      password: purchasingProduct.categoryId === 'vpn' ? panelPassword : (purchasingProduct.categoryId !== 'personal_vpn' ? 'pass_test' : undefined),
    };
    
    userProducts.push(newProduct);
    setPurchaseSuccess(true);
  };

  const closeModal = () => {
    setPurchasingProduct(null);
    setPurchaseSuccess(false);
  };

  const goToProducts = () => {
    if (onNavigate) {
      onNavigate('products');
    }
  };

  return (
    <div className="p-4 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <h1 className="text-2xl font-bold text-center mt-2 mb-6">فروشگاه</h1>

      {/* Categories Scroll */}
      <div className="relative group">
        <button 
          onClick={() => {
            if (categoriesScroll.scrollRef.current) {
              categoriesScroll.scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
            }
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 -mt-1.5 rounded-full bg-[#111827]/80 border border-white/20 hidden sm:flex items-center justify-center text-white backdrop-blur-md shadow-xl hover:bg-black transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={16} />
        </button>

        <button 
          onClick={() => {
            if (categoriesScroll.scrollRef.current) {
              categoriesScroll.scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
            }
          }}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 -mt-1.5 rounded-full bg-[#111827]/80 border border-white/20 hidden sm:flex items-center justify-center text-white backdrop-blur-md shadow-xl hover:bg-black transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={16} />
        </button>

        <div 
          ref={categoriesScroll.scrollRef}
          {...categoriesScroll.events}
          className={`flex overflow-x-auto gap-3 pb-3 -mx-4 px-4 scroll-smooth scrollbar-hide select-none snap-x ${categoriesScroll.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                    : 'glass-card text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategories Scroll */}
      {(() => {
        const activeCatData = categories.find(c => c.id === activeCategory);
        if (!activeCatData?.subcategories || activeCatData.subcategories.length === 0) return null;
        
        return (
          <div className="relative group mt-1">
            <button 
              onClick={() => {
                if (subcategoriesScroll.scrollRef.current) {
                  subcategoriesScroll.scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
                }
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 -mt-1 rounded-full bg-[#111827]/90 border border-white/20 hidden sm:flex items-center justify-center text-white backdrop-blur-md shadow-xl hover:bg-black transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={14} />
            </button>

            <button 
              onClick={() => {
                if (subcategoriesScroll.scrollRef.current) {
                  subcategoriesScroll.scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
                }
              }}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 -mt-1 rounded-full bg-[#111827]/90 border border-white/20 hidden sm:flex items-center justify-center text-white backdrop-blur-md shadow-xl hover:bg-black transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={14} />
            </button>

            <div 
              ref={subcategoriesScroll.scrollRef}
              {...subcategoriesScroll.events}
              className={`flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scroll-smooth scrollbar-hide select-none snap-x ${subcategoriesScroll.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              <button
                onClick={(e) => handleSubcategoryClick('all', e)}
                className={`shrink-0 snap-center px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeSubcategory === 'all' 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-white/5 text-gray-400 hover:text-gray-200 border border-transparent'
                }`}
              >
                همه
              </button>
              {activeCatData.subcategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={(e) => handleSubcategoryClick(sub.id, e)}
                  className={`shrink-0 snap-center px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeSubcategory === sub.id
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'bg-white/5 text-gray-400 hover:text-gray-200 border border-transparent'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Products Grid */}
      <div className="space-y-4 mt-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm bg-white/5 border border-white/10 rounded-2xl">
            <p className="font-medium text-orange-400 mb-2">محصولی یافت نشد</p>
            <p className="text-xs leading-relaxed max-w-[200px] mx-auto text-gray-400">
              در حال حاضر محصولی در این دسته‌بندی وجود ندارد.
            </p>
          </div>
        ) : (
          <>
            {filteredProducts.map(product => (
              <div key={product.id} className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-50"></div>
                
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{product.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-[10px] text-gray-400 mb-0.5">قیمت</div>
                    <div className="font-bold font-mono text-lg text-white">
                      {getDiscountedPrice(product).toLocaleString('en-US')} <span className="text-xs font-sans text-gray-400">تومان {product.unit ? `/ ${product.unit}` : ''}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBuy(product)}
                    className="bg-white text-gray-900 px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-gray-100 transition-colors"
                  >
                    {product.categoryId === 'vpn' ? 'ساخت پنل' : 'خرید سرویس'}
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Purchase Modal */}
      {purchasingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {purchaseSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">خرید موفقیت‌آمیز</h3>
                <p className="text-sm text-gray-400">سرویس شما با موفقیت فعال شد.</p>
                <div className="pt-4 flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
                    بستن
                  </button>
                  <button onClick={goToProducts} className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
                    سرویس‌های من <ArrowLeft size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                  <h3 className="font-bold text-lg">تایید خرید</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-white p-1">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-sm text-gray-300 mb-1">{purchasingProduct.name}</div>
                    <div className="font-bold text-purple-400">
                      {getDiscountedPrice(purchasingProduct).toLocaleString('en-US')} تومان {purchasingProduct.unit ? `/ ${purchasingProduct.unit}` : ''}
                    </div>
                  </div>
                  
                  {purchasingProduct.categoryId === 'personal_vpn' && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 block">نام کانفیگ (فقط حروف انگلیسی و اعداد)</label>
                      <input 
                        type="text" 
                        value={configName}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(val)) {
                            setConfigName(val);
                          }
                        }}
                        placeholder="e.g. MyPhone1" 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600 dir-ltr text-left"
                        autoFocus
                      />
                    </div>
                  )}

                  {purchasingProduct.categoryId === 'vpn' && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400 block">نام کاربری پنل (انگلیسی و اعداد، +۵ کاراکتر)</label>
                        <input 
                          type="text" 
                          value={panelUsername}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(val)) setPanelUsername(val);
                          }}
                          placeholder="Username" 
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600 dir-ltr text-left"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400 block">رمز عبور پنل (انگلیسی و اعداد، +۵ کاراکتر)</label>
                        <input 
                          type="text" 
                          value={panelPassword}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(val)) setPanelPassword(val);
                          }}
                          placeholder="Password" 
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600 dir-ltr text-left"
                        />
                      </div>
                    </div>
                  )}

                  {purchaseError && (
                    <div className="text-red-400 text-xs font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
                      {purchaseError}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={confirmPurchase}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-bold text-white transition-colors"
                >
                  پرداخت و دریافت سرویس
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
