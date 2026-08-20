import React, { useState } from 'react';
import { mockTickets, mockMessages } from '../../data';
import { Loader2, ChevronLeft, Send, User, Bot, HelpCircle, XCircle, ChevronDown, ShoppingCart } from 'lucide-react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

// Simulate an API call
const fetchTicketsPage = async (page: number, filterType: string) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const newItems = Array.from({ length: 8 }).map((_, i) => {
        const id = `t_${page}_${i}`;
        const statuses = ['open', 'answered', 'closed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        return {
          id,
          title: `تیکت پشتیبانی (شماره ${page}-${i})`,
          status,
          createdAt: `1402/10/${Math.max(1, 30 - page)}`,
          updatedAt: `1402/10/${Math.max(1, 30 - page)}`,
          userName: `کاربر ${page}-${i}`,
          userNumericId: `9${page}${i}54`,
          orderId: `ORD-${1000 + (page * 10) + i}`
        };
      });
      if (page > 4) resolve([]);
      else resolve(newItems);
    }, 800);
  });
};


export function AdminTickets() {
  const [messages, setMessages] = useState(mockMessages);
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [msgText, setMsgText] = useState('');
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [filter, setFilter] = React.useState<'all' | 'open' | 'answered' | 'closed'>('all');

  const { 
    data: tickets, 
    setData: setTickets, 
    loading, 
    lastElementRef,
    loadMore,
    reset
  } = useInfiniteScroll<any>(
    (page) => fetchTicketsPage(page, filter)
  );

  React.useEffect(() => {
    reset();
  }, [filter, reset]);

  const filteredTickets = React.useMemo(() => tickets.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  }), [tickets, filter]);


  const handleSendMessage = () => {
    if (!msgText.trim() || !activeTicket) return;

    const newMessage = {
      id: `m_${Date.now()}`,
      ticketId: activeTicket,
      sender: 'agent' as const, // Admin answers
      text: msgText,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMsgText('');
    
    // Update ticket status to answered
    setTickets(tickets.map(t => t.id === activeTicket ? { ...t, status: 'answered', updatedAt: 'همین الان' } : t));
  };

  const handleCloseTicket = () => {
    if (!activeTicket) return;
    setTickets(tickets.map(t => t.id === activeTicket ? { ...t, status: 'closed', updatedAt: 'همین الان' } : t));
    setActiveTicket(null);
  };

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
              <div className="relative mt-1">
                <button 
                  onClick={() => setIsUserInfoOpen(!isUserInfoOpen)}
                  className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 hover:bg-white/10 border border-white/5 px-2.5 py-1 rounded-md transition-colors"
                >
                  اطلاعات کاربر: {ticket?.userName || 'نامشخص'} <ChevronDown size={12} className={`transition-transform ${isUserInfoOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserInfoOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserInfoOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-white/5 space-y-2">
                        <div className="text-xs flex justify-between">
                          <span className="text-gray-500">نام:</span>
                          <span className="text-gray-300">{ticket?.userName || 'نامشخص'}</span>
                        </div>
                        <div className="text-xs flex justify-between">
                          <span className="text-gray-500">آیدی عددی:</span>
                          <span className="text-gray-300">{ticket?.userNumericId || '-'}</span>
                        </div>
                        <div className="text-xs flex justify-between">
                          <span className="text-gray-500">سفارش مرتبط:</span>
                          <span className="text-gray-300">{ticket?.orderId || '-'}</span>
                        </div>
                        <div className="text-xs flex justify-between">
                          <span className="text-gray-500">وضعیت:</span>
                          <span className="text-gray-300">{ticket?.status === 'closed' ? 'بسته شده' : 'باز'}</span>
                        </div>
                      </div>
                      <div className="p-1">
                        <button 
                          onClick={() => {
                             setIsUserInfoOpen(false);
                          }}
                          className="w-full text-right px-3 py-2 text-xs text-gray-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <User size={14} className="text-gray-400" />
                          مشاهده پروفایل کاربر
                        </button>
                        <button 
                          onClick={() => {
                             setIsUserInfoOpen(false);
                          }}
                          className="w-full text-right px-3 py-2 text-xs text-gray-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <ShoppingCart size={14} className="text-gray-400" />
                          مشاهده سفارش
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
            const isMe = msg.sender === 'agent';
            return (
              <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 relative ${
                  isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'glass-card bg-gray-800 rounded-tl-sm'
                }`}>
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400 font-medium">
                      <User size={12} className="text-gray-400" /> کاربر
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] block text-left mt-1 opacity-60 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
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
              این تیکت بسته شده است.
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="پاسخ خود را بنویسید..." 
                className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!msgText.trim()}
                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shrink-0"
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
      <div className="flex items-center gap-3 mt-2 mb-6">
        <h1 className="text-2xl font-bold">مدیریت تیکت‌ها</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors bg-blue-600 text-white">
          همه تیکت‌ها
        </button>
        <button className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors bg-white/5 text-gray-300 hover:bg-white/10">
          باز
        </button>
        <button className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors bg-white/5 text-gray-300 hover:bg-white/10">
          پاسخ داده شده
        </button>
        <button className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-colors bg-white/5 text-gray-300 hover:bg-white/10">
          بسته شده
        </button>
      </div>

      <div className="space-y-3">
        {filteredTickets.map((ticket, index) => (
          <button 
            key={ticket.id} 
            onClick={() => setActiveTicket(ticket.id)}
            ref={index === filteredTickets.length - 1 ? lastElementRef : null}
            className="w-full glass-card p-4 text-right hover:bg-white/5 transition-colors flex items-center justify-between group"
          >
            <div>
              <h3 className="font-medium text-sm mb-1 group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{ticket.updatedAt}</span>
                <span className={`px-2 py-0.5 rounded-md ${
                  ticket.status === 'answered' ? 'bg-green-500/10 text-green-400' :
                  ticket.status === 'closed' ? 'bg-gray-500/10 text-gray-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {ticket.status === 'answered' ? 'پاسخ داده شده' : ticket.status === 'closed' ? 'بسته شده' : 'باز'}
                </span>
                <span className="text-gray-400 text-[10px] mr-2 bg-white/5 px-2 py-0.5 rounded-md">
                  آیدی: {ticket.userNumericId || '-'}
                </span>
                {ticket.orderId && (
                  <span className="text-gray-400 text-[10px] bg-white/5 px-2 py-0.5 rounded-md">
                    سفارش: {ticket.orderId}
                  </span>
                )}
              </div>
            </div>
            <ChevronLeft size={18} className="text-gray-600 group-hover:text-blue-400" />
          </button>
        ))}
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
