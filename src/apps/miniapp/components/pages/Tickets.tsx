import React, { useState } from 'react';
import { mockTickets, mockMessages, userProducts, categories } from '../../data';
import { MessageSquare, XCircle, Plus, ChevronLeft, Send, Bot, User, HelpCircle, X } from 'lucide-react';

export function Tickets() {
  const [tickets, setTickets] = useState(mockTickets);
  const [messages, setMessages] = useState(mockMessages);
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [msgText, setMsgText] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTicketTopic, setNewTicketTopic] = useState('');
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  const handleCreateTicket = () => {
    if (!newTicketTopic || !newTicketTitle || !newTicketMessage) return;

    const newTicketId = `t_${Date.now()}`;
    const newTicket = {
      id: newTicketId,
      title: newTicketTitle,
      status: 'open' as const,
      createdAt: 'همین الان',
      updatedAt: 'همین الان',
    };

    const newMessage = {
      id: `m_${Date.now()}`,
      ticketId: newTicketId,
      sender: 'user' as const,
      text: newTicketMessage,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setTickets([newTicket, ...tickets]);
    setMessages([...messages, newMessage]);
    setIsCreating(false);
    setNewTicketTopic('');
    setNewTicketTitle('');
    setNewTicketMessage('');
    setActiveTicket(newTicketId);
  };

  const handleSendMessage = () => {
    if (!msgText || !activeTicket) return;
    
    const newMessage = {
      id: `m_${Date.now()}`,
      ticketId: activeTicket,
      sender: 'user' as const,
      text: msgText,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMsgText('');
  };

  const handleCloseTicket = () => {
    if (confirm('آیا از بستن این تیکت اطمینان دارید؟')) {
      setTickets(tickets.map(t => t.id === activeTicket ? { ...t, status: 'closed' } : t));
    }
  };

  if (isCreating) {
    return (
      <div className="flex flex-col h-[calc(100vh-80px)] animate-in slide-in-from-bottom-4 duration-300">
        <div className="glass p-4 flex items-center justify-between sticky top-0 z-10 border-b border-white/5">
          <h2 className="font-bold">ایجاد تیکت جدید</h2>
          <button onClick={() => setIsCreating(false)} className="p-1 hover:bg-white/10 rounded-lg">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">موضوع پشتیبانی (سرویس یا دسته)</label>
            <select 
              value={newTicketTopic}
              onChange={(e) => setNewTicketTopic(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">انتخاب کنید...</option>
              <optgroup label="سرویس‌های من">
                {userProducts.map(up => (
                  <option key={up.id} value={`up_${up.id}`}>{up.name}</option>
                ))}
              </optgroup>
              <optgroup label="سوالات کلی (دسته‌بندی‌ها)">
                {categories.map(cat => (
                  <option key={cat.id} value={`cat_${cat.id}`}>{cat.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">عنوان تیکت</label>
            <input 
              type="text" 
              value={newTicketTitle}
              onChange={(e) => setNewTicketTitle(e.target.value)}
              placeholder="مثلا: مشکل در اتصال به سرور"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">پیام شما</label>
            <textarea 
              value={newTicketMessage}
              onChange={(e) => setNewTicketMessage(e.target.value)}
              placeholder="لطفا مشکل خود را کامل توضیح دهید..."
              rows={5}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          <button 
            onClick={handleCreateTicket}
            disabled={!newTicketTopic || !newTicketTitle || !newTicketMessage}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-colors mt-4"
          >
            ثبت تیکت و شروع گفتگو
          </button>
        </div>
      </div>
    );
  }

  if (activeTicket) {
    const ticketMsgs = messages.filter(m => m.ticketId === activeTicket);
    const ticket = tickets.find(t => t.id === activeTicket);

    return (
      <div className="flex flex-col h-[calc(100vh-80px)] animate-in slide-in-from-right-4 duration-300">
        {/* Chat Header */}
        <div className="glass p-4 flex items-center justify-between sticky top-0 z-10 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTicket(null)} className="p-1 hover:bg-white/10 rounded-lg">
              <ChevronLeft size={24} className="text-gray-400 rotate-180" />
            </button>
            <div>
              <h2 className="font-bold text-sm truncate max-w-[200px]">{ticket?.title}</h2>
              <span className="text-[10px] text-gray-400">وضعیت: {ticket?.status === 'closed' ? 'بسته شده' : 'در حال بررسی'}</span>
            </div>
          </div>
          {ticket?.status !== 'closed' && (
            <button 
              onClick={handleCloseTicket}
              className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-1 rounded-lg transition-colors"
            >
              <XCircle size={14} />
              بستن تیکت
            </button>
          )}
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {ticketMsgs.map(msg => {
            const isMe = msg.sender === 'user';
            const isAi = msg.sender === 'agent';

            return (
              <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 relative ${
                  isMe ? 'bg-purple-600 text-white rounded-tr-sm' : 'glass-card bg-gray-800 rounded-tl-sm'
                }`}>
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400 font-medium">
                      {isAi ? <Bot size={12} className="text-blue-400" /> : <HelpCircle size={12} className="text-green-400" />}
                      {isAi ? 'دستیار هوشمند' : 'پشتیبان فنی'}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] block text-left mt-1 opacity-60 ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-gray-950 border-t border-white/5">
          {ticket?.status === 'closed' ? (
            <div className="text-center p-3 rounded-xl bg-white/5 text-gray-500 text-sm">
              این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد.
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="پیام خود را بنویسید..." 
                className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!msgText.trim()}
                className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white hover:bg-purple-500 disabled:opacity-50 transition-colors shrink-0"
              >
                <Send size={18} className="mr-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mt-2 mb-6">
        <h1 className="text-2xl font-bold">پشتیبانی</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-purple-600/20 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-purple-600/30 transition-colors"
        >
          <Plus size={14} />
          تیکت جدید
        </button>
      </div>

      <div className="space-y-3">
        {tickets.map(ticket => (
          <button 
            key={ticket.id} 
            onClick={() => setActiveTicket(ticket.id)}
            className="w-full glass-card p-4 text-right hover:bg-white/5 transition-colors flex items-center justify-between group"
          >
            <div>
              <h3 className="font-medium text-sm mb-1 group-hover:text-purple-400 transition-colors">{ticket.title}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{ticket.updatedAt}</span>
                <span className={`px-2 py-0.5 rounded-md ${
                  ticket.status === 'answered' ? 'bg-green-500/10 text-green-400' :
                  ticket.status === 'closed' ? 'bg-gray-500/10 text-gray-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {ticket.status === 'answered' ? 'پاسخ داده شده' : ticket.status === 'closed' ? 'بسته شده' : 'باز'}
                </span>
              </div>
            </div>
            <ChevronLeft size={18} className="text-gray-600 group-hover:text-purple-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
