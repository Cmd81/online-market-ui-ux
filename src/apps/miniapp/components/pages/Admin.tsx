import React, { useState } from 'react';
import { Package, Plus, Gift, Users, Settings, Activity, PlusCircle, Edit2, Trash2, ChevronRight, Save, CreditCard, MessageSquare, Send, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { products as initialProducts, mockUser, categories, mockPaymentCards, mockTickets, mockMessages } from '../../data';
import { AdminGroupForm } from "./AdminGroupForm";
import { Product, PaymentCard, Ticket, Message, ServiceGroup, ResellerLevel } from '../../types';

interface AdminProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  serviceGroups?: ServiceGroup[];
  setServiceGroups?: (groups: ServiceGroup[]) => void;
  resellerLevels?: ResellerLevel[];
}

export function Admin({ products, setProducts, serviceGroups = [], setServiceGroups = () => {}, resellerLevels = [] }: AdminProps) {
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ServiceGroup | null>(null);

    const [paymentTab, setPaymentTab] = useState<'card' | 'plisio'>('card');
  const [plisioSettings, setPlisioSettings] = useState({
    apiKey: '',
    address: '',
    isActive: false
  });
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>(mockPaymentCards);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardFormData, setCardFormData] = useState({
    cardNumber: '',
    ownerName: '',
    bankName: '',
  });

  const [viewMode, setViewMode] = useState<'products' | 'groups' | 'master'>('products');
    const [adminTickets, setAdminTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'answered' | 'closed'>('all');

    
    const [lotterySettings, setLotterySettings] = useState(
    JSON.parse(localStorage.getItem('lotteryConfig') || '{"isActive":true,"volume":"1","maxWinners":"10","guaranteedWinForNewUsers":false}')
  );
  const [savedLotterySettings, setSavedLotterySettings] = useState(
    JSON.parse(localStorage.getItem('lotteryConfig') || '{"isActive":true,"volume":"1","maxWinners":"10","guaranteedWinForNewUsers":false}')
  );
  
  const [supportIds, setSupportIds] = useState<string[]>([]);
  const [newSupportId, setNewSupportId] = useState('');

    const [panelTemplates, setPanelTemplates] = useState<any[]>([]);
  const [panelPlans, setPanelPlans] = useState<any[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [showInbounds, setShowInbounds] = useState(false);
  const [isFetchingInbounds, setIsFetchingInbounds] = useState(false);
  
  const handleFetchInbounds = () => {
    setIsFetchingInbounds(true);
    setTimeout(() => {
      
      setIsFetchingInbounds(false);
      setShowInbounds(true);
    }, 1000);
  };


  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    price: '',
    unit: '',
    description: '',
    features: '',
    panelUrl: '',
    usageLimit: '',
    serverAddress: '',
    volume: '0',
    duration: '0',
    panelUsername: '',
    panelPassword: '',
    apiParams: '{\n  \n}',
    panelType: 'marzneshin' as 'marzneshin' | 'elan',
    apiKey: '',
    pricingMethod: 'account' as 'usage' | 'account',
    selectedInbounds: [] as string[],
    isActive: true
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [availableInbounds, setAvailableInbounds] = useState<{id: string, name: string, protocol: string}[]>([]);
  const [productFormTab, setProductFormTab] = useState<'panel' | 'products' | 'template'>('panel');

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('در حال بررسی ارتباط با پنل...');
    
    // Simulate API call
    setTimeout(() => {
      // Basic validation
      if (!formData.panelUrl) {
        setTestStatus('error');
        setTestMessage('لطفا آدرس پنل را وارد کنید');
        return;
      }
      
      if (formData.panelType === 'marzneshin' && (!formData.panelUsername || !formData.panelPassword)) {
        setTestStatus('error');
        setTestMessage('لطفا نام کاربری و رمز عبور را وارد کنید');
        return;
      }
      
      if (formData.panelType === 'elan' && !formData.apiKey) {
        setTestStatus('error');
        setTestMessage('لطفا کلید API را وارد کنید');
        return;
      }

      // Simulate successful test
      setTestStatus('success');
      setTestMessage('ارتباط با پنل برقرار شد');
      
      setTimeout(() => {
        setAvailableInbounds([
          { id: 'inbound_1', name: 'VLESS WS (Germany)', protocol: 'vless' },
          { id: 'inbound_2', name: 'VMess TCP (Finland)', protocol: 'vmess' },
          { id: 'inbound_3', name: 'Trojan GRPC (UK)', protocol: 'trojan' },
          { id: 'inbound_4', name: 'VLESS Reality (France)', protocol: 'vless' },
        ]);
        
      }, 500);

    }, 1500);
  };

    const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price.toString(),
      unit: product.unit || '',
      description: product.description,
      features: product.features.join(','),
      panelUrl: product.panelUrl || '',
      usageLimit: product.usageLimit || '',
      serverAddress: product.serverAddress || '',
      volume: product.volume !== undefined ? product.volume.toString() : '0',
      duration: product.duration !== undefined ? product.duration.toString() : '0',
      panelUsername: product.panelUsername || '',
      panelPassword: product.panelPassword || '',
      apiParams: product.apiParams || '{\n  \n}',
      panelType: product.panelType || 'marzneshin',
      apiKey: product.apiKey || '',
      pricingMethod: product.pricingMethod || 'account',
      selectedInbounds: product.selectedInbounds || [],
      isActive: product.isActive !== false
    });
    setPanelTemplates(product.templates || []);
    setPanelPlans(product.plans || []);
    setTestStatus(product.panelUrl ? 'success' : 'idle');
    setIsAddingProduct(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      price: '',
      unit: '',
      description: '',
      features: '',
      panelUrl: '',
      usageLimit: '',
      serverAddress: '',
      volume: '0',
      duration: '0',
      panelUsername: '',
      panelPassword: '',
      apiParams: '{\n  \n}',
      panelType: 'marzneshin' as 'marzneshin' | 'elan',
      apiKey: '',
      pricingMethod: 'account' as 'usage' | 'account',
      selectedInbounds: [] as string[],
      isActive: true
    });
    setPanelTemplates([]);
    setPanelPlans([]);
    setAvailableInbounds([]);
    setTestStatus('idle');
    setIsAddingProduct(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isVpn = formData.categoryId === 'personal_vpn' || formData.categoryId === 'vpn';
    
    const commonFields = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: Number(formData.price),
      unit: formData.unit,
      description: formData.description,
      features: formData.features.split(',').map(s => s.trim()).filter(Boolean),
      panelUrl: formData.panelUrl,
      usageLimit: formData.usageLimit,
      serverAddress: formData.serverAddress,
      volume: formData.volume !== '' ? Number(formData.volume) : undefined,
      duration: formData.duration !== '' ? Number(formData.duration) : undefined,
      isActive: formData.isActive,
      panelUsername: isVpn && formData.panelType === 'marzneshin' ? formData.panelUsername : undefined,
      panelPassword: isVpn && formData.panelType === 'marzneshin' ? formData.panelPassword : undefined,
      apiParams: isVpn ? formData.apiParams : undefined,
      panelType: isVpn ? formData.panelType : undefined,
      apiKey: isVpn && formData.panelType === 'elan' ? formData.apiKey : undefined,
      pricingMethod: isVpn ? formData.pricingMethod : undefined,
      selectedInbounds: isVpn ? formData.selectedInbounds : undefined,
      templates: isVpn ? panelTemplates : undefined,
      plans: isVpn ? panelPlans : undefined,
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p,
        ...commonFields
      } : p));
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        ...commonFields
      };
      setProducts([...products, newProduct]);
    }
    setIsAddingProduct(false);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: PaymentCard = {
      id: `c${Date.now()}`,
      cardNumber: cardFormData.cardNumber,
      ownerName: cardFormData.ownerName,
      bankName: cardFormData.bankName,
      isActive: true,
    };
    setPaymentCards([...paymentCards, newCard]);
    setIsAddingCard(false);
    setCardFormData({ cardNumber: '', ownerName: '', bankName: '' });
  };

  const handleDeleteCard = (id: string) => {
    if (confirm('آیا از حذف این کارت اطمینان دارید؟')) {
      setPaymentCards(paymentCards.filter(c => c.id !== id));
    }
  };

  const toggleCardStatus = (id: string) => {
    setPaymentCards(paymentCards.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTicketMessages(mockMessages.filter(m => m.ticketId === ticket.id));
  };

  const handleCloseTicket = (id: string) => {
    setAdminTickets(adminTickets.map(t => t.id === id ? { ...t, status: 'closed' } : t));
    if (selectedTicket?.id === id) {
      setSelectedTicket({ ...selectedTicket, status: 'closed' });
    }
  };

  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      ticketId: selectedTicket.id,
      sender: 'human', // admin replying
      text: replyText,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setTicketMessages([...ticketMessages, newMessage]);
    setReplyText('');
    
    // Update ticket status to answered
    setAdminTickets(adminTickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'answered' } : t));
    setSelectedTicket({ ...selectedTicket, status: 'answered' });
  };

  const handleAddSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSupportId.trim() && !supportIds.includes(newSupportId.trim())) {
      setSupportIds([...supportIds, newSupportId.trim()]);
      setNewSupportId('');
    }
  };

  const handleRemoveSupport = (id: string) => {
    if (confirm('آیا از حذف این آیدی از لیست پشتیبان‌ها اطمینان دارید؟')) {
      setSupportIds(supportIds.filter(sId => sId !== id));
    }
  };

  const isFullAdmin = mockUser.role === 'admin';
  const isSupport = supportIds.includes(mockUser.id);

  if (!isFullAdmin && !isSupport) {
    return (
      <div className="p-4 flex items-center justify-center h-[50vh]">
        <p className="text-gray-500">شما دسترسی به این بخش را ندارید.</p>
      </div>
    );
  }

  
  const handleSaveGroup = (group, selectedProductIds) => {
    let newGroups;
    if (editingGroup) {
      newGroups = serviceGroups.map(g => g.id === group.id ? group : g);
    } else {
      newGroups = [...serviceGroups, group];
    }
    setServiceGroups(newGroups);
    
    // update products
    const newProducts = products.map(p => {
      let updatedP = { ...p };
      
      if (selectedProductIds.includes(p.id)) {
        updatedP.serviceGroupId = group.id;
      } else if (p.serviceGroupId === group.id) {
        updatedP.serviceGroupId = undefined;
      }
      
      if (updatedP.plans) {
        updatedP.plans = updatedP.plans.map(pl => {
          if (selectedProductIds.includes(pl.id)) {
            return { ...pl, serviceGroupId: group.id };
          } else if (pl.serviceGroupId === group.id) {
            return { ...pl, serviceGroupId: undefined };
          }
          return pl;
        });
      }
      
      return updatedP;
    });
    setProducts(newProducts);
    
    setIsAddingGroup(false);
    setEditingGroup(null);
  };

  if ((isAddingGroup || editingGroup) && isFullAdmin) {
    return (
      <AdminGroupForm resellerLevels={resellerLevels} 
        editingGroup={editingGroup}
        categories={categories}
        products={products}
        onSave={handleSaveGroup}
        onCancel={() => {
          setIsAddingGroup(false);
          setEditingGroup(null);
        }}
      />
    );
  }


  if (isAddingProduct && isFullAdmin) {
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button onClick={() => setIsAddingProduct(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">{editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h1>
        </div>
        
        <form className="glass p-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs text-gray-400 mb-1">دسته‌بندی</label>
            <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
              ))}
            </select>
          </div>

          {['vpn', 'personal_vpn'].includes(formData.categoryId) ? (
            <>
              <div className="flex bg-black/40 p-1 rounded-xl mb-4">
                <button 
                  type="button" 
                  onClick={() => setProductFormTab('panel')}
                  className={`flex-1 text-sm py-2 rounded-lg transition-colors ${productFormTab === 'panel' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                >تنظیمات پنل</button>
                <button 
                  type="button" 
                  onClick={() => testStatus === 'success' && setProductFormTab('template')}
                  disabled={testStatus !== 'success'}
                  className={`flex-1 text-sm py-2 rounded-lg transition-colors ${productFormTab === 'template' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'} ${testStatus !== 'success' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >قالب‌ها</button>
                <button 
                  type="button" 
                  onClick={() => testStatus === 'success' && setProductFormTab('products')}
                  disabled={testStatus !== 'success'}
                  className={`flex-1 text-sm py-2 rounded-lg transition-colors ${productFormTab === 'products' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'} ${testStatus !== 'success' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >محصولات</button>
              </div>

              {productFormTab === 'panel' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نوع پنل</label>
                    <select value={formData.panelType} onChange={(e) => setFormData({...formData, panelType: e.target.value as 'marzneshin' | 'elan'})} className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
                      <option value="marzneshin" className="bg-gray-900">مرزنشین (Marzneshin)</option>
                      <option value="elan" className="bg-gray-900">ایلان (Elan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نام سرویس / پنل</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="مثلا: سرور آلمان V2Ray" required />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">آدرس پنل (Panel URL)</label>
                    <input type="url" value={formData.panelUrl} onChange={(e) => setFormData({...formData, panelUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left" placeholder="https://panel.example.com" />
                  </div>

                  {formData.panelType === 'marzneshin' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">نام کاربری پنل</label>
                        <input type="text" value={formData.panelUsername} onChange={(e) => setFormData({...formData, panelUsername: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">رمز عبور پنل</label>
                        <input type="text" value={formData.panelPassword} onChange={(e) => setFormData({...formData, panelPassword: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">کلید API (API Key)</label>
                      <input type="text" value={formData.apiKey} onChange={(e) => setFormData({...formData, apiKey: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left" placeholder="Enter API Key" />
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <button 
                      type="button" 
                      onClick={handleTestConnection}
                      disabled={testStatus === 'testing'}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        testStatus === 'success' ? 'bg-green-600/20 text-green-500 border border-green-500/30' :
                        testStatus === 'error' ? 'bg-red-600/20 text-red-500 border border-red-500/30' :
                        'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {testStatus === 'testing' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          در حال بررسی ارتباط...
                        </>
                      ) : testStatus === 'success' ? (
                        <>
                          <CheckCircle2 size={16} />
                          ارتباط موفق - حالا می‌توانید قالب‌ها و محصولات را تعریف کنید
                        </>
                      ) : testStatus === 'error' ? (
                        <>
                          <AlertCircle size={16} />
                          خطا در ارتباط
                        </>
                      ) : (
                        <>
                          <Activity size={16} />
                          تست اتصال به پنل
                        </>
                      )}
                    </button>
                    {testMessage && (
                      <p className={`text-xs mt-2 text-center ${testStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                        {testMessage}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {productFormTab === 'template' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {panelTemplates.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h3 className="text-sm font-medium text-gray-300">قالب‌های ثبت شده:</h3>
                      {panelTemplates.map(tpl => (
                        <div key={tpl.id} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                          <div>
                            <div className="text-sm font-medium text-white">{tpl.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{tpl.selectedInbounds.length} اینباند انتخاب شده {tpl.startOnFirstConnect ? '| روزشمار از اولین اتصال' : ''}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => { setEditingTemplate(tpl); setShowInbounds(true); }} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg"><Edit2 size={14} /></button>
                            <button type="button" onClick={() => setPanelTemplates(panelTemplates.filter(t => t.id !== tpl.id))} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={14} /></button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                  {!showInbounds && !editingTemplate ? (
                    <button 
                      type="button"
                      onClick={handleFetchInbounds}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm text-gray-300 transition-colors"
                    >
                      {isFetchingInbounds ? <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div> : <Plus size={16} />}
                      {isFetchingInbounds ? 'در حال دریافت اینباندها...' : 'ایجاد قالب جدید (دریافت لیست اینباندها از سرور)'}
                    </button>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">{editingTemplate?.id ? 'ویرایش قالب' : 'ایجاد قالب جدید'}</h3>
                        <button type="button" onClick={() => { setShowInbounds(false); setEditingTemplate(null); }} className="text-xs text-gray-400 hover:text-white">انصراف</button>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">نام قالب</label>
                        <input type="text" value={editingTemplate?.name || ''} onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="مثلا: قالب همراه اول VLESS" />
                      </div>

                      <label className="flex items-center gap-2 p-3 bg-black/20 rounded-xl border border-white/5 cursor-pointer">
                        <input type="checkbox" checked={editingTemplate?.startOnFirstConnect || false} onChange={(e) => setEditingTemplate({...editingTemplate, startOnFirstConnect: e.target.checked})} className="rounded bg-black border-white/20 text-blue-500 focus:ring-0 focus:ring-offset-0 w-4 h-4" />
                        <span className="text-sm text-gray-300">روزشمار از اولین اتصال فعال باشد</span>
                      </label>

                      {availableInbounds.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-200">انتخاب اینباندها</label>
                            <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                              {(editingTemplate?.selectedInbounds || []).length} مورد انتخاب شده
                            </span>
                          </div>
                          
                          <div className="space-y-2 max-h-48 overflow-y-auto shop-scrollbar pr-1">
                            {availableInbounds.map((inbound) => {
                              const isSelected = (editingTemplate?.selectedInbounds || []).includes(inbound.id);
                              return (
                                <div 
                                  key={inbound.id}
                                  onClick={() => {
                                    const current = editingTemplate?.selectedInbounds || [];
                                    const newSelection = isSelected 
                                      ? current.filter((id: string) => id !== inbound.id)
                                      : [...current, inbound.id];
                                    setEditingTemplate({...editingTemplate, selectedInbounds: newSelection});
                                  }}
                                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-colors ${
                                    isSelected 
                                      ? 'bg-purple-600/20 border-purple-500 text-purple-100' 
                                      : 'bg-black/20 border-white/5 hover:bg-white/5 text-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                      isSelected ? 'bg-purple-600 border-purple-500' : 'border-gray-500'
                                    }`}>
                                      {isSelected && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{inbound.name}</span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/40 text-gray-400">
                                    {inbound.protocol.toUpperCase()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                         <div className="text-center py-4 text-sm text-gray-400">در حال دریافت اینباندها...</div>
                      )}

                      <button 
                        type="button" 
                        onClick={() => {
                          if (!editingTemplate?.name) return alert('نام قالب الزامی است');
                          if (editingTemplate.id) {
                            setPanelTemplates(panelTemplates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
                          } else {
                            setPanelTemplates([...panelTemplates, { ...editingTemplate, id: 'tpl_' + Date.now() }]);
                          }
                          setEditingTemplate(null);
                          setShowInbounds(false);
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        ذخیره قالب
                      </button>
                    </div>
                  )}
                </div>
              )}

              {productFormTab === 'products' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {panelPlans.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h3 className="text-sm font-medium text-gray-300">محصولات ثبت شده:</h3>
                      {panelPlans.map(plan => (
                        <div key={plan.id} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                          <div>
                            <div className="text-sm font-medium text-white">{plan.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{parseInt(plan.price).toLocaleString('fa-IR')} تومان | قالب: {panelTemplates.find(t => t.id === plan.templateId)?.name || 'نامشخص'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setEditingPlan(plan)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg"><Edit2 size={14} /></button>
                            <button type="button" onClick={() => setPanelPlans(panelPlans.filter(p => p.id !== plan.id))} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!editingPlan ? (
                    <button 
                      type="button"
                      onClick={() => setEditingPlan({
                        name: '', description: '', features: '', pricingMethod: 'account', volume: '', duration: '', price: '', templateId: ''
                      })}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm text-gray-300 transition-colors"
                    >
                      <Plus size={16} />
                      ایجاد محصول جدید برای این پنل
                    </button>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                       <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">{editingPlan.id ? 'ویرایش محصول' : 'ایجاد محصول جدید'}</h3>
                        <button type="button" onClick={() => setEditingPlan(null)} className="text-xs text-gray-400 hover:text-white">انصراف</button>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">نام محصول</label>
                        <input type="text" value={editingPlan.name} onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="مثلا: پلن ۳۰ روزه ۵۰ گیگ" />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">قالب متصل</label>
                        <select value={editingPlan.templateId} onChange={(e) => setEditingPlan({...editingPlan, templateId: e.target.value})} className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
                          <option value="" className="bg-gray-900">انتخاب قالب...</option>
                          {panelTemplates.map(t => (
                            <option key={t.id} value={t.id} className="bg-gray-900">{t.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">توضیحات کوتاه</label>
                        <input type="text" value={editingPlan.description} onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="توضیحات" />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">ویژگی‌ها (با کاما جدا کنید)</label>
                        <textarea value={editingPlan.features} onChange={(e) => setEditingPlan({...editingPlan, features: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors min-h-[80px]" placeholder="آی‌پی ثابت,سرعت نامحدود"></textarea>
                      </div>

                      <div className="p-4 bg-black/20 border border-white/5 rounded-xl space-y-4">
                        <h3 className="text-sm font-medium border-b border-white/5 pb-2">تنظیمات قیمت و حجم</h3>
                        
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">روش محاسبه</label>
                          <select value={editingPlan.pricingMethod} onChange={(e) => setEditingPlan({...editingPlan, pricingMethod: e.target.value as 'usage' | 'account'})} className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
                            <option value="account" className="bg-gray-900">اکانتی (حجم و زمان مشخص)</option>
                            <option value="usage" className="bg-gray-900">مصرفی (پرداخت به ازای هر گیگ)</option>
                          </select>
                        </div>

                        {editingPlan.pricingMethod === 'account' ? (
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-1">حجم (گیگابایت)</label>
                              <input type="text" inputMode="numeric" value={editingPlan.volume} onChange={(e) => setEditingPlan({...editingPlan, volume: e.target.value})} onKeyDown={(e) => { if (!/[0-9]|Backspace|Tab|Enter|Delete|Arrow/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); }} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="نامحدود = 0" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-1">زمان (روز)</label>
                              <input type="text" inputMode="numeric" value={editingPlan.duration} onChange={(e) => setEditingPlan({...editingPlan, duration: e.target.value})} onKeyDown={(e) => { if (!/[0-9]|Backspace|Tab|Enter|Delete|Arrow/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); }} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="نامحدود = 0" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-1">قیمت (تومان)</label>
                              <input type="text" inputMode="numeric" value={editingPlan.price} onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})} onKeyDown={(e) => { if (!/[0-9]|Backspace|Tab|Enter|Delete|Arrow/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); }} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right" placeholder="50000" />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-1">قیمت هر گیگابایت (تومان)</label>
                              <input type="text" inputMode="numeric" value={editingPlan.price} onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})} onKeyDown={(e) => { if (!/[0-9]|Backspace|Tab|Enter|Delete|Arrow/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); }} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-right" placeholder="1500" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-1">زمان (روز)</label>
                              <input type="text" inputMode="numeric" value={editingPlan.duration} onChange={(e) => setEditingPlan({...editingPlan, duration: e.target.value})} onKeyDown={(e) => { if (!/[0-9]|Backspace|Tab|Enter|Delete|Arrow/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); }} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="نامحدود = 0" />
                            </div>
                          </div>
                        )}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (!editingPlan.name || !editingPlan.price) return alert('نام و قیمت محصول الزامی است');
                          if (editingPlan.id) {
                            setPanelPlans(panelPlans.map(p => p.id === editingPlan.id ? editingPlan : p));
                          } else {
                            setPanelPlans([...panelPlans, { ...editingPlan, id: 'plan_' + Date.now() }]);
                          }
                          setEditingPlan(null);
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        ذخیره محصول در لیست
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 pt-4 border-t border-white/10 mt-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">نام محصول</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="مثلا: لایسنس 1 ماهه" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">قیمت (تومان)</label>
                  <input type="text" inputMode="numeric" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} onKeyDown={(e) => { if (!/[0-9]|Backspace|Tab|Enter|Delete|Arrow/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); }} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left" placeholder="50000" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">واحد (اختیاری)</label>
                  <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="مثلا: ماه" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">حجم (گیگابایت - 0 برای نامحدود)</label>
                  <input type="text" inputMode="numeric" value={formData.volume} onChange={(e) => setFormData({...formData, volume: e.target.value})} onKeyDown={(e) => { if (!/[0-9]|Backspace|Tab|Enter|Delete|Arrow/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); }} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">زمان (روز - 0 برای نامحدود)</label>
                  <input type="text" inputMode="numeric" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} onKeyDown={(e) => { if (!/[0-9]|Backspace|Tab|Enter|Delete|Arrow/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); }} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr text-left" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">توضیحات کوتاه</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="توضیحات..." />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">ویژگی‌ها (با کاما جدا کنید)</label>
                <textarea value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors min-h-[80px]" placeholder="تحویل آنی,پشتیبانی ۲۴ ساعته"></textarea>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="block text-xs text-gray-400 mb-1">وضعیت محصول</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  <span className="mr-3 text-sm font-medium text-gray-300">{formData.isActive ? 'فعال' : 'غیرفعال'}</span>
                </label>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-white/10 mt-6">
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <Save size={18} />
              ثبت سرویس / پنل نهایی
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (isAddingCard && isFullAdmin) {
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-3 mt-2 mb-6">
          <button onClick={() => setIsAddingCard(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">افزودن کارت بانکی</h1>
        </div>
        
        <form className="glass p-5 space-y-4" onSubmit={handleCardSubmit}>
          <div>
            <label className="block text-xs text-gray-400 mb-1">شماره کارت</label>
            <input type="text" inputMode="numeric" value={cardFormData.cardNumber} onChange={(e) => setCardFormData({...cardFormData, cardNumber: e.target.value.replace(/\D/g, '')})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dir-ltr" placeholder="1234567890123456" maxLength={16} required />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">نام صاحب کارت (اختیاری)</label>
            <input type="text" value={cardFormData.ownerName} onChange={(e) => setCardFormData({...cardFormData, ownerName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="مثلا: علی احمدی" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">نام بانک</label>
            <input type="text" value={cardFormData.bankName} onChange={(e) => setCardFormData({...cardFormData, bankName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="مثلا: ملی" required />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-4">
            <Save size={18} />
            ذخیره کارت
          </button>
        </form>
      </div>
    );
  }

  

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">

        <div className="flex items-center justify-between mt-2 mb-6">
          <div className="flex items-center gap-3">
            
            <h1 className="text-xl font-bold">مدیریت سرویس‌ها</h1>
          </div>
        </div>

        <div className="flex bg-black/40 rounded-xl p-1 mb-6">
          <button onClick={() => setViewMode("products")} className={`flex-1 py-2 text-xs rounded-lg transition-colors ${viewMode === "products" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>محصولات من</button>
          <button onClick={() => setViewMode("master")} className={`flex-1 py-2 text-xs rounded-lg transition-colors ${viewMode === "master" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>محصولات مستر</button>
          <button onClick={() => setViewMode("groups")} className={`flex-1 py-2 text-xs rounded-lg transition-colors ${viewMode === "groups" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>گروه‌های سرویس</button>
        </div>

        {viewMode === "products" && (
          <>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">لیست محصولات</span>
          <button onClick={handleAddClick} className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300">
            <PlusCircle size={14} /> افزودن محصول
          </button>
        </div>
        
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="glass p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400 shrink-0">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
                        دسته‌بندی: {categories.find(c => c.id === product.categoryId)?.name || 'نامشخص'}
                      </span>
                      {product.panelType && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                          نوع پنل: {product.panelType === 'marzneshin' ? 'مرزنشین' : 'الان (سنایی)'}
                        </span>
                      )}
                      {product.plans && product.plans.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                          تعداد پلن‌ها: {product.plans.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button onClick={() => setProducts(products.map(p => p.id === product.id ? { ...p, isActive: p.isActive === false ? true : false } : p))} className={`p-1.5 rounded-lg transition-colors ${product.isActive !== false ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'}`} title={product.isActive !== false ? 'غیرفعال کردن' : 'فعال کردن'}>
                      {product.isActive !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => handleEditClick(product)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDeleteClick(product.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {product.isActive === false && <span className="text-[10px] text-red-400 text-left">غیرفعال</span>}
                </div>
              </div>

              {/* Product Info details */}
              {(product.volume !== undefined || product.duration !== undefined ) && (!product.plans || product.plans.length === 0) && (
                <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-2 text-[10px] text-gray-400">
                  {product.volume > 0 && <span>حجم: {product.volume} GB</span>}
                  {product.duration > 0 && <span>زمان: {product.duration} روز</span>}
                  
                </div>
              )}

              {/* Plans Rendering */}
              {product.plans && product.plans.length > 0 && (
                <details className="mt-3 pt-3 border-t border-white/10 group">
                  <summary className="text-[10px] text-gray-400 mb-2 cursor-pointer select-none flex items-center gap-1 hover:text-gray-300 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                    پلن‌های زیرمجموعه ({product.plans.length}):
                  </summary>
                  <div className="space-y-2 mt-2">
                  {product.plans.map(plan => (
                    <div key={plan.id} className="flex flex-col bg-black/20 p-2 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs">{plan.name || product.name}</div>
                          <div className="text-[10px] text-gray-400">{Number(plan.price || 0).toLocaleString()} تومان</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            const updatedProducts = products.map(p => {
                              if (p.id === product.id) {
                                const updatedPlans = p.plans.map(pl => pl.id === plan.id ? { ...pl, isActive: pl.isActive === false ? true : false } : pl);
                                const allPlansInactive = updatedPlans.every(pl => pl.isActive === false);
                                return {
                                  ...p,
                                  plans: updatedPlans,
                                  isActive: allPlansInactive ? false : p.isActive !== false
                                };
                              }
                              return p;
                            });
                            setProducts(updatedProducts);
                          }} className={`p-1.5 rounded-lg transition-colors ${plan.isActive !== false ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'}`} title={plan.isActive !== false ? 'غیرفعال کردن' : 'فعال کردن'}>
                            {plan.isActive !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Plan details */}
                      <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[10px] text-gray-500">
                        {plan.volume > 0 && <span>حجم: {plan.volume} GB</span>}
                        {plan.duration > 0 && <span>زمان: {plan.duration} روز</span>}
                        {plan.templateId && <span>قالب: {plan.templateId}</span>}
                        {plan.isActive === false && <span className="text-red-400">غیرفعال</span>}
                      </div>
                    </div>
                  ))}
                  </div>
                </details>
              )}
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm glass">
              هیچ محصولی یافت نشد
            </div>
          )}
        </div>
        </>
        )}
        
        {viewMode === "master" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">محصولات ربات اصلی (مستر)</span>
            </div>
            
            {categories.map(cat => {
              const catProducts = products.filter(p => p.categoryId === cat.id);
              if (catProducts.length === 0) return null;
              
              return (
                <div key={cat.id} className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                    <h3 className="font-medium text-sm text-blue-400">{cat.name}</h3>
                  </div>
                  <div className="space-y-3">
                    {catProducts.map(product => (
                      <div key={product.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                        <span className="text-sm font-medium">{product.name}</span>
                        <button 
                          onClick={() => setProducts(products.map(p => p.id === product.id ? { ...p, isActive: p.isActive === false ? true : false } : p))}
                          className={`text-[10px] px-3 py-1.5 rounded-lg transition-colors font-medium ${product.isActive !== false ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                        >
                          {product.isActive !== false ? 'فعال' : 'غیرفعال'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === "groups" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">لیست گروه‌های سرویس</span>
              <button onClick={() => setIsAddingGroup(true)} className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300"><PlusCircle size={14} /> افزودن گروه</button>
            </div>
            {serviceGroups.map(group => (
              <div key={group.id} className="glass p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-sm">{group.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 mb-2">{group.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(group.allowedRoles || ['user', ...resellerLevels.map(l => l.id), 'bot_owner']).map(role => {
                        const level = resellerLevels.find(l => l.id === role);
                        return (
                        <span key={role} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
                          {role === 'user' ? 'کاربر عادی' : role === 'bot_owner' ? 'ربات‌دار' : level ? level.name : role}
                        </span>
                      )})}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingGroup(group)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => {
    if (confirm('آیا از حذف این گروه اطمینان دارید؟')) {
      setServiceGroups(serviceGroups.filter(g => g.id !== group.id));
      // remove from products
      setProducts(products.map(p => p.serviceGroupId === group.id ? { ...p, serviceGroupId: undefined } : p));
    }
  }} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
