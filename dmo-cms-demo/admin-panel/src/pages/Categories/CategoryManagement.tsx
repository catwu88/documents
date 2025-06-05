import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message,
  Space,
  Tag,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useLanguage } from '../../contexts/LanguageContext';

const { Option } = Select;

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  businessCount: number;
  isSystem: boolean;
}

const CategoryManagement: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: t('category.restaurant'), description: '餐廳、咖啡廳、小吃等飲食相關商家', color: '#ff6b6b', icon: '🍽️', businessCount: 45, isSystem: true },
    { id: '2', name: t('category.shopping'), description: '商店、市場、購物中心等零售商家', color: '#4ecdc4', icon: '🛍️', businessCount: 32, isSystem: true },
    { id: '3', name: t('category.attraction'), description: '觀光景點、公園、博物館等旅遊相關', color: '#45b7d1', icon: '📍', businessCount: 28, isSystem: true },
    { id: '4', name: t('category.culture'), description: '藝術館、文化中心、表演場所等', color: '#96ceb4', icon: '🏛️', businessCount: 15, isSystem: true },
    { id: '5', name: '娛樂', description: '娛樂場所、休閒活動等', color: '#feca57', icon: '🎮', businessCount: 8, isSystem: false }
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.isSystem) {
      message.warning(t('categories.cannotDeleteSystem'));
      return;
    }
    
    if (category.businessCount > 0) {
      message.warning(t('categories.cannotDeleteWithBusinesses'));
      return;
    }

    Modal.confirm({
      title: t('categories.deleteConfirm'),
      content: t('categories.deleteWarning'),
      onOk: () => {
        setCategories(categories.filter(c => c.id !== category.id));
        message.success(t('categories.deleteSuccess'));
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        // 編輯
        setCategories(categories.map(c => 
          c.id === editingCategory.id ? { ...c, ...values } : c
        ));
        message.success(t('categories.updateSuccess'));
      } else {
        // 新增
        const newCategory: Category = {
          id: Date.now().toString(),
          ...values,
          businessCount: 0,
          isSystem: false
        };
        setCategories([...categories, newCategory]);
        message.success(t('categories.createSuccess'));
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(t('categories.operationFailed'));
    }
  };

  const columns = [
    {
      title: t('common.category'),
      key: 'category',
      render: (_: any, record: Category) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 20, marginRight: 8 }}>{record.icon}</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: t('categories.color'),
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              width: 20, 
              height: 20, 
              backgroundColor: color, 
              borderRadius: 4,
              marginRight: 8
            }} 
          />
          <span style={{ fontSize: 12, color: '#666' }}>{color}</span>
        </div>
      ),
    },
    {
      title: t('categories.businessCount'),
      dataIndex: 'businessCount',
      key: 'businessCount',
      width: 100,
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>{count}</Tag>
      ),
    },
    {
      title: t('categories.type'),
      key: 'type',
      width: 100,
      render: (_: any, record: Category) => (
        <Tag color={record.isSystem ? 'green' : 'orange'}>
          {record.isSystem ? t('categories.systemPredefinedType') : t('categories.customType')}
        </Tag>
      ),
    },
    {
      title: t('categories.actions'),
      key: 'action',
      width: 120,
      render: (_: any, record: Category) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditCategory(record)}
          />
          {!record.isSystem && (
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteCategory(record)}
            />
          )}
        </Space>
      ),
    },
  ];

  const totalBusinesses = categories.reduce((sum, cat) => sum + cat.businessCount, 0);
  const systemCategories = categories.filter(c => c.isSystem).length;
  const customCategories = categories.filter(c => !c.isSystem).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>{t('categories.title')}</h1>
          <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: 14 }}>
            {t('categories.description')}
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddCategory}
        >
          {t('categories.addNew')}
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title={t('categories.totalCategories')} value={categories.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={t('categories.systemPredefined')} value={systemCategories} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={t('categories.customCategories')} value={customCategories} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={t('categories.totalBusinesses')} value={totalBusinesses} />
          </Card>
        </Col>
      </Row>

      {/* Categories Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingCategory ? t('categories.editCategory') : t('categories.addCategory')}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label={t('categories.categoryName')}
            rules={[{ required: true, message: t('categories.nameRequired') }]}
          >
            <Input placeholder={t('categories.namePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('common.description')}
            rules={[{ required: true, message: t('categories.descriptionRequired') }]}
          >
            <Input.TextArea rows={3} placeholder={t('categories.descriptionPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="icon"
            label={t('categories.icon')}
            rules={[{ required: true, message: t('categories.iconRequired') }]}
          >
            <Input placeholder={t('categories.iconPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="color"
            label={t('categories.color')}
            rules={[{ required: true, message: t('categories.colorRequired') }]}
          >
            <Select placeholder={t('categories.colorPlaceholder')}>
              <Option value="#ff6b6b">紅色 🔴</Option>
              <Option value="#4ecdc4">青色 🟢</Option>
              <Option value="#45b7d1">藍色 🔵</Option>
              <Option value="#96ceb4">綠色 🟢</Option>
              <Option value="#feca57">黃色 🟡</Option>
              <Option value="#ff9ff3">粉色 🩷</Option>
              <Option value="#a29bfe">紫色 🟣</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? t('categories.update') : t('categories.add')}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement; 