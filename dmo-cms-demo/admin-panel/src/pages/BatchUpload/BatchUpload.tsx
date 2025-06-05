import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Table, 
  message, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Space,
  Alert,
  Divider
} from 'antd';
import { 
  UploadOutlined, 
  DownloadOutlined, 
  InboxOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import type { UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface UploadRecord {
  id: string;
  fileName: string;
  uploadTime: string;
  status: 'success' | 'processing' | 'failed';
  recordCount: number;
  errorMessage?: string;
}

const BatchUpload: React.FC = () => {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [recentUploads] = useState<UploadRecord[]>([
    {
      id: '1',
      fileName: '大稻埕商家名單_20240325.xlsx',
      uploadTime: '2024-03-25 14:30:00',
      status: 'success',
      recordCount: 25,
    },
    {
      id: '2',
      fileName: '新增商家清單_20240320.xlsx',
      uploadTime: '2024-03-20 10:15:00',
      status: 'success',
      recordCount: 18,
    },
    {
      id: '3',
      fileName: '商家資料更新_20240318.xlsx',
      uploadTime: '2024-03-18 16:45:00',
      status: 'failed',
      recordCount: 0,
      errorMessage: '檔案格式錯誤',
    },
    {
      id: '4',
      fileName: '台北市商家_20240315.xlsx',
      uploadTime: '2024-03-15 09:20:00',
      status: 'processing',
      recordCount: 32,
    },
  ]);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error(t('batchUpload.onlyExcelAllowed'));
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error(t('batchUpload.fileSizeLimit'));
        return false;
      }
      return false; // 阻止自動上傳，由手動處理
    },
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setUploading(true);
      }
      if (info.file.status === 'done') {
        setUploading(false);
        message.success(`${info.file.name} ${t('batchUpload.uploadSuccessMsg')}`);
      } else if (info.file.status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} ${t('batchUpload.uploadFailedMsg')}`);
      }
    },
    onDrop: (e) => {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleDownloadTemplate = () => {
    // 創建範本檔案下載
    // 這裡應該實際生成 Excel 檔案
    message.success(t('batchUpload.downloadingTemplate'));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'processing':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'success':
        return <Tag color="success">{t('common.success')}</Tag>;
      case 'processing':
        return <Tag color="processing">{t('common.processing')}</Tag>;
      case 'failed':
        return <Tag color="error">{t('common.failed')}</Tag>;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: t('batchUpload.fileName'),
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <Space>
          <FileExcelOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: t('batchUpload.uploadTime'),
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    },
    {
      title: t('batchUpload.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: UploadRecord) => (
        <Space>
          {getStatusIcon(status)}
          {getStatusTag(status)}
          {record.errorMessage && (
            <Text type="danger" style={{ fontSize: 12 }}>
              ({record.errorMessage})
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: t('batchUpload.recordCount'),
      dataIndex: 'recordCount',
      key: 'recordCount',
      render: (count: number) => (
        <Text strong>{count} {t('batchUpload.records')}</Text>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1>{t('batchUpload.title')}</h1>
        <Paragraph type="secondary">
          {t('batchUpload.description')}
        </Paragraph>
      </div>

      <Row gutter={24}>
        <Col span={16}>
          <Card title={t('batchUpload.uploadFile')} style={{ marginBottom: 24 }}>
            <Alert
              message={t('batchUpload.uploadTip')}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Dragger {...uploadProps} style={{ padding: '20px 0' }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: 16 }}>
                {t('batchUpload.dragUpload')}
              </p>
              <p className="ant-upload-hint" style={{ color: '#666' }}>
                {t('batchUpload.supportedFormats')}
              </p>
            </Dragger>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<UploadOutlined />}
                loading={uploading}
                size="large"
              >
                {uploading ? t('batchUpload.uploading') : t('batchUpload.uploadFile')}
              </Button>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title={t('batchUpload.quickActions')}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="default" 
                icon={<DownloadOutlined />}
                block
                onClick={handleDownloadTemplate}
              >
                {t('batchUpload.downloadTemplate')}
              </Button>
              
              <Divider />
              
              <div>
                <Text strong>{t('batchUpload.templateDescription')}</Text>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>{t('batchUpload.templateInstructions')}</li>
                  <li>{t('batchUpload.nameRequired')}</li>
                  <li>{t('batchUpload.addressRequired')}</li>
                  <li>{t('batchUpload.maxRecords')}</li>
                </ul>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title={t('batchUpload.recentUploads')}>
        <Table
          columns={columns}
          dataSource={recentUploads}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.items')}`,
          }}
        />
      </Card>
    </div>
  );
};

export default BatchUpload; 