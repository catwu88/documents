import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      // 模擬登入API調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 簡單的模擬驗證
      if (values.username === 'admin' && values.password === 'admin123') {
        localStorage.setItem('dmo_cms_token', 'demo_token');
        localStorage.setItem('dmo_cms_user', JSON.stringify({
          id: '1',
          username: 'admin',
          name: '王小明',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        }));
        message.success('登入成功！');
        navigate('/');
      } else {
        message.error('帳號或密碼錯誤');
      }
    } catch (error) {
      message.error('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 16,
          border: 'none'
        }}
        bodyStyle={{ padding: '40px 32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#1890ff',
            marginBottom: 8
          }}>
            DMO CMS
          </div>
          <div style={{
            fontSize: 16,
            color: '#666',
            marginBottom: 24
          }}>
            目的地管理系統
          </div>
        </div>

        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '請輸入帳號' },
              { min: 3, message: '帳號至少需要3個字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder="帳號"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '請輸入密碼' },
              { min: 6, message: '密碼至少需要6個字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="密碼"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>記住我</Checkbox>
              </Form.Item>
              <a href="#" style={{ color: '#1890ff' }}>忘記密碼？</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              登入
            </Button>
          </Form.Item>
        </Form>

        <div style={{
          textAlign: 'center',
          marginTop: 24,
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0',
          color: '#666',
          fontSize: 14
        }}>
          <div style={{ marginBottom: 8 }}>測試帳號資訊：</div>
          <div>帳號：<code>admin</code></div>
          <div>密碼：<code>admin123</code></div>
        </div>
      </Card>
    </div>
  );
};

export default Login; 