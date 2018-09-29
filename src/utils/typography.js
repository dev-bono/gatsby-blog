import Typography from 'typography'

const typography = new Typography({
  baseFontSize: '15px',
  baseLineHeight: '1.8',
  headerFontFamily: [
    'Noto Sans Light',
    'Malgun Gothic',
    'NanumGothic',
    'sans-serif',
  ],
  bodyFontFamily: [
    'Noto Sans Light',
    'Malgun Gothic',
    'NanumGothic',
    'sans-serif',
  ],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
