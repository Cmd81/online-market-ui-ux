export type Tab = 'home' | 'shop' | 'admin' | 'products' | 'tickets' | 'referral' | 'transactions' | 'admin_settings' | 'admin_panels' | 'admin_profit' | 'admin_users' | 'admin_tickets' | 'admin_transactions';

export type UserRole = 'user' | 'reseller' | 'bot_owner' | 'admin' | 'support';
export type UserLevel = string;

export interface User {
  id: string;
  name: string;
  username: string;
  balance: number;
  referralCode: string;
  totalReferrals: number;
  referralIncome: number;
  role?: UserRole;
  hasBot?: boolean;
  level?: UserLevel;
  totalPurchasesCount?: number;
  totalPurchasesVolume?: number;
}

export interface ServiceGroup {
  id: string;
  name: string;
  description: string;
  discounts: Record<string, number>;
  allowedRoles?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: { id: string; name: string; }[];
}

export interface Product {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  serviceGroupId?: string;
  unit?: string;
  features: string[];
  panelUrl?: string;
  usageLimit?: string;
  serverAddress?: string;
  volume?: number;
  duration?: number;
  panelUsername?: string;
  panelPassword?: string;
  apiParams?: string;
  panelType?: 'marzneshin' | 'elan';
  apiKey?: string;
  pricingMethod?: 'usage' | 'account';
  selectedInbounds?: string[];
  // New nested entities for Panel-based products
  plans?: any[];
  templates?: any[];
  isActive?: boolean;
}

export interface UserProduct {
  id: string;
  productId: string;
  name: string;
  status: 'active' | 'expired' | 'pending' | 'paused';
  categoryId?: string;
  expiryDate?: string;
  usageLimit?: string;
  usageCurrent?: string;
  panelUrl?: string;
  username?: string;
  password?: string;
  configLink?: string;
  configName?: string;
}

export interface Ticket {
  id: string;
  title: string;
  userId?: string;
  userName?: string;
  userNumericId?: string;
  orderId?: string;
  status: 'open' | 'closed' | 'answered';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  ticketId: string;
  sender: 'user' | 'agent' | 'human';
  text: string;
  timestamp: string;
}

export interface ReferralUser {
  id: string;
  name: string;
  joinDate: string;
  rewardEarned: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'purchase' | 'usage_deduction' | 'referral_reward';
  amount: number;
  description: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  userId?: string;
  userName?: string;
}

export interface PaymentCard {
  id: string;
  cardNumber: string;
  ownerName: string;
  bankName: string;
  isActive: boolean;
}

export interface ResellerLevel {
  id: string;
  name: string;
  isFixed?: boolean;
  userCount?: number;
  levelNumber: number;
}
