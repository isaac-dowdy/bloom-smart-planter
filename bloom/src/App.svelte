<script>
  import { onMount } from 'svelte'
  import { createSensors, adjust, isOutOfRange } from './lib/sensors'
  import Sensor from './components/Sensor.svelte'

  /** @type {string | null} */
  let expandedLabel = $state(null)

  let sensors = $state(createSensors())

  const startupTime = new Date()
  const timeString = startupTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  const dateString = startupTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  onMount(() => {
    const interval = setInterval(() => {
      // sensor history and state remain static
    }, 1000)
    return () => clearInterval(interval)
  })

  /** @param {{ label: string }} sensor */
  function toggleExpand(sensor) {
    expandedLabel = expandedLabel === sensor.label ? null : sensor.label
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
            <Sensor {sensor} expanded={expandedLabel === sensor.label} onToggleExpand={() => toggleExpand(sensor)} />
          {/each}
        </div>
      </div>
    </section>

    <section class="panel panel-phone">Mock secondary device goes here (might swap this to the left later)</section>

    <section class="panel panel-mockup">Pot image/mockup goes here</section>
  </main>
</div>
