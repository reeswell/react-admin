import { Card, Col, Row, Space, Tag, Typography } from 'antd'

const statusTags = [
  { color: 'processing', label: 'Tag 1' },
  { color: 'success', label: 'Tag 2' },
  { color: 'default', label: 'Tag 3' },
  { color: 'error', label: 'Tag 4' },
  { color: 'warning', label: 'Tag 5' },
] as const

const colorTokens = [
  { name: 'colorPrimary', value: '#1677ff' },
  { name: 'colorInfo', value: '#1677ff' },
  { name: 'colorSuccess', value: '#52c41a' },
  { name: 'colorWarning', value: '#faad14' },
  { name: 'colorError', value: '#ff4d4f' },
  { name: 'colorBgBase', value: '#ffffff' },
  { name: 'colorBgContainer', value: '#ffffff' },
  { name: 'colorText', value: '#000000e0' },
  { name: 'colorTextSecondary', value: '#000000a6' },
  { name: 'colorBorder', value: '#d9d9d9' },
] as const

export default function HomePage() {
  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Typography.Title level={4}>标签展示</Typography.Title>
        <Typography.Paragraph style={{ marginBottom: 8 }}>Dark</Typography.Paragraph>
        <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
          {statusTags.map(item => (
            <Tag key={`dark-${item.label}`} color={item.color}>
              {item.label}
            </Tag>
          ))}
          {statusTags.map(item => (
            <Tag key={`dark-close-${item.label}`} color={item.color} closable>
              {item.label}
            </Tag>
          ))}
        </Space>
        <Typography.Paragraph style={{ marginBottom: 8 }}>Plain</Typography.Paragraph>
        <Space wrap size={[8, 8]}>
          {statusTags.map(item => (
            <Tag key={`plain-${item.label}`} bordered color={item.color}>
              {item.label}
            </Tag>
          ))}
          {statusTags.map(item => (
            <Tag key={`plain-close-${item.label}`} bordered color={item.color} closable>
              {item.label}
            </Tag>
          ))}
        </Space>
      </Card>

      <Card>
        <Typography.Title level={4}>颜色展示</Typography.Title>
        <Row gutter={[12, 12]}>
          {colorTokens.map(token => (
            <Col key={token.name} xs={12} sm={8} md={6} lg={4}>
              <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fff' }}>
                <div style={{ height: 60, background: token.value }} />
                <div style={{ padding: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{token.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{token.value}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </Space>
  )
}
