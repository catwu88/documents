import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Upload, 
  Tag, 
  Space, 
  Row, 
  Col,
  Divider,
  message,
  Spin,
  Image,
  InputNumber,
  Popover
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  RobotOutlined,
  StarOutlined,
  BulbOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockBusinesses } from '../../data/mockData';
import type { Business } from '../../types';

const { TextArea } = Input;
const { Option } = Select;

const BusinessDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const isEditing = id && id !== 'new';

  useEffect(() => {
    if (isEditing) {
      // 模擬載入商家資料
      const foundBusiness = mockBusinesses.find(b => b.id === id);
      if (foundBusiness) {
        setBusiness(foundBusiness);
        setPhotos(foundBusiness.photos || []);
        setTags(foundBusiness.tags || []);
        form.setFieldsValue({
          name: foundBusiness.name,
          address: foundBusiness.address,
          phone: foundBusiness.phone,
          website: foundBusiness.website,
          description: foundBusiness.description,
          specialOffer: foundBusiness.specialOffer,
          category: foundBusiness.category,
          latitude: foundBusiness.latitude,
          longitude: foundBusiness.longitude,
          status: foundBusiness.status
        });
      }
    }
  }, [id, isEditing, form]);

  const handleSubmit = async (_values: any) => {
    setLoading(true);
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // const businessData = {
      //   ...values,
      //   photos,
      //   tags,
      //   id: isEditing ? id : Date.now().toString(),
      //   createdAt: isEditing ? business?.createdAt : new Date().toISOString(),
      //   updatedAt: new Date().toISOString()
      // };

      message.success(isEditing ? '商家更新成功！' : '商家創建成功！');
      navigate('/businesses');
    } catch (error) {
      message.error('操作失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (_info: any) => {
    // 模擬照片上傳
    const newPhoto = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
    setPhotos([...photos, newPhoto]);
    message.success('照片上傳成功');
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
      setShowAiSuggestions(true);
    } catch (error) {
      message.error('AI美化失敗，請稍後再試');
    } finally {
      setAiEnhancing(false);
    }
  };

  const predefinedTags = [
    '咖啡廳', '餐廳', '小吃', '甜點', '飲料',
    '服飾', '書店', '文具', '禮品', '手工藝',
    '景點', '博物館', '公園', '古蹟', '展覽',
    '表演', '音樂', '藝術', '文化', '教育',
    '網美景點', '親子友善', '寵物友善', '無障礙', '停車方便'
  ];

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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/businesses')}
          style={{ marginRight: 16 }}
        >
          返回
        </Button>
        <h1>{isEditing ? '編輯商家' : '新增商家'}</h1>
      </div>

      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'pending'
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Card title="基本資訊" style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="商家名稱"
                      rules={[{ required: true, message: '請輸入商家名稱' }]}
                    >
                      <Input placeholder="請輸入商家名稱" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="主要分類"
                      rules={[{ required: true, message: '請選擇主要分類' }]}
                      tooltip="選擇商家的主要業務類型，用於基本分類和篩選"
                    >
                      <Select placeholder="請選擇主要分類">
                        <Option value="餐飲">餐飲</Option>
                        <Option value="購物">購物</Option>
                        <Option value="景點">景點</Option>
                        <Option value="文化">文化</Option>
                        <Option value="娛樂">娛樂</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="address"
                  label="地址"
                  rules={[{ required: true, message: '請輸入地址' }]}
                >
                  <Input placeholder="請輸入完整地址" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="phone" label="電話">
                      <Input placeholder="請輸入聯絡電話" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="website" label="網站">
                      <Input placeholder="請輸入網站網址" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item 
                  name="description" 
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 8 }}>
                      <span>描述</span>
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
                >
                  <TextArea 
                    rows={4} 
                    placeholder="請輸入商家描述，包含特色、服務內容等，或點擊右上角AI助手幫您美化文案..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item 
                  name="specialOffer" 
                  label="特別優惠訊息"
                  tooltip="輸入商家的特別優惠、促銷活動或限時折扣等資訊"
                >
                  <TextArea 
                    rows={3} 
                    placeholder="例如：新客戶享9折優惠、買一送一活動、會員專屬折扣等..."
                    maxLength={300}
                    showCount
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="latitude" label="緯度">
                      <InputNumber 
                        style={{ width: '100%' }}
                        placeholder="25.0330"
                        step={0.000001}
                        precision={6}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="longitude" label="經度">
                      <InputNumber 
                        style={{ width: '100%' }}
                        placeholder="121.5654"
                        step={0.000001}
                        precision={6}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="照片管理" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handlePhotoUpload}
                  >
                    <Button icon={<UploadOutlined />}>上傳照片</Button>
                  </Upload>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {photos.map((photo, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <Image
                        width={120}
                        height={120}
                        src={photo}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removePhoto(index)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'rgba(0,0,0,0.5)',
                          color: 'white'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="特色標籤管理">
                <p style={{ color: '#666', marginBottom: 16, fontSize: 13 }}>
                  添加描述商家特色、服務內容或氛圍的標籤，幫助用戶更好地了解商家特點
                </p>
                <div style={{ marginBottom: 16 }}>
                  <Space wrap>
                    {tags.map(tag => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => removeTag(tag)}
                        color="blue"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </div>
                
                <Divider orientation="left">常用特色標籤</Divider>
                <Space wrap>
                  {predefinedTags.map(tag => (
                    <Tag
                      key={tag}
                      style={{ cursor: 'pointer' }}
                      onClick={() => addTag(tag)}
                      color={tags.includes(tag) ? 'blue' : 'default'}
                    >
                      <PlusOutlined style={{ marginRight: 4 }} />
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="狀態管理" style={{ marginBottom: 24 }}>
                <Form.Item name="status" label="狀態">
                  <Select>
                    <Option value="pending">待審核</Option>
                    <Option value="approved">已審核</Option>
                    <Option value="published">已上架</Option>
                    <Option value="rejected">已拒絕</Option>
                  </Select>
                </Form.Item>

                {isEditing && business && (
                  <div>
                    <Divider />
                    <div style={{ fontSize: 12, color: '#666' }}>
                      <div>創建時間：{new Date(business.createdAt).toLocaleString('zh-TW')}</div>
                      <div>更新時間：{new Date(business.updatedAt).toLocaleString('zh-TW')}</div>
                      {business.rating && (
                        <div>評分：{business.rating} ⭐ ({business.reviewCount} 則評論)</div>
                      )}
                    </div>
                  </div>
                )}
              </Card>

              {isEditing && business?.analytics && (
                <Card title="數據概覽">
                  <div style={{ fontSize: 14 }}>
                    <div style={{ marginBottom: 8 }}>
                      瀏覽量：<strong>{business.analytics.views.toLocaleString()}</strong>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      點擊量：<strong>{business.analytics.clicks.toLocaleString()}</strong>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      點擊率：<strong>{business.analytics.clickThroughRate}%</strong>
                    </div>
                    <div>
                      轉換率：<strong>{business.analytics.conversionRate}%</strong>
                    </div>
                  </div>
                </Card>
              )}
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Space>
              <Button onClick={() => navigate('/businesses')}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {isEditing ? '更新商家' : '創建商家'}
              </Button>
            </Space>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default BusinessDetail; 