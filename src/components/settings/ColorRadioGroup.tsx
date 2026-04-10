import { CheckOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

export interface PresetColor {
  value: string
  label?: string
}

interface ColorRadioGroupProps {
  value: string
  onChange: (value: string) => void
  colors?: PresetColor[]
}

const defaultColors: PresetColor[] = [
  { value: '#1677ff', label: '经典蓝' },
  { value: '#1f2937', label: '深灰' },
  { value: '#e6a23c', label: '温暖橙' },
  { value: '#f56c6c', label: '活力红' },
  { value: '#909399', label: '优雅灰' },
  { value: '#9c27b0', label: '神秘紫' },
  { value: '#00bcd4', label: '青翠蓝' },
  { value: '#ff9800', label: '明亮橙' },
]

export default function ColorRadioGroup({ value, onChange, colors = defaultColors }: ColorRadioGroupProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {colors.map(color => (
        <Tooltip title={color.label} key={color.value}>
          <button
            type="button"
            onClick={() => onChange(color.value)}
            aria-label={color.label || color.value}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              backgroundColor: color.value,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: value === color.value ? 'scale(1.08)' : 'scale(1)',
              boxShadow: value === color.value ? '0 0 0 2px rgba(22, 119, 255, 0.4)' : 'none',
            }}
          >
            {value === color.value ? <CheckOutlined style={{ fontSize: 12 }} /> : null}
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
