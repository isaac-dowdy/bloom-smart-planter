import { generateHistory } from './utils'

/**
 * @typedef {Object} Sensor
 * @property {string} label
 * @property {string} icon
 * @property {string} color
 * @property {number} value
 * @property {number} min
 * @property {number} max
 * @property {number} idealMin
 * @property {number} idealMax
 * @property {string} unit
 * @property {number} step
 * @property {number[]} [history]
 */

export function createSensors() {
  /** @type {Sensor[]} */
  const sensors = [
    { label: 'Sunlight', icon: '☀️', color: '#f5a623', value: 12, min: 0, max: 50, idealMin: 10, idealMax: 30, unit: ' DLI', step: 2 },
    { label: 'Water', icon: '💧', color: '#2f8fd1', value: 42, min: 0, max: 100, idealMin: 40, idealMax: 70, unit: '%', step: 2 },
    { label: 'Temperature', icon: '🌡️', color: '#e5533d', value: 74, min: 32, max: 100, idealMin: 65, idealMax: 80, unit: '°F', step: 1 },
  ]

  sensors.forEach((s) => {
    s.history = generateHistory(s.idealMin, s.idealMax, s.min, s.max)
  })

  return sensors
}

export { percent, inRange, isOutOfRange, adjust, historyStats, sparklinePoints } from './utils'
