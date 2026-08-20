import { User, Category, Product, UserProduct, Ticket, Message, ReferralUser, Transaction, PaymentCard, ServiceGroup } from './types';

export const mockUser: User = {
  id: 'u1',
  name: 'علی احمدی',
  username: '@ali_ahmadi',
  balance: 250000,
  referralCode: 'REF-84920X',
  totalReferrals: 12,
  referralIncome: 120000,
  role: 'admin',
  level: 'gold',
  totalPurchasesCount: 45,
  totalPurchasesVolume: 5000000,
};

export const mockServiceGroups: ServiceGroup[] = [
  {
    id: 'sg_1',
    name: 'سرویس‌های پایه',
    description: 'سرویس‌های معمولی با تخفیف‌های استاندارد',
    discounts: {
      'reseller_bronze': 5,
      'reseller_silver': 10,
      'reseller_gold': 15,
      'bot_owner_none': 20,
    }
  },
  {
    id: 'sg_2',
    name: 'سرویس‌های ویژه',
    description: 'تخفیف بیشتر برای نمایندگان سطح بالا',
    discounts: {
      'reseller_bronze': 10,
      'reseller_silver': 15,
      'reseller_gold': 25,
      'bot_owner_none': 30,
    }
  }
];

export const categories: Category[] = [
  { 
    id: 'personal_vpn', 
    name: 'فیلترشکن شخصی', 
    icon: 'Lock',
    subcategories: [
      { id: 'v2ray', name: 'ویتوری (V2Ray)' },
      { id: 'wireguard', name: 'وایرگارد (WireGuard)' },
      { id: 'openvpn', name: 'اوپن‌وی‌پی‌ان (OpenVPN)' }
    ]
  },
  { id: 'vpn', name: 'پنل‌های فیلترشکن', icon: 'Shield' },
  { 
    id: 'telegram', 
    name: 'خدمات تلگرام', 
    icon: 'MessageCircle',
    subcategories: [
      { id: 'channel_member', name: 'ممبر کانال' },
      { id: 'group_member', name: 'ممبر گروه' },
      { id: 'views', name: 'بازدید پست' },
      { id: 'premium', name: 'پریمیوم' }
    ]
  },
  { id: 'ai', name: 'ایجنت هوش مصنوعی', icon: 'Bot' },
  { id: 'server', name: 'سرور مجازی', icon: 'Server' },
  { id: 'virtual_number', name: 'شماره مجازی', icon: 'Phone' },
];

export const products: Product[] = [
  {
    id: 'p_1',
    categoryId: 'personal_vpn',
    subcategoryId: 'v2ray',
    name: 'کانفیگ شخصی آلمان (۱ ماهه)',
    description: 'سرور پرسرعت آلمان با آپتایم بالا مخصوص اینستاگرام و یوتیوب',
    price: 50000,
    volume: 50,
    duration: 30,
    features: ['۵۰ گیگابایت حجم', 'یک ماهه', 'اتصال دو کاربر همزمان', 'پشتیبانی ۲۴ ساعته'],
    isActive: true,
  },
  {
    id: 'p_2',
    categoryId: 'personal_vpn',
    subcategoryId: 'v2ray',
    name: 'کانفیگ شخصی هلند (۳ ماهه)',
    description: 'سرور قدرتمند هلند مناسب برای بازی و ترید',
    price: 135000,
    salePrice: 120000,
    volume: 150,
    duration: 90,
    features: ['۱۵۰ گیگابایت حجم', 'سه ماهه', 'پینگ پایین برای گیمینگ', 'بدون قطعی'],
    isActive: true,
  },
  {
    id: 'p_3',
    categoryId: 'personal_vpn',
    subcategoryId: 'wireguard',
    name: 'کانفیگ نامحدود انگلیس (۱ ماهه)',
    description: 'سرور اختصاصی انگلیس با ترافیک نامحدود منصفانه',
    price: 180000,
    volume: 0,
    duration: 30,
    features: ['حجم نامحدود', 'یک ماهه', 'مناسب برای دانلود', 'بدون قطعی'],
    isActive: true,
  },
  {
    id: 'p_4',
    categoryId: 'personal_vpn',
    subcategoryId: 'openvpn',
    name: 'کانفیگ اقتصادی فنلاند (۱ هفته)',
    description: 'مناسب برای تست و استفاده‌های کوتاه مدت',
    price: 15000,
    volume: 10,
    duration: 7,
    features: ['۱۰ گیگابایت حجم', 'یک هفته', 'مقرون به صرفه'],
    isActive: true,
  },
  {
    id: 'p_5',
    categoryId: 'personal_vpn',
    subcategoryId: 'v2ray',
    name: 'ویژه ۶ ماهه ترکیه',
    description: 'مخصوص دور زدن تحریم‌های گیم و نتفلیکس',
    price: 250000,
    salePrice: 210000,
    volume: 300,
    duration: 180,
    features: ['۳۰۰ گیگابایت حجم', 'شش ماهه', 'ترافیک نیم‌بها برای گیم', 'اتصال ۴ کاربر'],
    isActive: true,
  },
  {
    id: 'p_6',
    categoryId: 'personal_vpn',
    subcategoryId: 'wireguard',
    name: 'کانفیگ حجمی (نامحدود زمانی)',
    description: 'پرداخت به ازای مصرف با زمان بی‌نهایت',
    price: 10000,
    volume: -1,
    duration: -1,
    features: ['حجم پرداخت به ازای مصرف', 'زمان: ∞ (نامحدود)', 'ترافیک محاسبه شده بر اساس مصرف'],
    isActive: true,
  },
  {
    id: 'p_7',
    categoryId: 'telegram',
    subcategoryId: 'channel_member',
    name: '۱۰۰۰ ممبر واقعی کانال',
    description: 'ممبر واقعی و فعال ایرانی با ریزش کم',
    price: 150000,
    features: ['شروع فوری', 'ریزش زیر ۱۰٪', 'بدون نیاز به پسورد'],
    isActive: true,
  },
  {
    id: 'p_8',
    categoryId: 'telegram',
    subcategoryId: 'premium',
    name: 'تلگرام پریمیوم ۱ ماهه',
    description: 'فعال‌سازی قانونی روی اکانت شخصی شما',
    price: 350000,
    features: ['فعال‌سازی سریع', 'بدون قطعی', 'قابل تمدید'],
    isActive: true,
  }
];

