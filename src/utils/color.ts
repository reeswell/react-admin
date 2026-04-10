interface RGB {
  r: number
  g: number
  b: number
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

export function hexToRGB(hex: string): RGB {
  const normalized = hex.trim().toLowerCase()
  const fullHex = normalized.length === 4
    ? `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`
    : normalized
  const match = /^#([0-9a-f]{6})$/i.exec(fullHex)
  if (!match) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  const value = match[1]
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (value: number) => clampChannel(value).toString(16).padStart(2, '0')
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

export function mix(color: RGB, mixColor: RGB, weight: number): RGB {
  return {
    r: color.r * (1 - weight) + mixColor.r * weight,
    g: color.g * (1 - weight) + mixColor.g * weight,
    b: color.b * (1 - weight) + mixColor.b * weight,
  }
}

export function genPrimaryVars(primaryHex: string): Record<string, string> {
  const base = hexToRGB(primaryHex)
  const light = mix(base, { r: 255, g: 255, b: 255 }, 0.2)
  const dark = mix(base, { r: 0, g: 0, b: 0 }, 0.2)

  return {
    '--primary-color': rgbToHex(base),
    '--primary-light-color': rgbToHex(light),
    '--primary-dark-color': rgbToHex(dark),
    '--primary-shadow-color': `rgba(${clampChannel(base.r)}, ${clampChannel(base.g)}, ${clampChannel(base.b)}, 0.2)`,
  }
}
