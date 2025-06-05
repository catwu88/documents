  {/* 核心指標 */}
  <Row gutter={16} style={{ marginBottom: 24 }}>
    <Col span={8}>
      <Card>
        <Statistic
          title={t('analytics.totalViews')}
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
    <Col span={8}>
      <Card>
        <Statistic
          title={t('analytics.uniqueVisitors')}
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
    <Col span={8}>
      <Card>
        <Statistic
          title={t('analytics.totalFavorites')}
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