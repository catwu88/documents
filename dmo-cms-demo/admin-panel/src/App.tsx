import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import BusinessList from './pages/Business/BusinessList';
import BusinessDetail from './pages/Business/BusinessDetail';
import BatchUpload from './pages/BatchUpload/BatchUpload';
import EventList from './pages/Event/EventList';
import EventDetail from './pages/Event/EventDetail';
import Analytics from './pages/Analytics/Analytics';
import LabelManagement from './pages/Labels/LabelManagement';
import CategoryManagement from './pages/Categories/CategoryManagement';
import Login from './pages/Login/Login';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './App.css';

// 受保護的路由組件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('dmo_cms_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// 主要應用組件
const AppContent: React.FC = () => {
  const { language } = useLanguage();
  
  const getAntdLocale = () => {
    switch (language) {
      case 'en':
        return enUS;
      case 'ja':
        return jaJP;
      case 'zh':
      default:
        return zhTW;
    }
  };

  return (
    <ConfigProvider locale={getAntdLocale()}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/businesses" element={<BusinessList />} />
          <Route path="/businesses/:id" element={<BusinessDetail />} />
          <Route path="/batch-upload" element={<BatchUpload />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tags" element={<LabelManagement />} />
          <Route path="/categories" element={<CategoryManagement />} />
        </Routes>
      </Layout>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('dmo_cms_token');
    setIsAuthenticated(!!token);
  }, []);

  // 載入中狀態
  if (isAuthenticated === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: 18
      }}>
        載入中...
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } 
          />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App; 