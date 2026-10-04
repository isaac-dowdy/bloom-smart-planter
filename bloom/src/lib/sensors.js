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

/** static metadata (icon/color/absolute range) for each plant metric, keyed by plant field name */
const PLANT_SENSOR_META = {
  light: { label: 'Sunlight', icon: '☀️', color: '#f5a623', min: 0, max: 50, unit: ' DLI', step: 2, valueKey: 'light', minKey: 'lightMin', maxKey: 'lightMax' },
  water: { label: 'Water', icon: '💧', color: '#2f8fd1', min: 0, max: 100, unit: '%', step: 2, valueKey: 'water', minKey: 'waterMin', maxKey: 'waterMax' },
  temp: { label: 'Temperature', icon: '🌡️', color: '#e5533d', min: 32, max: 100, unit: '°F', step: 1, valueKey: 'temp', minKey: 'tempMin', maxKey: 'tempMax' },
}

/**
 * Builds sensor-shaped objects (same shape as createSensors()) backed by a plant's own
 * water/light/temp fields, so reading/writing .value, .idealMin, .idealMax reads from and
 * writes back to the underlying plant.
 * @param {import('./plants').Plant} plant
 * @returns {Sensor[]}
 */
export function createPlantSensors(plant) {
  return Object.values(PLANT_SENSOR_META).map((meta) => ({
    label: meta.label,
    icon: meta.icon,
    color: meta.color,
    min: meta.min,
    max: meta.max,
    unit: meta.unit,
    step: meta.step,
    get value() {
      return plant[meta.valueKey]
    },
    set value(v) {
      plant[meta.valueKey] = Math.min(meta.max, Math.max(meta.min, v))
    },
    get idealMin() {
      return plant[meta.minKey]
    },
    set idealMin(v) {
      plant[meta.minKey] = v
    },
    get idealMax() {
      return plant[meta.maxKey]
    },
    set idealMax(v) {
      plant[meta.maxKey] = v
    },
    history: generateHistory(plant[meta.minKey], plant[meta.maxKey], meta.min, meta.max),
  }))
}

export { percent, inRange, isOutOfRange, adjust, historyStats, sparklinePoints } from './utils'
