import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Row, 
  Col,
  message,
  Spin,
  InputNumber,
  DatePicker,
  TimePicker,
  Switch,
  Table,
  Avatar,
  Tooltip,
  Modal,
  Transfer,
  Tabs,
  Statistic,
  Progress,
  Rate,
  Popover,
  Upload,
  Image
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  ShopOutlined,
  TrophyOutlined,
  EyeOutlined,
  RobotOutlined,
  StarOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  UploadOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { mockEvents, mockBusinesses } from '../../data/mockData';
import type { Event, Business } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import OpenStreetMap from '../../components/Map/OpenStreetMap';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const EventDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [isBusinessModalVisible, setIsBusinessModalVisible] = useState(false);
  const [participatingBusinesses, setParticipatingBusinesses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [coverImage, setCoverImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const { t } = useLanguage();

  const isEditing = id && id !== 'new';

  // 處理 URL 參數中的 tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isEditing) {
      const foundEvent = mockEvents.find(e => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
        setParticipatingBusinesses(foundEvent.businessIds || []);
        
        // 設置活動圖片
        if (foundEvent.photos && foundEvent.photos.length > 0) {
          setCoverImage(foundEvent.photos[0]); // 第一張圖片作為封面
          if (foundEvent.photos.length > 1) {
            setGalleryImages(foundEvent.photos.slice(1)); // 其他圖片作為相簿
          }
        }
        
        form.setFieldsValue({
          name: foundEvent.name,
          description: foundEvent.description,
          category: foundEvent.category,
          location: foundEvent.location,
          address: foundEvent.address,
          dateRange: [dayjs(foundEvent.startDate), dayjs(foundEvent.endDate)],
          startTime: dayjs(foundEvent.startTime, 'HH:mm'),
          endTime: dayjs(foundEvent.endTime, 'HH:mm'),
          maxAttendees: foundEvent.maxAttendees,
          price: foundEvent.price,
          registrationRequired: foundEvent.registrationRequired,
          status: foundEvent.status,
          organizer: foundEvent.organizer,
          contactPhone: foundEvent.contactPhone,
          contactEmail: foundEvent.contactEmail,
          website: foundEvent.website
        });
      }
    }
  }, [id, isEditing, form]);

  // 獲取參與商家
  const getParticipatingBusinesses = () => {
    return mockBusinesses.filter(business => participatingBusinesses.includes(business.id));
  };

  // 計算商家在活動中的表現
  const getBusinessPerformanceInEvent = () => {
    const businesses = getParticipatingBusinesses();
    return businesses
      .map(business => ({
        ...business,
        eventScore: (business.analytics?.views || 0) * 0.6 + 
                   (business.analytics?.clickThroughRate || 0) * 20 + 
                   (business.rating || 0) * 10
      }))
      .sort((a, b) => b.eventScore - a.eventScore);
  };

  // 商家管理相關函數
  const handleBusinessSelection = (targetKeys: React.Key[]) => {
    setParticipatingBusinesses(targetKeys as string[]);
  };

  const handleRemoveBusiness = (businessId: string) => {
    setParticipatingBusinesses(prev => prev.filter(id => id !== businessId));
    message.success(t('eventDetail.businessRemoved'));
  };

  // AI文案美化功能
  const handleAiEnhance = async () => {
    const currentDescription = form.getFieldValue('description');
    if (!currentDescription || currentDescription.trim() === '') {
      message.warning(t('eventDetail.pleaseEnterDescription'));
      return;
    }

    setAiEnhancing(true);
    try {
      // 模擬AI處理時間
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模擬AI優化後的文案
      const enhancedDescriptions = [
        `🎆 ${currentDescription}\n\n✨ 活動亮點：\n• 結合傳統與現代的獨特體驗\n• 專業導覽解說，深度了解在地文化\n• 精選在地美食與特色商家\n• 適合全家大小共同參與\n\n📍 交通便利，鄰近捷運站\n🎫 活動免費參加，歡迎踴躍報名！`,
        
        `🌟 ${currentDescription}\n\n🎯 活動特色：\n▶ 沉浸式文化體驗，感受大稻埕百年風華\n▶ 在地職人親自示範傳統工藝\n▶ 限定美食品嚐，味蕾的驚喜之旅\n▶ 網美打卡熱點，留下美好回憶\n\n💡 貼心提醒：建議穿著舒適鞋子，方便步行參觀\n🎁 參加即贈精美紀念品一份！`,
        
        `🏮 ${currentDescription}\n\n🌈 精彩內容：\n🎪 傳統表演：歌仔戲、布袋戲現場演出\n🍜 美食饗宴：道地台灣小吃一次品嚐\n🛍️ 文創市集：獨特手作商品等你挖寶\n📸 復古場景：穿越時空的拍照體驗\n\n⏰ 活動時間充裕，可依個人喜好安排行程\n🚇 大橋頭站步行5分鐘即可抵達`
      ];
      
      const randomEnhanced = enhancedDescriptions[Math.floor(Math.random() * enhancedDescriptions.length)];
      form.setFieldsValue({ description: randomEnhanced });
      message.success(t('eventDetail.aiOptimizeComplete'));
      setShowAiSuggestions(true);
    } catch (error) {
      message.error(t('eventDetail.aiOptimizeFailed'));
    } finally {
      setAiEnhancing(false);
    }
  };

  const aiSuggestionsContent = (
    <div style={{ width: 300 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#1890ff' }}>
        <RobotOutlined /> {t('eventDetail.aiWritingAssistant')}
      </div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
        {t('eventDetail.letAiOptimize')}
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button 
          size="small" 
          icon={<StarOutlined />} 
          onClick={handleAiEnhance}
          loading={aiEnhancing}
          style={{ width: '100%' }}
        >
          {aiEnhancing ? t('eventDetail.optimizing') : t('eventDetail.oneClickOptimize')}
        </Button>
        <Button 
          size="small" 
          icon={<BulbOutlined />} 
          onClick={() => message.info(t('eventDetail.featureInDevelopment'))}
          style={{ width: '100%' }}
        >
          {t('eventDetail.generateTitle')}
        </Button>
        <Button 
          size="small" 
          icon={<ThunderboltOutlined />} 
          onClick={() => message.info(t('eventDetail.featureInDevelopment'))}
          style={{ width: '100%' }}
        >
          {t('eventDetail.seoKeywords')}
        </Button>
      </Space>
      <div style={{ fontSize: 11, color: '#999', marginTop: 8, textAlign: 'center' }}>
        {t('eventDetail.aiPoweredAssistant')}
      </div>
    </div>
  );

  // Transfer組件的數據源
  const transferDataSource = mockBusinesses.map(business => ({
    key: business.id,
    title: business.name,
    description: business.address,
    category: business.category,
  }));

  // 商家表現表格欄位
  const businessColumns = [
    {
      title: t('eventDetail.ranking'),
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <div style={{ textAlign: 'center' }}>
          {index === 0 && <TrophyOutlined style={{ color: '#faad14' }} />}
          <div style={{ fontWeight: 'bold' }}>#{index + 1}</div>
        </div>
      ),
    },
    {
      title: t('eventDetail.business'),
      key: 'business',
      render: (_: any, record: Business) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size={40}
            src={record.photos?.[0]}
            icon={<ShopOutlined />}
            style={{ marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.category}</div>
            <Rate disabled defaultValue={record.rating} style={{ fontSize: 12 }} />
          </div>
        </div>
      ),
    },
    {
      title: t('eventDetail.performanceData'),
      key: 'performance',
      render: (_: any, record: Business) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#666' }}>{t('table.views')}：</span>
            <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
              {(record.analytics?.views || 0).toLocaleString()}
            </span>
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#666' }}>{t('eventDetail.clickRate')}：</span>
            <span style={{ fontWeight: 'bold', color: '#722ed1' }}>
              {(record.analytics?.clickThroughRate || 0).toFixed(1)}%
            </span>
          </div>
          <Progress 
            percent={Math.min((record.analytics?.clickThroughRate || 0) * 10, 100)} 
            size="small" 
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: t('common.actions'),
      key: 'action',
      width: 120,
      render: (_: any, record: Business) => (
        <Space>
          <Tooltip title={t('eventDetail.viewDetails')}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/businesses/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={t('eventDetail.removeBusiness')}>
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleRemoveBusiness(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 地圖視圖組件
  const MapView = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([t('category.restaurant'), t('category.shopping'), t('category.attraction'), t('category.culture')]);
    const [showTopPerformersOnly, setShowTopPerformersOnly] = useState(false);
    
    const participatingBusinessData = getParticipatingBusinesses();
    
    // 按分類統計商家數量
    const categoryStats = participatingBusinessData.reduce((acc, business) => {
      acc[business.category] = (acc[business.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 篩選顯示的商家
    const filteredBusinesses = participatingBusinessData.filter(business => {
      const categoryMatch = selectedCategories.includes(business.category);
      if (showTopPerformersOnly) {
        const topPerformers = participatingBusinessData
          .filter(b => b.analytics)
          .sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0))
          .slice(0, 5)
          .map(b => b.id);
        return categoryMatch && topPerformers.includes(business.id);
      }
      return categoryMatch;
    });

    const toggleCategory = (category: string) => {
      setSelectedCategories(prev => 
        prev.includes(category) 
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    };

    const toggleAllCategories = () => {
      if (selectedCategories.length === Object.keys(categoryStats).length) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(Object.keys(categoryStats));
      }
    };

    const getCategoryColor = (category: string): string => {
      const colors: { [key: string]: string } = {
        [t('category.restaurant')]: '#1890ff',
        [t('category.shopping')]: '#52c41a',
        [t('category.attraction')]: '#faad14',
        [t('category.culture')]: '#722ed1',
        [t('eventCategory.other')]: '#8c8c8c',
      };
      return colors[category] || colors[t('eventCategory.other')];
    };

    return (
      <div style={{ position: 'relative' }}>
        {/* 控制面板 - 移到右邊 */}
        <div style={{ 
          position: 'absolute', 
          top: 20, 
          right: 20, 
          background: 'white', 
          padding: 16, 
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: 280
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 16 }}>
            {t('eventDetail.distributionControl')}
          </div>
          
          {/* 總覽統計 */}
          <div style={{ 
            background: '#f5f5f5', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
              {filteredBusinesses.length}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {t('eventDetail.displayingBusinesses')} / {t('common.total')} {participatingBusinessData.length}
            </div>
          </div>

          {/* 分類篩選 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 8 
            }}>
              <span style={{ fontSize: 14, fontWeight: 'bold' }}>{t('eventDetail.businessCategory')}</span>
              <Button 
                size="small" 
                type="link" 
                onClick={toggleAllCategories}
                style={{ padding: 0, height: 'auto' }}
              >
                {selectedCategories.length === Object.keys(categoryStats).length ? t('eventDetail.deselectAll') : t('eventDetail.selectAll')}
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(categoryStats).map(([category, count]) => (
                <div
                  key={category}
                  onClick={() => toggleCategory(category)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: `2px solid ${selectedCategories.includes(category) ? getCategoryColor(category) : '#d9d9d9'}`,
                    background: selectedCategories.includes(category) ? `${getCategoryColor(category)}15` : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: getCategoryColor(category),
                      border: '1px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}></div>
                    <span style={{ 
                      fontWeight: selectedCategories.includes(category) ? 'bold' : 'normal',
                      color: selectedCategories.includes(category) ? getCategoryColor(category) : '#666'
                    }}>
                      {category}
                    </span>
                  </div>
                  <div style={{
                    background: selectedCategories.includes(category) ? getCategoryColor(category) : '#d9d9d9',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 熱門商家篩選 */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              padding: '8px 12px',
              borderRadius: 8,
              border: `2px solid ${showTopPerformersOnly ? '#ff4d4f' : '#d9d9d9'}`,
              background: showTopPerformersOnly ? '#fff2f0' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setShowTopPerformersOnly(!showTopPerformersOnly)}
            >
              <span style={{ fontSize: 16 }}>🏆</span>
              <span style={{ 
                fontWeight: showTopPerformersOnly ? 'bold' : 'normal',
                color: showTopPerformersOnly ? '#ff4d4f' : '#666',
                flex: 1
              }}>
                {t('eventDetail.showTopPerformersOnly')}
              </span>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: showTopPerformersOnly ? '#ff4d4f' : '#d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {showTopPerformersOnly && (
                  <span style={{ color: 'white', fontSize: 10 }}>✓</span>
                )}
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              size="small" 
              onClick={() => {
                setSelectedCategories([t('category.restaurant')]);
                setShowTopPerformersOnly(false);
              }}
              style={{ flex: 1 }}
            >
              {t('eventDetail.viewRestaurants')}
            </Button>
            <Button 
              size="small" 
              onClick={() => {
                setSelectedCategories([t('category.shopping')]);
                setShowTopPerformersOnly(false);
              }}
              style={{ flex: 1 }}
            >
              {t('eventDetail.viewShopping')}
            </Button>
          </div>
        </div>
        
        <OpenStreetMap
          businesses={filteredBusinesses}
          center={[25.0330, 121.5654]} // 台北市中心
          zoom={14}
          height={600}
          showLegend={false}
          selectedCategories={selectedCategories}
          onBusinessClick={(business) => {
            navigate(`/businesses/${business.id}`);
          }}
        />
      </div>
    );
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 檢查是否有封面圖片
      if (!coverImage) {
        message.error(t('eventDetail.coverImageValidationError'));
        setLoading(false);
        return;
      }

      // 組合完整的表單數據
      const formData = {
        ...values,
        coverImage,
        galleryImages,
        participatingBusinesses
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form values:', formData);
      message.success(isEditing ? t('eventDetail.updateSuccess') : t('eventDetail.createSuccess'));
      navigate('/events');
    } catch (error) {
      message.error(t('eventDetail.operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const performanceData = getBusinessPerformanceInEvent();
  const totalViews = performanceData.reduce((sum, b) => sum + (b.analytics?.views || 0), 0);
  const avgCTR = performanceData.length > 0 
    ? performanceData.reduce((sum, b) => sum + (b.analytics?.clickThroughRate || 0), 0) / performanceData.length 
    : 0;

  // 圖片處理函數
  const handleCoverImageUpload = (file: any) => {
    // 模擬圖片上傳
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImage(e.target?.result as string);
      message.success(t('eventDetail.coverImageUploadSuccess'));
    };
    reader.readAsDataURL(file);
    return false; // 阻止自動上傳
  };

  const handleGalleryImageUpload = (file: any) => {
    // 模擬圖片上傳
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage = e.target?.result as string;
      setGalleryImages(prev => [...prev, newImage]);
      message.success(t('eventDetail.imageUploadSuccess'));
    };
    reader.readAsDataURL(file);
    return false; // 阻止自動上傳
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    message.success(t('eventDetail.imageRemoved'));
  };

  const handlePreviewImage = (imageSrc: string) => {
    setPreviewImage(imageSrc);
    setImagePreviewVisible(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/events')}
          style={{ marginRight: 16 }}
        >
          {t('eventDetail.returnToEventList')}
        </Button>
        <h1>{isEditing ? `${t('eventDetail.editEvent')} - ${event?.name}` : t('eventDetail.addEvent')}</h1>
      </div>

      <Spin spinning={loading}>
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key)}
        >
          <TabPane tab={t('eventDetail.basicInfo')} key="basic">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                status: 'draft',
                registrationRequired: false,
                price: 0
              }}
            >
              <Row gutter={24}>
                <Col span={16}>
                  {/* 圖片上傳區域 */}
                  <Card title={t('eventDetail.eventImages')} style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                            <CameraOutlined style={{ marginRight: 8 }} />
                            {t('eventDetail.coverImage')} {t('eventDetail.coverImageRequired')}
                          </div>
                          <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                            {t('eventDetail.coverImageTip')}
                          </div>
                          {coverImage ? (
                            <div style={{ position: 'relative', marginBottom: 12 }}>
                              <Image
                                width="100%"
                                height={200}
                                src={coverImage}
                                style={{ 
                                  objectFit: 'cover', 
                                  borderRadius: 8,
                                  cursor: 'pointer'
                                }}
                                preview={{
                                  mask: <div>{t('eventDetail.previewImage')}</div>
                                }}
                                onClick={() => handlePreviewImage(coverImage)}
                              />
                              <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                style={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8
                                }}
                                onClick={() => {
                                  setCoverImage('');
                                  message.success(t('eventDetail.coverImageRemoved'));
                                }}
                              >
                                {t('eventDetail.removeImage')}
                              </Button>
                            </div>
                          ) : (
                            <Upload.Dragger
                              accept="image/*"
                              beforeUpload={handleCoverImageUpload}
                              showUploadList={false}
                              style={{ marginBottom: 12 }}
                            >
                              <p className="ant-upload-drag-icon">
                                <CameraOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                              </p>
                              <p className="ant-upload-text">{t('eventDetail.dragUploadCover')}</p>
                              <p className="ant-upload-hint">{t('eventDetail.supportFormats')}</p>
                            </Upload.Dragger>
                          )}
                        </div>
                      </Col>
                      
                      <Col span={12}>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                            <UploadOutlined style={{ marginRight: 8 }} />
                            {t('eventDetail.activityAlbum')} {t('eventDetail.activityAlbumOptional')}
                          </div>
                          <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                            {t('eventDetail.maxImages')}
                          </div>
                          
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: 8,
                            marginBottom: 12
                          }}>
                            {galleryImages.map((image, index) => (
                              <div key={index} style={{ position: 'relative' }}>
                                <Image
                                  width="100%"
                                  height={80}
                                  src={image}
                                  style={{ 
                                    objectFit: 'cover', 
                                    borderRadius: 4,
                                    cursor: 'pointer'
                                  }}
                                  preview={{
                                    mask: <div style={{ fontSize: 10 }}>{t('eventDetail.previewImage')}</div>
                                  }}
                                  onClick={() => handlePreviewImage(image)}
                                />
                                <Button
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  style={{
                                    position: 'absolute',
                                    top: 2,
                                    right: 2,
                                    width: 20,
                                    height: 20,
                                    fontSize: 10
                                  }}
                                  onClick={() => handleRemoveGalleryImage(index)}
                                />
                              </div>
                            ))}
                            
                            {galleryImages.length < 6 && (
                              <Upload
                                accept="image/*"
                                beforeUpload={handleGalleryImageUpload}
                                showUploadList={false}
                              >
                                <div style={{
                                  width: '100%',
                                  height: 80,
                                  border: '2px dashed #d9d9d9',
                                  borderRadius: 4,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  transition: 'border-color 0.3s',
                                  backgroundColor: '#fafafa'
                                }}
                                className="upload-placeholder"
                                >
                                  <PlusOutlined style={{ fontSize: 16, color: '#999' }} />
                                  <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
                                    {t('eventDetail.uploadImage')}
                                  </div>
                                </div>
                              </Upload>
                            )}
                          </div>
                          
                          {galleryImages.length >= 6 && (
                            <div style={{ 
                              fontSize: 12, 
                              color: '#faad14', 
                              textAlign: 'center',
                              padding: 8,
                              background: '#fffbe6',
                              borderRadius: 4,
                              border: '1px solid #ffe58f'
                            }}>
                              {t('eventDetail.maxImagesReached')}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  <Card title={t('eventDetail.eventDetails')} style={{ marginBottom: 24 }}>
                    <Form.Item
                      name="name"
                      label={t('eventDetail.eventName')}
                      rules={[{ required: true, message: t('eventDetail.eventNamePlaceholder') }]}
                    >
                      <Input placeholder={t('eventDetail.eventNamePlaceholder')} />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="category"
                          label={t('eventDetail.eventCategory')}
                          rules={[{ required: true, message: t('eventDetail.categoryPlaceholder') }]}
                        >
                          <Select placeholder={t('eventDetail.categoryPlaceholder')}>
                            <Option value="音樂">{t('eventCategory.music')}</Option>
                            <Option value="藝術">{t('eventCategory.art')}</Option>
                            <Option value="文化">{t('eventCategory.culture')}</Option>
                            <Option value="展覽">{t('eventCategory.exhibition')}</Option>
                            <Option value="節慶">{t('eventCategory.festival')}</Option>
                            <Option value="市集">{t('eventCategory.market')}</Option>
                            <Option value="工作坊">{t('eventCategory.workshop')}</Option>
                            <Option value="其他">{t('eventCategory.other')}</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="organizer" label={t('eventDetail.organizer')}>
                          <Input placeholder={t('eventDetail.organizerPlaceholder')} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item 
                      name="description" 
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 8 }}>
                          <span>{t('eventDetail.eventDescription')}</span>
                          <Popover
                            content={aiSuggestionsContent}
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
                                background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                                borderColor: 'transparent',
                                color: 'white',
                                boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)'
                              }}
                            >
                              {t('eventDetail.aiHelper')}
                            </Button>
                          </Popover>
                        </div>
                      }
                    >
                      <TextArea 
                        rows={4} 
                        placeholder={t('eventDetail.descriptionPlaceholder')} 
                        style={{ position: 'relative' }}
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="location" label={t('eventDetail.eventLocation')}>
                          <Input placeholder={t('eventDetail.locationPlaceholder')} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="address" label={t('eventDetail.detailedAddress')}>
                          <Input placeholder={t('eventDetail.addressPlaceholder')} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="dateRange" label={t('eventDetail.eventDate')}>
                          <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="startTime" label={t('eventDetail.startTime')}>
                          <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="endTime" label={t('eventDetail.endTime')}>
                          <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card title={t('eventDetail.settings')} style={{ marginBottom: 24 }}>
                    <Form.Item name="status" label={t('eventDetail.status')}>
                      <Select>
                        <Option value="draft">{t('eventStatus.draft')}</Option>
                        <Option value="published">{t('eventStatus.published')}</Option>
                        <Option value="cancelled">{t('eventStatus.cancelled')}</Option>
                        <Option value="completed">{t('eventStatus.completed')}</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item name="maxAttendees" label={t('eventDetail.maxAttendees')}>
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="price" label={t('eventDetail.participationFee')}>
                      <InputNumber min={0} style={{ width: '100%' }} addonAfter={t('eventDetail.yuan')} />
                    </Form.Item>

                    <Form.Item name="registrationRequired" valuePropName="checked">
                      <Switch checkedChildren={t('eventDetail.registrationRequired')} unCheckedChildren={t('eventDetail.noRegistrationRequired')} />
                    </Form.Item>
                  </Card>

                  <div style={{ textAlign: 'center' }}>
                    <Space>
                      <Button onClick={() => navigate('/events')}>
                        {t('common.cancel')}
                      </Button>
                      <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        {isEditing ? t('eventDetail.updateEvent') : t('eventDetail.createEvent')}
                      </Button>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {isEditing && (
            <TabPane tab={`${t('eventDetail.participatingBusinessesTab')} (${participatingBusinesses.length})`} key="businesses">
              <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card>
                    <Statistic title={t('eventDetail.totalParticipating')} value={participatingBusinesses.length} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic title={t('eventDetail.totalPageViews')} value={totalViews.toLocaleString()} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic title={t('eventDetail.avgClickRate')} value={avgCTR.toFixed(1)} suffix="%" />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setIsBusinessModalVisible(true)}
                      >
                        {t('eventDetail.manageBusiness')}
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>

              <Card title={t('eventDetail.businessPerformanceRanking')} style={{ marginBottom: 24 }}>
                <Table
                  columns={businessColumns}
                  dataSource={performanceData}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </TabPane>
          )}

          {isEditing && (
            <TabPane tab={t('eventDetail.mapView')} key="map">
              <Card title={t('eventDetail.businessDistribution')}>
                <MapView />
              </Card>
            </TabPane>
          )}
        </Tabs>

        {/* 商家選擇彈窗 */}
        <Modal
          title={t('eventDetail.businessManagement')}
          open={isBusinessModalVisible}
          onCancel={() => setIsBusinessModalVisible(false)}
          width={800}
          footer={[
            <Button key="cancel" onClick={() => setIsBusinessModalVisible(false)}>
              {t('common.cancel')}
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              onClick={() => {
                setIsBusinessModalVisible(false);
                message.success(t('eventDetail.businessSettingsUpdated'));
              }}
            >
              {t('common.confirm')}
            </Button>,
          ]}
        >
          <Transfer
            dataSource={transferDataSource}
            targetKeys={participatingBusinesses}
            onChange={handleBusinessSelection}
            render={item => `${item.title} - ${item.category}`}
            titles={[t('eventDetail.availableBusinesses'), t('eventDetail.participatingBusinessesCount')]}
            listStyle={{
              width: 350,
              height: 400,
            }}
            showSearch
          />
        </Modal>
      </Spin>
      
      {/* 圖片預覽模態框 */}
      <Modal
        open={imagePreviewVisible}
        title={t('eventDetail.imagePreview')}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
        width={800}
        style={{ top: 20 }}
      >
        <Image
          width="100%"
          src={previewImage}
          style={{ maxHeight: '70vh', objectFit: 'contain' }}
        />
      </Modal>
    </div>
  );
};

export default EventDetail; 