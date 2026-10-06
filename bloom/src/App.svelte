<script>
  import { onMount } from 'svelte'
  import { createPlantSensors, adjust, isOutOfRange } from './lib/sensors'
  import { createPlants } from './lib/plants'
  import { simulateHour, SIM_DURATION_HOURS } from './lib/simulate'
  import Sensor from './components/Sensor.svelte'
  import PhoneApp from './components/PhoneApp.svelte'

  /** @type {string | null} */
  let expandedLabel = $state(null)

  let plants = $state(createPlants())

  // the plant currently shown in the middle panel; defaults to the first plant listed
  /** @type {string | null} */
  let viewedPlantId = $state(plants[0]?.id ?? null)

  const selectedPlant = $derived(plants.find((p) => p.id === viewedPlantId) ?? null)

  // the middle panel always shows a real plant's water/light/temp data
  const displaySensors = $derived(selectedPlant ? createPlantSensors(selectedPlant) : [])

  const startupTime = new Date()

  /** @param {Date} date */
  function formatTime(date) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }

  /** @param {Date} date */
  function formatDate(date) {
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  /** @param {{ label: string }} sensor */
  function toggleExpand(sensor) {
    expandedLabel = expandedLabel === sensor.label ? null : sensor.label
  }

  // --- "simulate a day" --------------------------------------------------
  // Triggered by the header button: steps every plant forward one simulated hour at a time
  // (light/temp follow a day-night cycle, water drains and auto-waters/alerts as thresholds
  // are crossed) so every sensor bar, sparkline, status dot, and the pot clock animate live.
  let simulating = $state(false)
  let simHoursElapsed = $state(0)
  /** @type {{ id: number, text: string }[]} */
  let simToasts = $state([])
  let simToastSeq = 0
  /** @type {ReturnType<typeof setInterval> | undefined} */
  let simInterval

  const simulatedNow = $derived(new Date(startupTime.getTime() + simHoursElapsed * 60 * 60 * 1000))
  const simProgressPercent = $derived(Math.min(100, (simHoursElapsed / SIM_DURATION_HOURS) * 100))

  /** @param {string} text */
  function addSimToast(text) {
    const id = ++simToastSeq
    simToasts.push({ id, text })
    setTimeout(() => {
      const index = simToasts.findIndex((t) => t.id === id)
      if (index !== -1) simToasts.splice(index, 1)
    }, 4000)
  }

  function startSimulation() {
    if (simulating) return
    simulating = true
    simHoursElapsed = 0
    simToasts = []
    for (const plant of plants) /** @type {any} */ (plant)._waterRemainder = 0
    simInterval = setInterval(() => {
      simHoursElapsed += 1
      const hourOfDay = simHoursElapsed % 24
      const wateredPlants = simulateHour(plants, hourOfDay)
      for (const plant of wateredPlants) addSimToast(`${plant.name} auto-watered`)
      if (simHoursElapsed >= SIM_DURATION_HOURS) stopSimulation()
    }, 350)
  }

  function stopSimulation() {
    simulating = false
    clearInterval(simInterval)
  }

  function toggleSimulation() {
    if (simulating) stopSimulation()
    else startSimulation()
  }

  onMount(() => {
    return () => clearInterval(simInterval)
  })
</script>

<div class="layout">
  <header class="top-bar">
    <div class="top-bar-brand">
      <h1>Bloom Smart Planter</h1>
      <div class="top-bar-author">Isaac Dowdy</div>
    </div>
    <div class="top-bar-controls">
      {#each displaySensors as sensor}
        <div class="sensor-controls">
          <span class="sensor-icon" title={sensor.label} aria-hidden="true">{sensor.icon}</span>
          <button aria-label="Decrease {sensor.label}" disabled={simulating} onclick={() => adjust(sensor, -sensor.step)}>−</button>
          <button aria-label="Increase {sensor.label}" disabled={simulating} onclick={() => adjust(sensor, sensor.step)}>+</button>
        </div>
      {/each}
    </div>
    <div class="top-bar-sim">
      <button class="sim-button" class:sim-button--active={simulating} onclick={toggleSimulation}>
        {#if simulating}
          ⏹ Stop simulation · {formatTime(simulatedNow)}
        {:else}
          ▶ Simulate a day
        {/if}
      </button>
      {#if simulating}
        <div class="sim-progress" role="progressbar" aria-valuenow={Math.round(simProgressPercent)} aria-valuemin="0" aria-valuemax="100">
          <div class="sim-progress-fill" style="width: {simProgressPercent}%"></div>
        </div>
      {/if}
    </div>
    <div class="top-bar-info">
      <p>Project information</p>
    </div>
  </header>

  <main class="panels">
    <section class="panel panel-phone">
      <PhoneApp {plants} onSelectPlant={(id) => (viewedPlantId = id)} />
    </section>
    <section class="panel panel-pot">
      <div class="panel-pot-lip">
        <div class="pot-top">
          <div class="pot-clock">
            <span class="pot-time">{simulating ? formatTime(simulatedNow) : formatTime(startupTime)}</span>
            <span class="pot-date">{simulating ? formatDate(simulatedNow) : formatDate(startupTime)}</span>
          </div>
          <div class="pot-icons">
            {#each displaySensors as sensor}
              {#if isOutOfRange(sensor)}
                <span class="pot-icon" style="color: {sensor.color}" title="{sensor.label} out of range" aria-hidden="true">{sensor.icon}</span>
              {/if}
            {/each}
          </div>
          
        </div>
      </div>
      <div class="panel-pot-main">
        <div class="sensor-list">
          {#each displaySensors as sensor}
            <Sensor {sensor} expanded={expandedLabel === sensor.label} onToggleExpand={() => toggleExpand(sensor)} />
          {/each}
        </div>
      </div>

      {#if selectedPlant || simToasts.length}
        <div class="toast-list">
          {#each simToasts as toast (toast.id)}
            <div class="toast toast--event">{toast.text}</div>
          {/each}
          {#if selectedPlant}
            <div class="toast">{selectedPlant.name}</div>
          {/if}
        </div>
      {/if}
    </section>

    <section class="panel panel-mockup">Pot image/mockup goes here</section>
  </main>
</div>
