import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockEvents } from '../../data/mockData';
import type { Event } from '../../types';

const { Search } = Input;
const { Option } = Select;

const EventList: React.FC = () => {
  const navigate = useNavigate();
  const [events] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [loading] = useState(false);

  console.log('EventList rendering, events:', events);

  // 狀態配置
  const statusConfig = {
    published: { color: 'green', text: '已發布' },
    draft: { color: 'orange', text: '草稿' },
    archived: { color: 'blue', text: '已結束' },
  };

  // 篩選功能
  const handleFilter = (key: string, value: string) => {
    let filtered = events;
    
    if (key === 'status' && value) {
      filtered = filtered.filter(e => e.status === value);
    }
    
    if (key === 'search' && value) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(value.toLowerCase()) ||
        e.description.toLowerCase().includes(value.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  };

  const columns = [
    {
      title: '活動名稱',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Event) => (
        <div>
          <a onClick={() => navigate(`/events/${record.id}`)}>{text}</a>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            {record.description && record.description.length > 50 
              ? `${record.description.substring(0, 50)}...` 
              : record.description}
          </div>
        </div>
      ),
    },
    {
      title: '時間',
      key: 'dates',
      render: (_: any, record: Event) => (
        <div>
          <div style={{ fontSize: 12 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            開始：{new Date(record.startDate).toLocaleDateString('zh-TW')}
          </div>
          <div style={{ fontSize: 12, marginTop: 2 }}>
            結束：{new Date(record.endDate).toLocaleDateString('zh-TW')}
          </div>
        </div>
      ),
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusConfig) => {
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Event) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/events/${record.id}`)}
          >
            查看詳情
          </Button>
        </Space>
      ),
    },
  ];

  // 統計數據
  const stats = {
    total: events.length,
    published: events.filter(e => e.status === 'published').length,
    draft: events.filter(e => e.status === 'draft').length,
    archived: events.filter(e => e.status === 'archived').length,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>活動管理</h1>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/events/new')}
          >
            新增活動
          </Button>
        </Space>
      </div>

      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="總活動數" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已發布" 
              value={stats.published} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="草稿" 
              value={stats.draft} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已結束" 
              value={stats.archived} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* 篩選工具列 */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Search
                placeholder="搜尋活動名稱或描述"
                allowClear
                onSearch={(value) => handleFilter('search', value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="狀態篩選"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilter('status', value || '')}
              >
                <Option value="published">已發布</Option>
                <Option value="draft">草稿</Option>
                <Option value="archived">已結束</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredEvents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 項，共 ${total} 項`,
          }}
        />
      </Card>
    </div>
  );
};

export default EventList; 