export const userProducts: UserProduct[] = [
  {
    id: 'up_1',
    productId: 'p_1',
    categoryId: 'personal_vpn',
    name: 'کانفیگ شخصی آلمان',
    status: 'active',
    expiryDate: '1402/11/15',
    usageCurrent: '12 GB',
    usageLimit: '50 GB',
    configLink: 'vless://mock-link-1@server.test:443?type=tcp&security=tls#Germany',
    configName: 'Germany_VLESS'
  },
  {
    id: 'up_2',
    productId: 'p_2',
    categoryId: 'personal_vpn',
    name: 'کانفیگ شخصی هلند',
    status: 'active',
    expiryDate: '1402/12/01',
    usageCurrent: '45 GB',
    usageLimit: '150 GB',
    configLink: 'vless://mock-link-2@server.test:443?type=tcp&security=tls#Netherlands',
    configName: 'Netherlands_VLESS'
  },
  {
    id: 'up_3',
    productId: 'p_6',
    categoryId: 'personal_vpn',
    name: 'کانفیگ حجمی (نامحدود زمانی)',
    status: 'active',
    expiryDate: 'نامحدود (∞)',
    usageCurrent: '5 GB',
    usageLimit: 'نامحدود (∞)',
    configLink: 'vless://mock-link-3@server.test:443?type=tcp&security=tls#PayAsYouGo',
    configName: 'PayAsYouGo_VLESS'
  }
];

export const mockTickets: Ticket[] = [
  { id: 't_1', title: 'مشکل در اتصال به سرور آلمان', status: 'open', createdAt: '1402/10/12', updatedAt: '1402/10/12', userName: 'علی رضایی', userNumericId: '123456', orderId: 'ORD-8943' },
  { id: 't_2', title: 'سوال درباره تمدید سرویس', status: 'closed', createdAt: '1402/10/10', updatedAt: '1402/10/11', userName: 'محمد احمدی', userNumericId: '987654', orderId: 'ORD-1234' }
];

export const mockMessages: Message[] = [
  { id: 'm_1', ticketId: 't_1', sender: 'user', text: 'سلام، من از دیروز نمیتونم به سرور آلمان وصل بشم.', timestamp: '10:30' },
  { id: 'm_2', ticketId: 't_1', sender: 'agent', text: 'سلام کاربر عزیز، در حال بررسی مشکل هستیم.', timestamp: '10:45' },
  { id: 'm_3', ticketId: 't_2', sender: 'user', text: 'چطور میتونم سرویسم رو تمدید کنم؟', timestamp: '09:00' },
  { id: 'm_4', ticketId: 't_2', sender: 'agent', text: 'از بخش سرویس‌های من روی دکمه تمدید کلیک کنید.', timestamp: '09:15' }
];

export const mockReferrals: ReferralUser[] = [];

export const mockTransactions: Transaction[] = [];

export const mockPaymentCards: PaymentCard[] = [];
