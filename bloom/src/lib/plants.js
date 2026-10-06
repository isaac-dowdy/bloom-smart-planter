import { generateHistory } from './utils'

/**
 * @typedef {Object} Plant
 * @property {string} id
 * @property {string} name
 * @property {string} room
 * @property {number} water
 * @property {number} waterMin
 * @property {number} waterMax
 * @property {number} light
 * @property {number} lightMin
 * @property {number} lightMax
 * @property {number} temp
 * @property {number} tempMin
 * @property {number} tempMax
 * @property {string} lastWatered
 * @property {boolean} notifications
 * @property {number} wateringIntervalDays how many days this plant can typically go between waterings before it drops from full to its low-water threshold
 * @property {number[]} waterHistory rolling log of simulated water readings, oldest first
 * @property {number[]} lightHistory rolling log of simulated light readings, oldest first
 * @property {number[]} tempHistory rolling log of simulated temperature readings, oldest first
 */

const BASE_PLANTS = [
  { id: 'p1', name: 'Fiddle Leaf Fig', room: 'Living Room', water: 62, waterMin: 40, waterMax: 70, light: 18, lightMin: 10, lightMax: 25, temp: 74, tempMin: 65, tempMax: 80, lastWatered: '2 days ago', notifications: true, wateringIntervalDays: 7 },
  { id: 'p2', name: 'Pothos', room: 'Kitchen', water: 55, waterMin: 35, waterMax: 65, light: 12, lightMin: 5, lightMax: 15, temp: 71, tempMin: 65, tempMax: 78, lastWatered: '1 day ago', notifications: true, wateringIntervalDays: 9 },
  { id: 'p3', name: 'Snake Plant', room: 'Bedroom', water: 18, waterMin: 20, waterMax: 45, light: 9, lightMin: 5, lightMax: 20, temp: 68, tempMin: 60, tempMax: 80, lastWatered: '6 days ago', notifications: true, wateringIntervalDays: 18 },
  { id: 'p4', name: 'Monstera', room: 'Office', water: 58, waterMin: 40, waterMax: 70, light: 21, lightMin: 12, lightMax: 25, temp: 76, tempMin: 65, tempMax: 80, lastWatered: '2 days ago', notifications: false, wateringIntervalDays: 8 },
  { id: 'p5', name: 'Basil', room: 'Kitchen', water: 11, waterMin: 45, waterMax: 75, light: 30, lightMin: 20, lightMax: 35, temp: 82, tempMin: 65, tempMax: 80, lastWatered: '8 days ago', notifications: true, wateringIntervalDays: 2 },
  { id: 'p6', name: 'Succulent Mix', room: 'Balcony', water: 40, waterMin: 15, waterMax: 40, light: 35, lightMin: 25, lightMax: 45, temp: 78, tempMin: 65, tempMax: 90, lastWatered: '4 days ago', notifications: true, wateringIntervalDays: 21 },
]

/** @returns {Plant[]} */
export function createPlants() {
  return BASE_PLANTS.map((plant) => ({
    ...plant,
    waterHistory: generateHistory(plant.waterMin, plant.waterMax, 0, 100),
    lightHistory: generateHistory(plant.lightMin, plant.lightMax, 0, 50),
    tempHistory: generateHistory(plant.tempMin, plant.tempMax, 32, 100),
  }))
}

/**
 * Computes a plant's live status from how its water/light/temp readings compare to the
 * thresholds set for that plant, so the status light reacts to edits instead of staying fixed.
 * @param {Plant} plant
 * @returns {'good' | 'warning' | 'critical'}
 */
export function plantStatus(plant) {
  const metrics = [
    { value: plant.water, min: plant.waterMin, max: plant.waterMax },
    { value: plant.light, min: plant.lightMin, max: plant.lightMax },
    { value: plant.temp, min: plant.tempMin, max: plant.tempMax },
  ]

  let outOfRangeCount = 0
  let worstOverage = 0

  for (const { value, min, max } of metrics) {
    const width = max - min || 1
    const overage = Math.max(0, min - value, value - max) / width
    if (overage > 0) outOfRangeCount++
    worstOverage = Math.max(worstOverage, overage)
  }

  if (outOfRangeCount === 0) return 'good'
  if (outOfRangeCount >= 2 || worstOverage > 0.25) return 'critical'
  return 'warning'
}

/** @param {Plant} plant */
export function statusLabel(plant) {
  switch (plantStatus(plant)) {
    case 'critical':
      return 'Needs attention'
    case 'warning':
      return 'Check soon'
    default:
      return 'Healthy'
  }
}

/** @param {Plant} plant */
export function statusColor(plant) {
  switch (plantStatus(plant)) {
    case 'critical':
      return '#e5533d'
    case 'warning':
      return '#f5a623'
    default:
      return '#4caf50'
  }
}
