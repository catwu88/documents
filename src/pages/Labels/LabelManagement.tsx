import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Statistic, 
  Row, 
  Col,
  Popconfirm
} from 'antd';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  TagsOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface Label {
  id: string;
  name: string;
  description: string;
  color: string;
  category: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

const LabelManagement: React.FC = () => {
  const { t } = useLanguage();
  
  // 使用翻譯函數來獲取分類選項
  const getLabelCategories = () => [
    t('labels.categories.recommendation'),
    t('labels.categories.status'),
    t('labels.categories.feature'),
    t('labels.categories.facility'),
    t('labels.categories.promotion'),
    t('labels.categories.other')
  ];

  // 使用翻譯函數來獲取顏色選項
  const getColorOptions = () => [
    { value: '#ff4d4f', label: t('labels.colors.red') },
    { value: '#52c41a', label: t('labels.colors.green') },
    { value: '#1890ff', label: t('labels.colors.blue') },
    { value: '#722ed1', label: t('labels.colors.purple') },
    { value: '#fa8c16', label: t('labels.colors.orange') },
    { value: '#13c2c2', label: t('labels.colors.cyan') },
    { value: '#eb2f96', label: t('labels.colors.pink') },
    { value: '#faad14', label: t('labels.colors.yellow') }
  ];

  const [labels, setLabels] = useState<Label[]>([
    {
      id: '1',
      name: t('labels.sampleData.hotRecommended'),
      description: t('labels.sampleData.hotRecommendedDesc'),
      color: '#ff4d4f',
      category: t('labels.categories.recommendation'),
      usageCount: 45,
      createdAt: '2024-03-15',
      updatedAt: '2024-03-20'
    },
    {
      id: '2',
      name: t('labels.sampleData.newlyOpened'),
      description: t('labels.sampleData.newlyOpenedDesc'),
      color: '#52c41a',
      category: t('labels.categories.status'),
      usageCount: 23,
      createdAt: '2024-03-10',
      updatedAt: '2024-03-18'
    },
    {
      id: '3',
      name: t('labels.sampleData.familyFriendly'),
      description: t('labels.sampleData.familyFriendlyDesc'),
      color: '#1890ff',
      category: t('labels.categories.feature'),
      usageCount: 67,
      createdAt: '2024-03-08',
      updatedAt: '2024-03-19'
    },
    {
      id: '4',
      name: t('labels.sampleData.accessible'),
      description: t('labels.sampleData.accessibleDesc'),
      color: '#722ed1',
      category: t('labels.categories.facility'),
      usageCount: 34,
      createdAt: '2024-03-12',
      updatedAt: '2024-03-17'
    },
    {
      id: '5',
      name: t('labels.sampleData.promotion'),
      description: t('labels.sampleData.promotionDesc'),
      color: '#fa8c16',
      category: t('labels.categories.promotion'),
      usageCount: 89,
      createdAt: '2024-03-14',
      updatedAt: '2024-03-21'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [form] = Form.useForm();

  const labelCategories = getLabelCategories();
  const colorOptions = getColorOptions();

  const handleAddLabel = () => {
    setEditingLabel(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditLabel = (label: Label) => {
    setEditingLabel(label);
    form.setFieldsValue(label);
    setIsModalVisible(true);
  };

  const handleDeleteLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id));
    message.success(t('labels.deleteSuccess'));
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingLabel) {
        // Edit existing label
        setLabels(labels.map(label => 
          label.id === editingLabel.id 
            ? { ...label, ...values, updatedAt: new Date().toISOString().split('T')[0] }
            : label
        ));
        message.success(t('labels.updateSuccess'));
      } else {
        // Add new label
        const newLabel: Label = {
          id: Date.now().toString(),
          ...values,
          usageCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setLabels([...labels, newLabel]);
        message.success(t('labels.createSuccess'));
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingLabel(null);
  };

  const columns = [
    {
      title: t('labels.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Label) => (
        <Tag color={record.color} style={{ fontSize: '14px', padding: '4px 8px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: t('labels.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => {
        const maxLength = 30; // 限制顯示的字符數
        if (text.length <= maxLength) {
          return text;
        }
        return (
          <span title={text}>
            {text.substring(0, maxLength)}...
          </span>
        );
      },
    },
    {
      title: t('labels.category'),
      dataIndex: 'category',
      key: 'category',
      filters: labelCategories.map(category => ({ text: category, value: category })),
      onFilter: (value: any, record: Label) => record.category === value,
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: t('table.views'),
      dataIndex: 'usageCount',
      key: 'usageCount',
      sorter: (a: Label, b: Label) => a.usageCount - b.usageCount,
      render: (count: number) => (
        <Space>
          <EyeOutlined />
          {count}
        </Space>
      ),
    },
    {
      title: t('common.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Label, b: Label) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: t('common.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: Label, b: Label) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: t('common.actions'),
      key: 'action',
      render: (_: any, record: Label) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEditLabel(record)}
            size="small"
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('common.deleteConfirm')}
            description={t('common.deleteWarning')}
            onConfirm={() => handleDeleteLabel(record.id)}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            >
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>{t('labels.title')}</h1>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddLabel}
        >
          {t('labels.addNew')}
        </Button>
      </div>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title={t('labels.totalCount')}
              value={labels.length}
              prefix={<TagsOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title={t('labels.totalUsage')}
              value={labels.reduce((sum, label) => sum + label.usageCount, 0)}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title={t('labels.avgUsage')}
              value={Math.round(labels.reduce((sum, label) => sum + label.usageCount, 0) / labels.length)}
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title={t('labels.categoryCount')}
              value={new Set(labels.map(label => label.category)).size}
            />
          </Card>
        </Col>
      </Row>

      {/* Labels Table */}
      <Table
        columns={columns}
        dataSource={labels}
        rowKey="id"
        pagination={{
          total: labels.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.items')}`,
        }}
      />

      {/* Add/Edit Label Modal */}
      <Modal
        title={editingLabel ? t('labels.edit') : t('labels.addNew')}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            color: '#1890ff',
            category: t('labels.categories.other')
          }}
        >
          <Form.Item
            name="name"
            label={t('labels.name')}
            rules={[
              { required: true, message: t('labels.nameRequired') },
              { max: 20, message: t('labels.nameMaxLength') }
            ]}
          >
            <Input placeholder={t('labels.namePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('labels.description')}
            rules={[
              { required: true, message: t('labels.descriptionRequired') },
              { max: 100, message: t('labels.descriptionMaxLength') }
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder={t('labels.descriptionPlaceholder')}
              showCount
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label={t('labels.category')}
            rules={[{ required: true, message: t('labels.categoryRequired') }]}
          >
            <Select placeholder={t('labels.categoryPlaceholder')}>
              {labelCategories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="color"
            label={t('labels.color')}
            rules={[{ required: true, message: t('labels.colorRequired') }]}
          >
            <Select placeholder={t('labels.colorPlaceholder')}>
              {colorOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Space>
                    <div 
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: option.value,
                        borderRadius: 2,
                        display: 'inline-block'
                      }}
                    />
                    {option.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LabelManagement; 