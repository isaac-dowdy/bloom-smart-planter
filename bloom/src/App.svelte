<script>
  import { onMount } from 'svelte'

  let now = $state(new Date())

  onMount(() => {
    const interval = setInterval(() => (now = new Date()), 1000)
    return () => clearInterval(interval)
  })

  const timeString = $derived(now.toLocaleTimeString())
  const dateString = $derived(
    now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  )

  // dummy sensor readings until real hardware data is wired up
  let sensors = $state([
    { label: 'Sunlight', icon: '☀️', color: '#f5a623', value: 68, min: 0, max: 100, idealMin: 50, idealMax: 80, unit: '%', step: 2 },
    { label: 'Water', icon: '💧', color: '#2f8fd1', value: 42, min: 0, max: 100, idealMin: 40, idealMax: 70, unit: '%', step: 2 },
    { label: 'Temperature', icon: '🌡️', color: '#e5533d', value: 74, min: 32, max: 100, idealMin: 65, idealMax: 80, unit: '°F', step: 1 },
  ])

  /** @param {number} value @param {number} min @param {number} max */
  function percent(value, min, max) {
    return ((value - min) / (max - min)) * 100
  }

  /** @param {{ value: number, idealMin: number, idealMax: number }} sensor */
  function inRange(sensor) {
    return sensor.value >= sensor.idealMin && sensor.value <= sensor.idealMax
  }

  /** @param {{ value: number, min: number, max: number }} sensor @param {number} delta */
  function adjust(sensor, delta) {
    sensor.value = Math.min(sensor.max, Math.max(sensor.min, sensor.value + delta))
  }

  /** @param {{ value: number, idealMin: number, idealMax: number }} sensor */
  function isOutOfRange(sensor) {
    return sensor.value < sensor.idealMin || sensor.value > sensor.idealMax
  }
</script>

<div class="layout">
  <header class="top-bar">
    <div class="top-bar-brand">
      <h1>Bloom Smart Planter</h1>
      <div class="top-bar-author">Isaac Dowdy</div>
    </div>
    <div class="top-bar-controls">
      {#each sensors as sensor}
        <div class="sensor-controls">
          <span class="sensor-icon" title={sensor.label} aria-hidden="true">{sensor.icon}</span>
          <button aria-label="Decrease {sensor.label}" onclick={() => adjust(sensor, -sensor.step)}>−</button>
          <button aria-label="Increase {sensor.label}" onclick={() => adjust(sensor, sensor.step)}>+</button>
        </div>
      {/each}
    </div>
    <div class="top-bar-info">
      <p>Project information</p>
    </div>
  </header>

  <main class="panels">
    <section class="panel panel-pot">
      <div class="panel-pot-lip">
        <div class="pot-top">
          <div class="pot-icons">
            {#each sensors as sensor}
              {#if isOutOfRange(sensor)}
                <span class="pot-icon" style="color: {sensor.color}" title="{sensor.label} out of range" aria-hidden="true">{sensor.icon}</span>
              {/if}
            {/each}
          </div>
          <div class="pot-clock">
            <span class="pot-time">{timeString}</span>
            <span class="pot-date">{dateString}</span>
          </div>
        </div>
      </div>
      <div class="panel-pot-main">
        <div class="sensor-list">
          {#each sensors as sensor}
            <div class="sensor">
              <div class="sensor-header">
                <span class="sensor-icon" title={sensor.label} aria-hidden="true">{sensor.icon}</span>
                <span class="sr-only">{sensor.label}</span>
                <span class="sensor-value">{sensor.value}{sensor.unit}</span>
              </div>
              <div class="sensor-bar">
                <div
                  class="sensor-range"
                  style="left: {percent(sensor.idealMin, sensor.min, sensor.max)}%; width: {percent(sensor.idealMax, sensor.min, sensor.max) - percent(sensor.idealMin, sensor.min, sensor.max)}%"
                ></div>
                <div
                  class="sensor-fill"
                  style="width: {percent(sensor.value, sensor.min, sensor.max)}%; background-color: {sensor.color}; filter: brightness({inRange(sensor) ? 1.1 : 0.55}) saturate({inRange(sensor) ? 1 : 0.6})"
                ></div>
                <div class="sensor-bracket sensor-bracket--start" style="left: {percent(sensor.idealMin, sensor.min, sensor.max)}%"></div>
                <div class="sensor-bracket sensor-bracket--end" style="left: {percent(sensor.idealMax, sensor.min, sensor.max)}%"></div>
                <div class="sensor-bracket-value sensor-bracket-value--start" style="left: {percent(sensor.idealMin, sensor.min, sensor.max)}%">{sensor.idealMin}{sensor.unit}</div>
                <div class="sensor-bracket-value sensor-bracket-value--end" style="left: {percent(sensor.idealMax, sensor.min, sensor.max)}%">{sensor.idealMax}{sensor.unit}</div>
              </div>
              <div class="sensor-scale">
                <span>{sensor.min}{sensor.unit}</span>
                <span>{sensor.max}{sensor.unit}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="panel panel-phone">Mock secondary device goes here (might swap this to the left later)</section>

    <section class="panel panel-mockup">Pot image/mockup goes here</section>
  </main>
</div>
