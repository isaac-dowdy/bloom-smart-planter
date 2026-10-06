/**
 * Pre-scripted day-in-the-life simulation for the planter.
 *
 * Each simulated "tick" advances every plant by one simulated hour: light follows a
 * sunrise/sunset curve, water evaporates faster in bright/warm conditions, and the pot
 * waters itself back up to full once a plant crosses its low-water threshold.
 * Everything is deterministic (no randomness) so the same run always tells the same story.
 */

/** how many samples the rolling sparkline history keeps */
export const HISTORY_LENGTH = 40

/** how many simulated hours make up one run of the simulation */
export const SIM_DURATION_HOURS = 24

/** sun is up between these simulated hours (24h clock) */
const SUNRISE = 6
const SUNSET = 20

/**
 * @param {number} hour simulated hour of day, 0-23
 * @returns {number} 0 at night, rising to 1 around solar noon
 */
export function daylightFactor(hour) {
  if (hour <= SUNRISE || hour >= SUNSET) return 0
  const span = SUNSET - SUNRISE
  return Math.sin(((hour - SUNRISE) / span) * Math.PI)
}

/** @param {number[]} history @param {number} value */
function pushHistory(history, value) {
  history.push(Math.round(value))
  if (history.length > HISTORY_LENGTH) history.shift()
}

/**
 * Advances a single plant's simulated sensors by one simulated hour, mutating it in place.
 * @param {import('./plants').Plant} plant
 * @param {number} hour simulated hour of day, 0-23
 * @returns {boolean} true if the plant was watered this tick
 */
export function simulatePlantHour(plant, hour) {
  const daylight = daylightFactor(hour)

  // Light tracks the sun, slightly overshooting the ideal band at solar noon.
  const lightSpan = plant.lightMax - plant.lightMin
  const light = Math.max(0, Math.round(plant.lightMin + daylight * lightSpan * 1.3))
  plant.light = light
  pushHistory(plant.lightHistory, light)

  // Temperature runs a few degrees warmer whenever the sun is out.
  const tempBase = (plant.tempMin + plant.tempMax) / 2
  const temp = Math.round(tempBase - 4 + daylight * 8)
  plant.temp = temp
  pushHistory(plant.tempHistory, temp)

  // Water drains at a plant-specific rate: a thirsty basil can empty from full to its
  // low-water threshold in a couple of days, while a drought-tolerant succulent can go
  // weeks, so only some plants will actually need watering in any given simulated day.
  // Daylight still shapes *when* within the day that drain happens (faster at midday).
  //
  // plant.water is only ever stored/displayed as a whole number, but a slow drain (well
  // under 0.5%/hour) would otherwise get rounded away to nothing every tick. Carrying the
  // rounding remainder forward lets it build up across hours so it still shows up eventually.
  const dailyDryAmount = (plant.waterMax - plant.waterMin) / plant.wateringIntervalDays
  const evaporationRate = (dailyDryAmount / 24) * (0.4 + daylight * 1.6)
  let water = plant.water + (plant._waterRemainder ?? 0) - evaporationRate
  let watered = false

  if (water <= plant.waterMin) {
    water = plant.waterMax
    plant.lastWatered = 'today'
    watered = true
  }

  const roundedWater = Math.max(0, Math.round(water))
  plant._waterRemainder = watered ? 0 : water - roundedWater
  plant.water = roundedWater
  pushHistory(plant.waterHistory, plant.water)

  return watered
}

/**
 * Advances every plant by one simulated hour.
 * @param {import('./plants').Plant[]} plants
 * @param {number} hour simulated hour of day, 0-23
 * @returns {import('./plants').Plant[]} the plants that were watered this tick
 */
export function simulateHour(plants, hour) {
  return plants.filter((plant) => simulatePlantHour(plant, hour))
}
