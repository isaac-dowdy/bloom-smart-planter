<script>
  import { onMount } from 'svelte'

  /** @type {string | null} */
  let expandedLabel = $state(null)

  onMount(() => {
    const interval = setInterval(() => {
      // sensor history and state remain static
    }, 1000)
    return () => clearInterval(interval)
  })

  const startupTime = new Date()
  const timeString = startupTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  const dateString = startupTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // dummy sensor readings until real hardware data is wired up
  /** @type {{ label: string, icon: string, color: string, value: number, min: number, max: number, idealMin: number, idealMax: number, unit: string, step: number, history?: number[] }[]} */
  let sensors = $state([
    { label: 'Sunlight', icon: '☀️', color: '#f5a623', value: 12, min: 0, max: 50, idealMin: 10, idealMax: 30, unit: ' DLI', step: 2 },
    { label: 'Water', icon: '💧', color: '#2f8fd1', value: 42, min: 0, max: 100, idealMin: 40, idealMax: 70, unit: '%', step: 2 },
    { label: 'Temperature', icon: '🌡️', color: '#e5533d', value: 74, min: 32, max: 100, idealMin: 65, idealMax: 80, unit: '°F', step: 1 },
  ])

  /** deterministic wavy sample data so the sparkline/expanded charts render a static graph */
  /** @param {number} idealMin @param {number} idealMax @param {number} min @param {number} max @param {number} points */
  function generateHistory(idealMin, idealMax, min, max, points = 40) {
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

  // initialize static history
  sensors.forEach((s) => {
    if (!s.history) s.history = generateHistory(s.idealMin, s.idealMax, s.min, s.max)
  })

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

  /** @param {{ label: string }} sensor */
  function toggleExpand(sensor) {
    expandedLabel = expandedLabel === sensor.label ? null : sensor.label
  }

  /** @param {{ history?: number[], value: number }} sensor */
  function historyStats(sensor) {
    const h = sensor.history && sensor.history.length ? sensor.history : [sensor.value]
    const min = Math.min(...h)
    const max = Math.max(...h)
    const avg = h.reduce((a, b) => a + b, 0) / h.length
    return { min, max, avg: Math.round(avg * 10) / 10 }
  }

  function sparklinePoints(/** @type {number[] | undefined} */ history, w = 120, h = 30) {
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
            <div
              class="sensor"
              class:sensor--expanded={expandedLabel === sensor.label}
              role="button"
              tabindex="0"
              aria-expanded={expandedLabel === sensor.label}
              onclick={() => toggleExpand(sensor)}
              onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpand(sensor)}
            >
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
              <div class="sensor-sparkline">
                <svg width="120" height="30" viewBox="0 0 120 30" preserveAspectRatio="none">
                  <polyline fill="none" stroke="currentColor" stroke-width="1.5" points={sparklinePoints(sensor.history,120,30)} />
                </svg>
              </div>

              {#if expandedLabel === sensor.label}
                {@const stats = historyStats(sensor)}
                <div class="sensor-expanded" role="group">
                  <div class="sensor-expanded-chart">
                    <svg width="100%" height="120" viewBox="0 0 480 120" preserveAspectRatio="none">
                      <polyline fill="none" stroke="currentColor" stroke-width="2" points={sparklinePoints(sensor.history,480,120)} />
                    </svg>
                  </div>
                  <div class="sensor-stats">
                    <span>min {stats.min}{sensor.unit}</span>
                    <span>avg {stats.avg}{sensor.unit}</span>
                    <span>max {stats.max}{sensor.unit}</span>
                  </div>
                  <div class="sensor-expanded-controls">
                    <label class="slider-label">
                      Target min
                      <input
                        type="range"
                        min={sensor.min}
                        max={sensor.max}
                        step={sensor.step}
                        value={sensor.idealMin}
                        oninput={(e) => (sensor.idealMin = Math.min(+e.currentTarget.value, sensor.idealMax))}
                      />
                    </label>
                    <label class="slider-label">
                      Target max
                      <input
                        type="range"
                        min={sensor.min}
                        max={sensor.max}
                        step={sensor.step}
                        value={sensor.idealMax}
                        oninput={(e) => (sensor.idealMax = Math.max(+e.currentTarget.value, sensor.idealMin))}
                      />
                    </label>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="panel panel-phone">Mock secondary device goes here (might swap this to the left later)</section>

    <section class="panel panel-mockup">Pot image/mockup goes here</section>
  </main>
</div>
