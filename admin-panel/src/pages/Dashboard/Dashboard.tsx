import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Timeline, Button, Modal, Upload, message, Avatar, Rate, Typography, Image } from 'antd';
import { 
  ShopOutlined, 
  EyeOutlined, 
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  UploadOutlined,
  CameraOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockDashboardMetrics } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';

const { Text } = Typography;

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const metrics = mockDashboardMetrics;
  const [editingBusinessPhoto, setEditingBusinessPhoto] = useState<any>(null);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  // Mock chart data
  const viewsData = [
    { date: '03/19', views: 1200, clicks: 89 },
    { date: '03/20', views: 1890, clicks: 134 },
    { date: '03/21', views: 2340, clicks: 156 },
    { date: '03/22', views: 1980, clicks: 142 },
    { date: '03/23', views: 2100, clicks: 167 },
    { date: '03/24', views: 2450, clicks: 189 },
    { date: '03/25', views: 2340, clicks: 156 },
  ];

  // Mock data for weekly comparison
  const weeklyComparison = {
    totalBusinesses: { current: 156, lastWeek: 139, change: 12.2 },
    publishedBusinesses: { current: 123, lastWeek: 118, change: 4.2 },
    todayViews: { current: 2340, lastWeek: 2167, change: 8.0 },
    runningEvents: { current: 10, lastWeek: 8, change: 25.0 },
  };

  const handleEditPhoto = (business: any) => {
    setEditingBusinessPhoto(business);
    setIsPhotoModalVisible(true);
  };

  const handlePhotoUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上傳成功`);
      setIsPhotoModalVisible(false);
      setEditingBusinessPhoto(null);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上傳失敗`);
    }
  };

  const topBusinessesColumns = [
    {
      title: t('business.businessPhoto'),
      key: 'photo',
      width: 80,
      render: (_: any, record: any) => (
        <div style={{ position: 'relative' }}>
          <Avatar
            size={60}
            shape="square"
            src={record.photos?.[0]}
            icon={<CameraOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => handleEditPhoto(record)}
          />
          <Button
            size="small"
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            style={{
              position: 'absolute',
              bottom: -5,
              right: -5,
              width: 20,
              height: 20,
              fontSize: 10
            }}
            onClick={() => handleEditPhoto(record)}
          />
        </div>
      ),
    },
    {
      title: t('business.businessInfo'),
      key: 'info',
      width: 280,
      render: (_: any, record: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text strong style={{ fontSize: 16 }}>{record.name}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.address?.length > 25 ? `${record.address.substring(0, 25)}...` : record.address}
          </Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="blue">{record.category}</Tag>
            {record.rating && (
              <span style={{ marginLeft: 8 }}>
                <Rate disabled defaultValue={record.rating} style={{ fontSize: 12 }} />
                <Text type="secondary" style={{ marginLeft: 4, fontSize: 12 }}>
                  ({record.reviewCount})
                </Text>
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('table.views'),
      key: 'views',
      width: 100,
      sorter: (a: any, b: any) => (a.analytics?.views || 0) - (b.analytics?.views || 0),
      render: (_: any, record: any) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
            {(record.analytics?.views || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#666' }}>{t('table.browse')}</div>
        </div>
      ),
    },
    {
      title: t('table.clickThroughRate'),
      key: 'clickThroughRate',
      width: 100,
      sorter: (a: any, b: any) => (a.analytics?.clickThroughRate || 0) - (b.analytics?.clickThroughRate || 0),
      render: (_: any, record: any) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#722ed1' }}>
            {(record.analytics?.clickThroughRate || 0).toFixed(1)}%
          </div>
          <div style={{ fontSize: 11, color: '#666' }}>{t('table.ctr')}</div>
        </div>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          published: { color: 'green', text: t('business.published') },
          approved: { color: 'blue', text: t('business.approved') },
          pending: { color: 'orange', text: t('business.pending') },
          rejected: { color: 'red', text: t('business.rejected') },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const renderPercentageChange = (data: any) => {
    const isPositive = data.change > 0;
    const icon = isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
    
    return (
      <span style={{ fontSize: 12, color: '#666' }}>
        {icon} {Math.abs(data.change)}% {t('dashboard.compareLastWeek')}
      </span>
    );
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>{t('dashboard.title')}</h1>
      
      {/* 核心指標卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalBusinesses')}
              value={weeklyComparison.totalBusinesses.current}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={renderPercentageChange(weeklyComparison.totalBusinesses)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.publishedBusinesses')}
              value={weeklyComparison.publishedBusinesses.current}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={renderPercentageChange(weeklyComparison.publishedBusinesses)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.todayViews')}
              value={weeklyComparison.todayViews.current}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix={renderPercentageChange(weeklyComparison.todayViews)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.runningEvents')}
              value={weeklyComparison.runningEvents.current}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={renderPercentageChange(weeklyComparison.runningEvents)}
            />
          </Card>
        </Col>
      </Row>

      {/* 流量趨勢圖 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title={t('dashboard.trafficTrend')} extra={<a href="#">{t('dashboard.viewDetails')}</a>}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  name={t('common.views')}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#52c41a" 
                  strokeWidth={2}
                  name={t('common.clicks')}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* 熱門商家排行 */}
        <Col xs={24} lg={16}>
          <Card title={t('dashboard.topBusinesses')} extra={<a href="#">{t('dashboard.viewAll')}</a>}>
            <Table
              columns={topBusinessesColumns}
              dataSource={metrics.topBusinesses}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>

        {/* 最近活動 */}
        <Col xs={24} lg={8}>
          <Card title={t('dashboard.recentActivity')} extra={<a href="#">{t('dashboard.viewAll')}</a>} style={{ marginBottom: 16 }}>
            <Timeline
              items={metrics.recentActivity.slice(0, 4).map(activity => ({
                children: (
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{activity.action}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>
                      {activity.target} - {activity.user}
                    </div>
                    <div style={{ fontSize: 11, color: '#999' }}>
                      {new Date(activity.timestamp).toLocaleString('zh-TW')}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
          
          {/* 待處理事項 */}
          <Card title={t('dashboard.pendingTasks')}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card size="small">
                  <Statistic
                    title={t('dashboard.pendingBusinesses')}
                    value={metrics.pendingBusinesses}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card size="small">
                  <Statistic
                    title={t('dashboard.activeEvents')}
                    value={metrics.activeEvents}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 快速操作面板 - 移到最下面 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="快速操作" extra={<a href="#">管理中心</a>}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8} lg={6}>
                <Card 
                  size="small" 
                  hoverable
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/businesses/new'}
                >
                  <ShopOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                  <div style={{ fontWeight: 'bold' }}>新增商家</div>
                  <div style={{ fontSize: 12, color: '#666' }}>快速添加新商家</div>
                </Card>
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <Card 
                  size="small" 
                  hoverable
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/events/new'}
                >
                  <CalendarOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                  <div style={{ fontWeight: 'bold' }}>創建活動</div>
                  <div style={{ fontSize: 12, color: '#666' }}>策劃新活動</div>
                </Card>
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <Card 
                  size="small" 
                  hoverable
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/batch-upload'}
                >
                  <UploadOutlined style={{ fontSize: 24, color: '#fa8c16', marginBottom: 8 }} />
                  <div style={{ fontWeight: 'bold' }}>批次上傳</div>
                  <div style={{ fontSize: 12, color: '#666' }}>大量匯入商家</div>
                </Card>
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <Card 
                  size="small" 
                  hoverable
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/businesses?status=pending'}
                >
                  <EditOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 8 }} />
                  <div style={{ fontWeight: 'bold' }}>待審核</div>
                  <div style={{ fontSize: 12, color: '#666' }}>處理待審商家</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 照片編輯彈窗 */}
      <Modal
        title={`${t('business.editPhotoTitle')} - ${editingBusinessPhoto?.name || ''}`}
        open={isPhotoModalVisible}
        onCancel={() => setIsPhotoModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center' }}>
          {editingBusinessPhoto?.photos?.[0] && (
            <Image
              src={editingBusinessPhoto.photos[0]}
              alt={t('business.currentPhoto')}
              style={{ marginBottom: 16, maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }}
            />
          )}
          <Upload
            name="photo"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            onChange={handlePhotoUpload}
            showUploadList={false}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>{t('business.uploadNewPhoto')}</div>
            </div>
          </Upload>
          <p style={{ marginTop: 16, color: '#666', fontSize: 12 }}>
            {t('business.photoTip')}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard; 