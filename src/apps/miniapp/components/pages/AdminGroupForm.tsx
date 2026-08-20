import React, { useState, useEffect } from 'react';
import { ChevronRight, Save } from 'lucide-react';
import { ServiceGroup, Product, Category, ResellerLevel } from '../../types';

interface Props {
  editingGroup: ServiceGroup | null;
  categories: Category[];
  products: Product[];
  resellerLevels?: ResellerLevel[];
  onSave: (group: ServiceGroup, selectedProductIds: string[]) => void;
  onCancel: () => void;
}

export function AdminGroupForm({ editingGroup, categories, products, resellerLevels = [], onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<ServiceGroup>({
    id: '',
    name: '',
    description: '',
    discounts: {
      'reseller_bronze': 5,
      'reseller_silver': 10,
      'reseller_gold': 15,
      'bot_owner_none': 20,
    }
  });

  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (editingGroup) {
      setFormData(editingGroup);
      
      const groupProductIds = [];
      let foundCategory = '';
      
      products.forEach(p => {
        if (p.serviceGroupId === editingGroup.id) {
          groupProductIds.push(p.id);
          if (!foundCategory) foundCategory = p.categoryId;
        }
        if (p.plans) {
          p.plans.forEach(pl => {
            if (pl.serviceGroupId === editingGroup.id) {
              groupProductIds.push(pl.id);
              if (!foundCategory) foundCategory = p.categoryId;
            }
          });
        }
      });
      
      setSelectedProductIds(groupProductIds);
      if (foundCategory) {
        setSelectedCategory(foundCategory);
      }
    } else {
      setFormData({
        id: 'sg_' + Date.now(),
        name: '',
        description: '',
        allowedRoles: ['user', ...resellerLevels.map(l => l.id), 'bot_owner'],
        discounts: {
          'reseller_bronze': 5,
          'reseller_silver': 10,
          'reseller_gold': 15,
          'bot_owner_none': 20,
        }
      });
      setSelectedProductIds([]);
    }
  }, [editingGroup, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, selectedProductIds);
  };

  const toggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const categoryProducts = products.filter(p => p.categoryId === selectedCategory);
  
  // Also show products that are currently in this group but might be in different categories
  
  const otherGroupProducts: { id: string; name: string; categoryName: string; parentName?: string; isPlan: boolean }[] = [];
  selectedProductIds.forEach(id => {
    // Check main products
    const mainProduct = products.find(p => p.id === id);
    if (mainProduct && mainProduct.categoryId !== selectedCategory) {
      const categoryName = categories.find(c => c.id === mainProduct.categoryId)?.name || 'نامشخص';
      otherGroupProducts.push({ id, name: mainProduct.name, categoryName, isPlan: false });
    } else {
      // Check plans
      products.forEach(p => {
        if (p.categoryId !== selectedCategory && p.plans) {
          const plan = p.plans.find(pl => pl.id === id);
          if (plan) {
            const categoryName = categories.find(c => c.id === p.categoryId)?.name || 'نامشخص';
            otherGroupProducts.push({ id, name: plan.name || p.name, categoryName, parentName: p.name, isPlan: true });
          }
        }
      });
    }
  });


  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
      <div className="flex items-center gap-3 mt-2 mb-6">
        <button onClick={onCancel} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronRight size={24} className="text-gray-400" />
        </button>
        <h1 className="text-xl font-bold">{editingGroup ? 'ویرایش گروه سرویس' : 'افزودن گروه جدید'}</h1>
      </div>
      
      <form className="glass p-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs text-gray-400 mb-1">نام گروه</label>
          <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="مثلا: سرویس‌های پایه" />
        </div>
        
        <div>
          <label className="block text-xs text-gray-400 mb-1">توضیحات</label>
          <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors h-20" placeholder="توضیحات گروه..."></textarea>
        </div>

        
        
        <div className="border-t border-white/10 pt-4">
          <label className="block text-xs text-blue-400 mb-3">دسترسی گروه‌های کاربری</label>
          <div className="flex flex-wrap gap-3">
            {['user', ...resellerLevels.map(l => l.id), 'bot_owner'].map(role => {
              const isResellerLevel = resellerLevels.some(l => l.id === role);
              const levelName = isResellerLevel ? resellerLevels.find(l => l.id === role)?.name : '';
              return (
              <label key={role} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!formData.allowedRoles || formData.allowedRoles.includes(role)}
                  onChange={(e) => {
                    const current = formData.allowedRoles || ['user', ...resellerLevels.map(l => l.id), 'bot_owner'];
                    if (e.target.checked) {
                      setFormData({...formData, allowedRoles: [...current, role]});
                    } else {
                      setFormData({...formData, allowedRoles: current.filter(r => r !== role)});
                    }
                  }}
                  className="rounded border-white/20 bg-black/20 text-blue-500 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-300">
                  {role === 'user' ? 'کاربر عادی' : role === 'bot_owner' ? 'ربات‌دار' : levelName}
                </span>
              </label>
            )})}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <label className="block text-xs text-blue-400 mb-3">محصولات گروه</label>
          
          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">انتخاب دسته‌بندی</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
              ))}
            </select>
          </div>


          <div className="space-y-4 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {categoryProducts.map(p => (
              <div key={p.id} className="bg-black/20 rounded-xl p-3 border border-white/5">
                <label className="flex items-center gap-3 cursor-pointer mb-2">
                  <input 
                    type="checkbox" 
                    checked={selectedProductIds.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className="rounded border-white/20 bg-black/20 text-blue-500 focus:ring-blue-500/20"
                  />
                  <span className="text-sm font-bold">{p.name}</span>
                </label>
                {p.plans && p.plans.length > 0 && (
                  <div className="mr-6 space-y-2 border-r-2 border-white/10 pr-3">
                    {p.plans.map(plan => (
                      <label key={plan.id} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedProductIds.includes(plan.id)}
                          onChange={() => toggleProduct(plan.id)}
                          className="rounded border-white/20 bg-black/20 text-blue-500 focus:ring-blue-500/20"
                        />
                        <div className="text-xs">
                          <span>{plan.name || p.name}</span>
                          <span className="text-gray-500 mr-2 text-[10px]">{Number(plan.price || 0).toLocaleString()} تومان</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {categoryProducts.length === 0 && (
              <div className="text-xs text-gray-500 text-center py-2">محصولی در این دسته یافت نشد.</div>
            )}
          </div>

          
          {otherGroupProducts.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-3">
              <label className="block text-[10px] text-gray-400 mb-2">محصولات انتخاب شده در دسته‌های دیگر:</label>
              <div className="space-y-2">
                {otherGroupProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-blue-400 font-medium">{p.categoryName}</span>
                      <span className="text-sm font-medium text-gray-200">
                        {p.isPlan ? (
                          <>
                            <span className="text-gray-400">{p.parentName}</span>
                            <span className="mx-1 text-gray-600">/</span>
                            <span>{p.name}</span>
                          </>
                        ) : (
                          p.name
                        )}
                      </span>
                    </div>
                    <button type="button" onClick={() => toggleProduct(p.id)} className="text-[10px] bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded text-red-400 transition-colors">حذف</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <Save size={18} />
          {editingGroup ? 'ذخیره تغییرات' : 'ایجاد گروه'}
        </button>
      </form>
    </div>
  );
}
