<script>
  import { inRange, historyStats, sparklinePoints, percent } from '../lib/sensors'

  /** @type {{ label: string, icon: string, color: string, value: number, min: number, max: number, idealMin: number, idealMax: number, unit: string, step: number, history?: number[] }} */
  export let sensor

  /** @type {boolean} */
  export let expanded = false

  /** @type {() => void} */
  export let onToggleExpand
</script>

<div
  class="sensor"
  class:sensor--expanded={expanded}
  role="button"
  tabindex="0"
  aria-expanded={expanded}
  onclick={() => onToggleExpand()}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleExpand()}
>
  <div class="sensor-header">
    <span class="sensor-icon" title={sensor.label} aria-hidden="true">{sensor.icon}</span>
    <span class="sr-only">{sensor.label}</span>
    <span class="sensor-value">{sensor.value}{sensor.unit}</span>
    <span class="sensor-caret" aria-hidden="true">▼</span>
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
  {#if !expanded}
    <div class="sensor-sparkline">
      <svg width="120" height="30" viewBox="0 0 120 30" preserveAspectRatio="none">
        <polyline fill="none" stroke="currentColor" stroke-width="1.5" points={sparklinePoints(sensor.history, 120, 30)} />
      </svg>
    </div>
  {/if}

  {#if expanded}
    {@const stats = historyStats(sensor)}
    {@const sampleCount = sensor.history?.length ?? 0}
    <div class="sensor-expanded" role="group">
      <div class="sensor-cards">
        <div class="sensor-card">
          <span class="sensor-card-label">Minimum</span>
          <span class="sensor-card-value">{stats.min}{sensor.unit}</span>
        </div>
        <div class="sensor-card">
          <span class="sensor-card-label">Maximum</span>
          <span class="sensor-card-value">{stats.max}{sensor.unit}</span>
        </div>
        <div class="sensor-card">
          <span class="sensor-card-label">Average</span>
          <span class="sensor-card-value">{stats.avg}{sensor.unit}</span>
        </div>
        <div class="sensor-card sensor-card--chart">
          <span class="sensor-card-label">{sensor.label} over last {sampleCount}h</span>
          <svg class="sensor-card-chart" width="100%" height="48" viewBox="0 0 480 48" preserveAspectRatio="none">
            <polyline fill="none" stroke="currentColor" stroke-width="2" points={sparklinePoints(sensor.history, 480, 48)} />
          </svg>
        </div>
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

