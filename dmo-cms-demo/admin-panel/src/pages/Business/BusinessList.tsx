import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Modal, 
  Upload, 
  message,
  Row,
  Col,
  Statistic,
  Switch,
  Image,
  Rate,
  Avatar,
  Popover,
  Typography,
  Drawer,
  Form
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  EditOutlined,
  CameraOutlined,
  CalendarOutlined,
  RobotOutlined,
  StarOutlined,
  BulbOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockBusinesses, mockEvents } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Business } from '../../types';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const BusinessList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>(mockBusinesses);
  const [loading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  // AI助手相關狀態
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiEnhancing, setAiEnhancing] = useState(false);

  // 獲取商家參與的活動
  const getBusinessEvents = (businessId: string) => {
    return mockEvents.filter(event => event.businessIds?.includes(businessId));
  };

  // 狀態切換
  const handleStatusToggle = (business: Business, checked: boolean) => {
    const newStatus = checked ? 'published' as const : 'approved' as const;
    const updatedBusinesses = businesses.map(b => 
      b.id === business.id ? { ...b, status: newStatus } : b
    );
    setBusinesses(updatedBusinesses);
    setFilteredBusinesses(updatedBusinesses);
    message.success(`${business.name} 已${checked ? '上架' : '下架'}`);
  };

  // 快速編輯
  const handleQuickEdit = (business: Business) => {
    setEditingBusiness(business);
    form.setFieldsValue({
      name: business.name,
      description: business.description,
      specialOffer: business.specialOffer,
      category: business.category,
      status: business.status
    });
    setIsEditDrawerVisible(true);
  };

  // 保存快速編輯
  const handleSaveQuickEdit = async () => {
    try {
      const values = await form.validateFields();
      const updatedBusinesses = businesses.map(b => 
        b.id === editingBusiness?.id ? { ...b, ...values, updatedAt: new Date().toISOString() } : b
      );
      setBusinesses(updatedBusinesses);
      setFilteredBusinesses(updatedBusinesses);
      setIsEditDrawerVisible(false);
      
      // 根據狀態變更顯示不同的成功訊息
      const statusMessages = {
        pending: '已設為待審核狀態 - 等待管理員審核',
        approved: '已審核通過 ✅ - 商家可選擇上架',
        published: '已上架發布 🎉 - 用戶可公開瀏覽'
      };
      const statusMessage = statusMessages[values.status as keyof typeof statusMessages] || t('business.updateSuccess');
      message.success(`${editingBusiness?.name} ${statusMessage}`);
    } catch (error) {
      console.error('保存失敗:', error);
    }
  };

  // 照片編輯
  const handlePhotoEdit = (business: Business) => {
    setEditingPhoto(business);
    setIsPhotoModalVisible(true);
  };

  // 照片上傳
  const handlePhotoUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上傳成功`);
      setIsPhotoModalVisible(false);
      setEditingPhoto(null);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上傳失敗`);
    }
  };

  // 篩選功能
  const handleFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    let filtered = businesses;
    
    if (newFilters.status) {
      filtered = filtered.filter(b => b.status === newFilters.status);
    }
    
    if (newFilters.category) {
      filtered = filtered.filter(b => b.category === newFilters.category);
    }
    
    if (newFilters.search) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        b.address.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }
    
    setFilteredBusinesses(filtered);
  };

  // 點擊統計卡片篩選
  const handleStatCardClick = (status?: string) => {
    if (status) {
      setFilters({ ...filters, status });
    } else {
      // 點擊總商家數，顯示全部
      setFilters({ ...filters, status: '' });
    }
  };

  // 批次操作
  const handleBatchStatusChange = (status: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('請選擇要操作的商家');
      return;
    }
    
    const updatedBusinesses = businesses.map(b => 
      selectedRowKeys.includes(b.id) ? { ...b, status: status as Business['status'] } : b
    );
    setBusinesses(updatedBusinesses);
    setFilteredBusinesses(updatedBusinesses);
    setSelectedRowKeys([]);
    message.success(`已批次更新 ${selectedRowKeys.length} 個商家狀態`);
  };

  // AI文案美化功能
  const handleAiEnhanceBusiness = async () => {
    const currentDescription = form.getFieldValue('description');
    const businessName = form.getFieldValue('name');
    const category = form.getFieldValue('category');
    
    if (!currentDescription || currentDescription.trim() === '') {
      message.warning('請先輸入商家描述內容');
      return;
    }

    setAiEnhancing(true);
    try {
      // 模擬AI處理時間
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 根據商家類型生成不同的優化文案
      const enhancedDescriptions = {
        '餐飲': [
          `🍽️ ${currentDescription}\n\n✨ 美食特色：\n• 嚴選在地新鮮食材，堅持手作料理\n• 傳承古早味，融合現代創新元素\n• 溫馨用餐環境，適合家庭聚餐\n• 提供外帶服務，方便忙碌上班族\n\n📍 交通便利，近捷運站\n🅿️ 附近有停車場，開車族免煩惱`,
          
          `🌟 ${currentDescription}\n\n🎯 推薦理由：\n▶ 主廚精心調配獨家醬料，口味層次豐富\n▶ 新鮮食材每日採購，品質有保證\n▶ 舒適用餐空間，提供免費WiFi\n▶ 貼心服務，可客製化調整辣度\n\n💡 營業時間彈性，適合各時段用餐\n🎁 會員享有專屬優惠和生日禮`
        ],
        '購物': [
          `🛍️ ${currentDescription}\n\n✨ 購物亮點：\n• 精選優質商品，品質保證價格實惠\n• 定期推出限時優惠，驚喜不斷\n• 專業服務人員，提供購物建議\n• 完善售後服務，購物無後顧之憂\n\n📦 提供宅配服務，購物更便利\n💳 多元付款方式，現金刷卡都OK`,
          
          `🌟 ${currentDescription}\n\n🎯 店家特色：\n▶ 嚴選國內外知名品牌，款式新穎\n▶ 定期更新商品，跟上流行趨勢\n▶ 舒適購物環境，試穿試用無壓力\n▶ 會員制度完善，累積點數享優惠\n\n💡 專業搭配建議，打造個人風格\n🎁 節慶特惠活動，省錢購好物`
        ],
        '景點': [
          `📍 ${currentDescription}\n\n✨ 景點特色：\n• 豐富歷史文化底蘊，值得深度探索\n• 絕佳拍照打卡點，留下美好回憶\n• 專業導覽解說，深入了解在地故事\n• 適合全家大小，寓教於樂的好去處\n\n🚇 大眾運輸便利，綠色旅遊首選\n📸 提供免費拍照服務，專業攝影師`,
          
          `🌟 ${currentDescription}\n\n🎯 遊覽亮點：\n▶ 獨特建築風格，融合傳統與現代\n▶ 季節性景觀變化，四季皆有看頭\n▶ 互動體驗活動，增加參與樂趣\n▶ 周邊美食林立，一次滿足多重享受\n\n💡 建議停留時間2-3小時，慢慢品味\n🎁 紀念品店精選商品，帶回美好回憶`
        ]
      };
      
      const categoryDescriptions = enhancedDescriptions[category as keyof typeof enhancedDescriptions] || enhancedDescriptions['餐飲'];
      const randomEnhanced = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
      
      form.setFieldsValue({ description: randomEnhanced });
      message.success('AI文案美化完成！已為您優化商家描述');
      setShowAiSuggestions(false);
    } catch (error) {
      message.error('AI美化失敗，請稍後再試');
    } finally {
      setAiEnhancing(false);
    }
  };

  const columns = [
    {
      title: t('business.businessPhoto'),
      key: 'photo',
      width: 80,
      render: (_: any, record: Business) => (
        <div style={{ position: 'relative' }}>
          <Avatar
            size={60}
            shape="square"
            src={record.photos?.[0]}
            icon={<CameraOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => handlePhotoEdit(record)}
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
            onClick={() => handlePhotoEdit(record)}
          />
        </div>
      ),
    },
    {
      title: t('business.businessInfo'),
      key: 'info',
      width: 280,
      render: (_: any, record: Business) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text strong style={{ fontSize: 16 }}>{record.name}</Text>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleQuickEdit(record)}
            />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.address.length > 25 ? `${record.address.substring(0, 25)}...` : record.address}
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
          {/* 特色標籤 */}
          {record.tags && record.tags.length > 0 && (
            <div style={{ marginTop: 6 }}>
              {record.tags.slice(0, 3).map((tag, index) => (
                <Tag 
                  key={index} 
                  color="orange"
                  style={{ fontSize: 10, marginBottom: 2, padding: '0 4px', lineHeight: '16px' }}
                >
                  {tag}
                </Tag>
              ))}
              {record.tags.length > 3 && (
                <Popover
                  title="所有特色標籤"
                  content={
                    <div style={{ maxWidth: 200 }}>
                      {record.tags.map((tag, index) => (
                        <Tag 
                          key={index} 
                          color="orange"
                          style={{ marginBottom: 4, fontSize: 11 }}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  }
                >
                  <Tag 
                    color="default"
                    style={{ fontSize: 10, cursor: 'pointer', padding: '0 4px', lineHeight: '16px' }}
                  >
                    +{record.tags.length - 3}
                  </Tag>
                </Popover>
              )}
            </div>
          )}
          <div style={{ marginTop: 4, fontSize: 11, color: '#999' }}>
            {record.status === 'pending' && <Text type="warning">{t('business.pending')}</Text>}
          </div>
        </div>
      ),
    },
    {
      title: t('table.views'),
      key: 'views',
      width: 100,
      sorter: (a: Business, b: Business) => (a.analytics?.views || 0) - (b.analytics?.views || 0),
      render: (_: any, record: Business) => (
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
      sorter: (a: Business, b: Business) => (a.analytics?.clickThroughRate || 0) - (b.analytics?.clickThroughRate || 0),
      render: (_: any, record: Business) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#722ed1' }}>
            {(record.analytics?.clickThroughRate || 0).toFixed(1)}%
          </div>
          <div style={{ fontSize: 11, color: '#666' }}>{t('table.ctr')}</div>
        </div>
      ),
    },
    {
      title: '上架狀態',
      key: 'status',
      width: 120,
      render: (_: any, record: Business) => (
        <div style={{ textAlign: 'center' }}>
          <Switch
            checked={record.status === 'published'}
            onChange={(checked) => handleStatusToggle(record, checked)}
            checkedChildren="上架"
            unCheckedChildren="下架"
            disabled={record.status === 'pending'}
          />
          <div style={{ marginTop: 4, fontSize: 11 }}>
            {record.status === 'pending' && <Text type="warning">待審核</Text>}
            {record.status === 'rejected' && <Text type="danger">已拒絕</Text>}
          </div>
        </div>
      ),
    },
    {
      title: '參與活動',
      key: 'events',
      width: 120,
      render: (_: any, record: Business) => {
        const events = getBusinessEvents(record.id);
        return (
          <div>
            {events.length > 0 ? (
              <Popover
                title="參與活動"
                content={
                  <div style={{ maxWidth: 250 }}>
                    {events.map(event => (
                      <div key={event.id} style={{ marginBottom: 8 }}>
                        <div style={{ fontWeight: 500 }}>{event.name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {event.startDate} ~ {event.endDate}
                        </div>
                        <Tag color={event.status === 'published' ? 'green' : 'orange'}>
                          {event.status === 'published' ? '進行中' : '草稿'}
                        </Tag>
                      </div>
                    ))}
                  </div>
                }
              >
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <CalendarOutlined style={{ fontSize: 18, color: '#1890ff' }} />
                  <div style={{ fontSize: 12 }}>{events.length} 個活動</div>
                </div>
              </Popover>
            ) : (
              <div style={{ textAlign: 'center', color: '#ccc' }}>
                <CalendarOutlined style={{ fontSize: 18 }} />
                <div style={{ fontSize: 12 }}>無活動</div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: Business) => (
        <div style={{ textAlign: 'center' }}>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/businesses/${record.id}`)}
          >
            編輯
          </Button>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    },
  };

  // 統計數據
  const stats = {
    total: businesses.length,
    published: businesses.filter(b => b.status === 'published').length,
    approved: businesses.filter(b => b.status === 'approved').length,
    pending: businesses.filter(b => b.status === 'pending').length,
  };

  // AI助手彈窗內容
  const businessAiSuggestionsContent = (
    <div style={{ width: 300 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#1890ff' }}>
        <RobotOutlined /> AI商家文案助手
      </div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
        根據商家類型智能優化描述，提升吸引力
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button 
          size="small" 
          icon={<StarOutlined />} 
          onClick={handleAiEnhanceBusiness}
          loading={aiEnhancing}
          style={{ width: '100%' }}
        >
          {aiEnhancing ? '正在美化中...' : '一鍵美化描述'}
        </Button>
        <Button 
          size="small" 
          icon={<BulbOutlined />} 
          onClick={() => message.info('功能開發中，敬請期待')}
          style={{ width: '100%' }}
        >
          生成商家標語
        </Button>
        <Button 
          size="small" 
          icon={<ThunderboltOutlined />} 
          onClick={() => message.info('功能開發中，敬請期待')}
          style={{ width: '100%' }}
        >
          推薦特色標籤
        </Button>
      </Space>
      <div style={{ fontSize: 11, color: '#999', marginTop: 8, textAlign: 'center' }}>
        專為商家優化的AI文案工具
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>{t('nav.business')}</h1>
        <Space>
          <Button 
            icon={<UploadOutlined />}
            onClick={() => navigate('/batch-upload')}
          >
            {t('business.batchUpload')}
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/businesses/new')}
          >
            {t('business.addNew')}
          </Button>
        </Space>
      </div>

      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            style={{ cursor: 'pointer' }}
            onClick={() => handleStatCardClick()}
          >
            <Statistic title={t('business.totalCount')} value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            style={{ cursor: 'pointer' }}
            onClick={() => handleStatCardClick('published')}
          >
            <Statistic 
              title={t('business.published')} 
              value={stats.published} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            style={{ cursor: 'pointer' }}
            onClick={() => handleStatCardClick('approved')}
          >
            <Statistic 
              title={t('business.approved')} 
              value={stats.approved} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            style={{ cursor: 'pointer' }}
            onClick={() => handleStatCardClick('pending')}
          >
            <Statistic 
              title={t('business.pending')} 
              value={stats.pending} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* 篩選工具列 */}
        <div style={{ marginBottom: 16 }}>
          {filters.status && (
            <div style={{ marginBottom: 12 }}>
              <Tag 
                closable 
                onClose={() => handleStatCardClick()}
                color="blue"
              >
                {t('business.currentFilter')}: {
                  filters.status === 'published' ? t('business.published') :
                  filters.status === 'approved' ? t('business.approved') :
                  filters.status === 'pending' ? t('business.pending') : t('business.all')
                }
              </Tag>
            </div>
          )}
          <Row gutter={16}>
            <Col span={6}>
              <Search
                placeholder={t('business.searchPlaceholder')}
                allowClear
                onSearch={(value) => handleFilter('search', value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder={t('business.statusFilter')}
                allowClear
                style={{ width: '100%' }}
                value={filters.status || undefined}
                onChange={(value) => handleFilter('status', value || '')}
              >
                <Option value="published">{t('business.published')}</Option>
                <Option value="approved">{t('business.approved')}</Option>
                <Option value="pending">{t('business.pending')}</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder={t('business.categoryFilter')}
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilter('category', value || '')}
              >
                <Option value="餐飲">{t('category.restaurant')}</Option>
                <Option value="購物">{t('category.shopping')}</Option>
                <Option value="景點">{t('category.attraction')}</Option>
                <Option value="文化">{t('category.culture')}</Option>
              </Select>
            </Col>
            <Col span={10}>
              {selectedRowKeys.length > 0 && (
                <Space>
                  <span>{t('business.selectedItems')} {selectedRowKeys.length} {t('business.items')}</span>
                  <Button size="small" onClick={() => handleBatchStatusChange('published')}>
                    {t('business.batchPublish')}
                  </Button>
                  <Button size="small" onClick={() => handleBatchStatusChange('approved')}>
                    {t('business.batchUnpublish')}
                  </Button>
                </Space>
              )}
            </Col>
          </Row>
        </div>

        {/* 商家表格 */}
        <Table
          columns={columns}
          dataSource={filteredBusinesses}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            total: filteredBusinesses.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 項，共 ${total} 項`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 快速編輯抽屜 */}
      <Drawer
        title={t('business.quickEditTitle')}
        placement="right"
        onClose={() => setIsEditDrawerVisible(false)}
        open={isEditDrawerVisible}
        width={450}
        extra={
          <Space>
            <Button onClick={() => setIsEditDrawerVisible(false)}>{t('common.cancel')}</Button>
            <Button type="primary" onClick={handleSaveQuickEdit}>{t('common.save')}</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t('business.businessName')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item 
            name="description" 
            label={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 8 }}>
                <span>{t('business.businessDescription')}</span>
                <Popover
                  content={businessAiSuggestionsContent}
                  title={null}
                  trigger="click"
                  placement="topRight"
                  open={showAiSuggestions}
                  onOpenChange={setShowAiSuggestions}
                >
                  <Button 
                    size="small" 
                    type="primary" 
                    ghost
                    icon={<RobotOutlined />}
                    style={{ 
                      fontSize: 11,
                      height: 24,
                      marginLeft: 16,
                      background: 'linear-gradient(45deg, #52c41a, #1890ff)',
                      borderColor: 'transparent',
                      color: 'white',
                      boxShadow: '0 2px 4px rgba(82, 196, 26, 0.3)'
                    }}
                  >
                    AI助手
                  </Button>
                </Popover>
              </div>
            }
            rules={[{ required: true }]}
          >
            <Input.TextArea 
              rows={4} 
              showCount 
              maxLength={200} 
              placeholder="請輸入商家描述，包含特色、服務內容等，或點擊右上角AI助手幫您美化文案..."
            />
          </Form.Item>
          
          <Form.Item 
            name="specialOffer" 
            label="特別優惠訊息"
          >
            <Input.TextArea 
              rows={3} 
              showCount 
              maxLength={300} 
              placeholder="例如：新客戶享9折優惠、買一送一活動、會員專屬折扣等..."
            />
          </Form.Item>
          
          <Form.Item name="category" label={t('business.businessCategory')} rules={[{ required: true }]}>
            <Select>
              <Option value="餐飲">{t('category.restaurant')}</Option>
              <Option value="購物">{t('category.shopping')}</Option>
              <Option value="景點">{t('category.attraction')}</Option>
              <Option value="文化">{t('category.culture')}</Option>
            </Select>
          </Form.Item>
          
          {/* 狀態管理區塊 */}
          <div style={{ 
            background: '#f5f5f5', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 16 
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: 12, 
              color: '#1890ff',
              fontSize: 14 
            }}>
              🔧 DMO 管理員作業
            </div>
            
            <Form.Item name="status" label={t('business.businessStatus')} rules={[{ required: true }]}>
              <Select>
                <Option value="pending">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag color="orange">待審核</Tag>
                    <span style={{ fontSize: 12, color: '#666' }}>等待管理員審核</span>
                  </div>
                </Option>
                <Option value="approved">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag color="blue">已審核</Tag>
                    <span style={{ fontSize: 12, color: '#666' }}>審核通過，可上架</span>
                  </div>
                </Option>
                <Option value="published">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag color="green">已上架</Tag>
                    <span style={{ fontSize: 12, color: '#666' }}>公開顯示中</span>
                  </div>
                </Option>
              </Select>
            </Form.Item>
            
            <div style={{ 
              fontSize: 12, 
              color: '#666', 
              background: 'white', 
              padding: 8, 
              borderRadius: 4,
              border: '1px solid #e8e8e8'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>狀態說明：</div>
              <div>• <strong>待審核</strong>：商家提交資料，等待管理員審核</div>
              <div>• <strong>已審核</strong>：管理員審核通過，商家可選擇上架</div>
              <div>• <strong>已上架</strong>：商家資訊公開顯示，用戶可瀏覽</div>
            </div>
          </div>
        </Form>
      </Drawer>

      {/* 照片編輯彈窗 */}
      <Modal
        title={`${t('business.editPhotoTitle')} - ${editingPhoto?.name || ''}`}
        open={isPhotoModalVisible}
        onCancel={() => setIsPhotoModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center' }}>
          {editingPhoto?.photos?.[0] && (
            <Image
              src={editingPhoto.photos[0]}
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

export default BusinessList; 