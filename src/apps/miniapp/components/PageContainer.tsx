import React from 'react';
import { Tab, Product, ServiceGroup, ResellerLevel } from '../types';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Shop = lazy(() => import('./pages/Shop').then(module => ({ default: module.Shop })));
const MyProducts = lazy(() => import('./pages/MyProducts').then(module => ({ default: module.MyProducts })));
const Tickets = lazy(() => import('./pages/Tickets').then(module => ({ default: module.Tickets })));
const Referral = lazy(() => import('./pages/Referral').then(module => ({ default: module.Referral })));
const Transactions = lazy(() => import('./pages/Transactions').then(module => ({ default: module.Transactions })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const AdminSettings = lazy(() => import('./pages/AdminSettings').then(module => ({ default: module.AdminSettings })));
const AdminProfit = lazy(() => import('./pages/AdminProfit').then(module => ({ default: module.AdminProfit })));
const AdminUsers = lazy(() => import('./pages/AdminUsers').then(module => ({ default: module.AdminUsers })));
const AdminTickets = lazy(() => import('./pages/AdminTickets').then(module => ({ default: module.AdminTickets })));
const AdminTransactions = lazy(() => import('./pages/AdminTransactions').then(module => ({ default: module.AdminTransactions })));

















interface PageContainerProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  serviceGroups: ServiceGroup[];
  setServiceGroups: (groups: ServiceGroup[]) => void;
  resellerLevels: ResellerLevel[];
  setResellerLevels: (levels: ResellerLevel[]) => void;
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

export function PageContainer({ currentTab, setCurrentTab, products, setProducts, serviceGroups, setServiceGroups, resellerLevels, setResellerLevels }: PageContainerProps) {
  return (
    <div className="pb-24 w-full max-w-md mx-auto min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      }>
      {currentTab === 'home' && <Home onNavigate={setCurrentTab} />}
      {currentTab === 'shop' && <Shop onNavigate={setCurrentTab} products={products} serviceGroups={serviceGroups} />}
      {currentTab === 'admin' && <Admin products={products} setProducts={setProducts} serviceGroups={serviceGroups} setServiceGroups={setServiceGroups} resellerLevels={resellerLevels} />}

      {currentTab === 'admin_panels' && <Admin products={products} setProducts={setProducts} serviceGroups={serviceGroups} setServiceGroups={setServiceGroups} resellerLevels={resellerLevels} />}
      {currentTab === 'admin_settings' && <AdminSettings resellerLevels={resellerLevels} setResellerLevels={setResellerLevels} />}
      {currentTab === 'admin_profit' && <AdminProfit products={products} setProducts={setProducts} />}
      
      {currentTab === 'admin_users' && <AdminUsers resellerLevels={resellerLevels} />}
      {currentTab === 'admin_tickets' && <AdminTickets />}
      {currentTab === 'admin_transactions' && <AdminTransactions />}

      {currentTab === 'products' && <MyProducts />}
      {currentTab === 'tickets' && <Tickets />}
      {currentTab === 'referral' && <Referral />}
      {currentTab === 'transactions' && <Transactions onNavigate={setCurrentTab} />}
      </Suspense>
    </div>
  );
}
