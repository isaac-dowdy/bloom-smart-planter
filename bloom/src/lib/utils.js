/** @param {number} value @param {number} min @param {number} max */
export function percent(value, min, max) {
  return ((value - min) / (max - min)) * 100
}

/** @param {{ value: number, idealMin: number, idealMax: number }} sensor */
export function inRange(sensor) {
  return sensor.value >= sensor.idealMin && sensor.value <= sensor.idealMax
}

/** @param {{ value: number, min: number, max: number }} sensor @param {number} delta */
export function adjust(sensor, delta) {
  sensor.value = Math.min(sensor.max, Math.max(sensor.min, sensor.value + delta))
}

/** @param {{ value: number, idealMin: number, idealMax: number }} sensor */
export function isOutOfRange(sensor) {
  return sensor.value < sensor.idealMin || sensor.value > sensor.idealMax
}

/** @param {{ history?: number[], value: number }} sensor */
export function historyStats(sensor) {
  const h = sensor.history && sensor.history.length ? sensor.history : [sensor.value]
  const min = Math.min(...h)
  const max = Math.max(...h)
  const avg = h.reduce((a, b) => a + b, 0) / h.length
  return { min, max, avg: Math.round(avg * 10) / 10 }
}

/** deterministic wavy sample data so the sparkline/expanded charts render a static graph */
/** @param {number} idealMin @param {number} idealMax @param {number} min @param {number} max @param {number} points */
export function generateHistory(idealMin, idealMax, min, max, points = 40) {
  const center = (idealMin + idealMax) / 2
  const amplitude = (idealMax - idealMin) / 2 || (max - min) / 8
  const history = []
  for (let i = 0; i < points; i++) {
    const wave = Math.sin(i / 4) * amplitude * 0.6 + Math.sin(i / 9) * amplitude * 0.3
    const v = Math.min(max, Math.max(min, Math.round(center + wave)))
    history.push(v)
  }
  return history
}

export function sparklinePoints(/** @type {number[] | undefined} */ history, w = 120, h = 30) {
  if (!history || history.length === 0) return ''
  const len = history.length
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1
  return history
    .map((/** @type {number} */ v, /** @type {number} */ i) => {
      const x = (i / (len - 1 || 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(' ')
}
