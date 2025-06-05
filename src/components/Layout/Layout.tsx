import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Dropdown, Button, Select, Space, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShopOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TagsOutlined,
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useLanguage } from '../../contexts/LanguageContext';

const { Header, Sider, Content } = AntLayout;
const { Option } = Select;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t('nav.dashboard'),
    },
    {
      key: '/businesses',
      icon: <ShopOutlined />,
      label: t('nav.business'),
    },
    {
      key: '/batch-upload',
      icon: <UploadOutlined />,
      label: t('nav.batchUpload'),
    },
    {
      key: '/events',
      icon: <CalendarOutlined />,
      label: t('nav.events'),
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: t('nav.analytics'),
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: t('nav.categories'),
    },
    {
      key: '/tags',
      icon: <TagsOutlined />,
      label: t('nav.tags'),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('common.profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('common.logout'),
      danger: true,
    },
  ];

  const languageOptions = [
    { value: 'zh', label: '中文', flag: '🇹🇼' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // Handle logout
      console.log('Logout clicked');
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as any);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          fontSize: collapsed ? 16 : 20,
          fontWeight: 'bold',
          color: token.colorPrimary,
        }}>
          {collapsed ? 'DMO' : 'DMO CMS'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <AntLayout>
        <Header style={{ 
          padding: '0 16px', 
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            
            {/* Language Selector */}
            <Select
              value={language}
              onChange={handleLanguageChange}
              style={{ width: 120 }}
              size="small"
              suffixIcon={<GlobalOutlined />}
            >
              {languageOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Space>
                    <span>{option.flag}</span>
                    <span>{option.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: token.colorTextSecondary }}>
              {t('common.welcome')}
            </span>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <Button type="text" style={{ color: token.colorTextSecondary }}>
                {t('common.administrator')} ▼
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: 24, 
          padding: 24, 
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          minHeight: 280,
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 