import React, { useState, useEffect } from 'react';
import { Tab, Product, ServiceGroup, ResellerLevel } from './types';
import { products as initialProducts, mockServiceGroups } from './data';
import { BottomNav } from './components/BottomNav';
import { AdminBottomNav } from './components/AdminBottomNav';
import { PageContainer } from './components/PageContainer';
import { SkeletonHome } from './components/SkeletonHome';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [isReady, setIsReady] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
    const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>(mockServiceGroups);
  const [resellerLevels, setResellerLevels] = useState<ResellerLevel[]>([
    { id: 'l1', name: 'نماینده عادی', isFixed: true, userCount: 156, levelNumber: 1 },
    { id: 'l2', name: 'نماینده برنزی', userCount: 42, levelNumber: 2 }
  ]);

  useEffect(() => {
    // Notify Telegram WebApp that the app is ready
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      // Set header color to match dark theme
      window.Telegram.WebApp.setHeaderColor('#030712');
    }

    // Simulate initial data fetching
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500); // 1.5 seconds loading simulation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] font-sans text-gray-100 overflow-x-hidden selection:bg-purple-500/30">
      {/* Background decorations */}
      <div className="mesh-bg"></div>

      <div className="relative z-10 h-full">
        {!isReady ? (
          <SkeletonHome />
        ) : (
          <PageContainer currentTab={currentTab} setCurrentTab={setCurrentTab} products={products} setProducts={setProducts} serviceGroups={serviceGroups} setServiceGroups={setServiceGroups} resellerLevels={resellerLevels} setResellerLevels={setResellerLevels} />
        )}
      </div>
      
      {isReady && (currentTab.startsWith('admin') ? <AdminBottomNav currentTab={currentTab} onTabChange={setCurrentTab} /> : <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />)}
    </div>
  );
}
