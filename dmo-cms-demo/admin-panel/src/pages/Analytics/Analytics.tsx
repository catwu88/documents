import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  DatePicker,
  Table,
  Progress,
  Tag,
  Space,
  Button,
  Tooltip
} from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  DownloadOutlined,
  EyeOutlined,
  UserOutlined,
  ShopOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['visitors', 'pageViews']); // 改為多選數組

  // 處理指標選擇變更
  const handleMetricChange = (value: string[]) => {
    setSelectedMetrics(value);
  };

  // 改善的模擬數據
  const trafficData = [
    { date: '01/01', visitors: 1200, pageViews: 3400, businesses: 450, events: 120 },
    { date: '01/02', visitors: 1350, pageViews: 3850, businesses: 480, events: 135 },
    { date: '01/03', visitors: 1100, pageViews: 3200, businesses: 420, events: 95 },
    { date: '01/04', visitors: 1450, pageViews: 4100, businesses: 520, events: 180 },
    { date: '01/05', visitors: 1600, pageViews: 4500, businesses: 580, events: 220 },
    { date: '01/06', visitors: 1380, pageViews: 3900, businesses: 490, events: 160 },
    { date: '01/07', visitors: 1520, pageViews: 4200, businesses: 550, events: 200 },
  ];

  const categoryData = [
    { name: '餐飲', value: 35, color: '#8884d8' },
    { name: '購物', value: 25, color: '#82ca9d' },
    { name: '景點', value: 20, color: '#ffc658' },
    { name: '文化', value: 15, color: '#ff7300' },
    { name: '其他', value: 5, color: '#00ff00' },
  ];

  const topBusinesses = [
    { id: 1, name: '台北101觀景台', category: '景點', views: 15420, rating: 4.8, growth: 12.5 },
    { id: 2, name: '鼎泰豐', category: '餐飲', views: 12350, rating: 4.7, growth: 8.3 },
    { id: 3, name: '誠品書店', category: '購物', views: 9870, rating: 4.6, growth: -2.1 },
    { id: 4, name: '故宮博物院', category: '文化', views: 8920, rating: 4.9, growth: 15.7 },
    { id: 5, name: '西門町', category: '購物', views: 7650, rating: 4.4, growth: 5.2 },
  ];

  const eventMetrics = [
    { month: '1月', published: 25, attended: 1250, cancelled: 2 },
    { month: '2月', published: 30, attended: 1580, cancelled: 1 },
    { month: '3月', published: 28, attended: 1420, cancelled: 3 },
    { month: '4月', published: 35, attended: 1890, cancelled: 2 },
    { month: '5月', published: 32, attended: 1650, cancelled: 1 },
    { month: '6月', published: 38, attended: 2100, cancelled: 4 },
  ];

  const deviceData = [
    { device: '手機', percentage: 65, sessions: 8500 },
    { device: '電腦', percentage: 25, sessions: 3200 },
    { device: '平板', percentage: 10, sessions: 1300 },
  ];

  const topBusinessColumns = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'rank',
      render: (id: number) => (
        <div style={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%', 
          backgroundColor: id <= 3 ? '#1890ff' : '#f0f0f0',
          color: id <= 3 ? 'white' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          {id}
        </div>
      ),
    },
    {
      title: '商家名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分類',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '瀏覽次數',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: '評分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => `${rating} ⭐`,
    },
    {
      title: (
        <Tooltip title="相較於上個月同期的瀏覽量變化百分比">
          成長率 ℹ️
        </Tooltip>
      ),
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <span style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
          {growth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(growth)}%
        </span>
      ),
    },
  ];

  const exportData = () => {
    // 模擬導出功能
    console.log('導出分析報告...');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>數據分析</h1>
        <Space>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            <Option value="7d">近7天</Option>
            <Option value="30d">近30天</Option>
            <Option value="90d">近90天</Option>
            <Option value="1y">近1年</Option>
          </Select>
          <RangePicker />
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={exportData}
          >
            導出報告
          </Button>
        </Space>
      </div>

      {/* 核心指標 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="總瀏覽量"
              value={125420}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<EyeOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 12.5%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="獨立訪客"
              value={45280}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 8.3%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="總點擊量"
              value={28450}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
              prefix={<ShopOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 22.8%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="總收藏數"
              value={8650}
              precision={0}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<HeartOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 18.7%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 流量趨勢 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card 
            title="流量趨勢" 
            extra={
              <Select 
                mode="multiple"
                value={selectedMetrics} 
                onChange={handleMetricChange}
                style={{ width: 240 }}
                placeholder="選擇要顯示的指標"
                maxTagCount={2}
              >
                <Option value="visitors">訪客數</Option>
                <Option value="pageViews">頁面瀏覽量</Option>
                <Option value="businesses">商家瀏覽</Option>
                <Option value="events">活動瀏覽</Option>
              </Select>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart 
                data={trafficData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: any, name: string) => {
                    const labels: Record<string, string> = {
                      visitors: '訪客數',
                      pageViews: '頁面瀏覽量',
                      businesses: '商家瀏覽',
                      events: '活動瀏覽'
                    };
                    return [value.toLocaleString(), labels[name] || name];
                  }}
                  labelFormatter={(label) => `日期: ${label}`}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                {selectedMetrics.includes('visitors') && (
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#1890ff" 
                    fill="#1890ff"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="訪客數"
                  />
                )}
                {selectedMetrics.includes('pageViews') && (
                  <Area 
                    type="monotone" 
                    dataKey="pageViews" 
                    stroke="#52c41a" 
                    fill="#52c41a"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="頁面瀏覽量"
                  />
                )}
                {selectedMetrics.includes('businesses') && (
                  <Area 
                    type="monotone" 
                    dataKey="businesses" 
                    stroke="#722ed1" 
                    fill="#722ed1"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="商家瀏覽"
                  />
                )}
                {selectedMetrics.includes('events') && (
                  <Area 
                    type="monotone" 
                    dataKey="events" 
                    stroke="#fa8c16" 
                    fill="#fa8c16"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="活動瀏覽"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 分類分布 */}
        <Col span={8}>
          <Card title="商家分類分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        {/* 熱門商家排行 */}
        <Col span={12}>
          <Card 
            title="熱門商家排行" 
            extra={<a>查看更多</a>}
          >
            <div style={{ marginBottom: 16, fontSize: 12, color: '#666' }}>
              * 成長率為相較於上個月同期的瀏覽量變化
            </div>
            <Table
              columns={topBusinessColumns}
              dataSource={topBusinesses}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 設備使用統計 */}
        <Col span={12}>
          <Card title="設備使用統計">
            <div style={{ padding: '20px 0' }}>
              {deviceData.map((device, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>{device.device}</span>
                    <span>{device.percentage}% ({device.sessions.toLocaleString()} 次數)</span>
                  </div>
                  <Progress 
                    percent={device.percentage} 
                    showInfo={false}
                    strokeColor={index === 0 ? '#1890ff' : index === 1 ? '#52c41a' : '#faad14'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 活動統計 */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="活動統計">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="published" fill="#1890ff" name="已發布活動" />
                <Bar dataKey="attended" fill="#52c41a" name="參與次數" />
                <Bar dataKey="cancelled" fill="#ff4d4f" name="已取消活動" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics; 