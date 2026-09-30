<script>
  import { createPlants, statusLabel, statusColor, ROOMS } from '../lib/plants'

  const plants = createPlants()

  /** @type {string | null} */
  let selectedId = $state(null)

  const selected = $derived(plants.find((p) => p.id === selectedId) ?? null)

  /** @param {string} id */
  function openPlant(id) {
    selectedId = id
  }

  function closePlant() {
    selectedId = null
  }
</script>

<div class="phone-screen">
  {#if selected}
    <div class="phone-appbar">
      <button class="back-button" aria-label="Back to plant list" onclick={closePlant}>‹</button>
      <h2>{selected.name}</h2>
      <span class="plant-card-status" style="background-color: {statusColor(selected)}" title={statusLabel(selected)}></span>
    </div>

    <div class="plant-detail">
      <label class="detail-field">
        Name
        <input type="text" bind:value={selected.name} />
      </label>

      <label class="detail-field">
        Location
        <select bind:value={selected.room}>
          {#each ROOMS as room}
            <option value={room}>{room}</option>
          {/each}
        </select>
    </label>

      <div class="detail-stats">
        <div class="detail-stat">
          <span>💧 Water</span>
          <strong>{selected.water}%</strong>
        </div>
        <div class="detail-stat">
          <span>☀️ Light</span>
          <strong>{selected.light} DLI</strong>
        </div>
        <div class="detail-stat">
          <span>🌡️ Temp</span>
          <strong>{selected.temp}°F</strong>
        </div>
      </div>

      <span class="plant-card-watered">Last watered {selected.lastWatered}</span>

      <div class="detail-section">
        <h3>Care thresholds</h3>

        <div class="threshold-row">
          <span class="threshold-label">💧 Water %</span>
          <label class="threshold-field">
            Min
            <input
              type="number"
              min="0"
              max="100"
              bind:value={selected.waterMin}
              onchange={() => { if (selected.waterMin > selected.waterMax) selected.waterMax = selected.waterMin }}
            />
          </label>
          <label class="threshold-field">
            Max
            <input
              type="number"
              min="0"
              max="100"
              bind:value={selected.waterMax}
              onchange={() => { if (selected.waterMax < selected.waterMin) selected.waterMin = selected.waterMax }}
            />
          </label>
        </div>

        <div class="threshold-row">
          <span class="threshold-label">☀️ Light DLI</span>
          <label class="threshold-field">
            Min
            <input
              type="number"
              min="0"
              max="50"
              bind:value={selected.lightMin}
              onchange={() => { if (selected.lightMin > selected.lightMax) selected.lightMax = selected.lightMin }}
            />
          </label>
          <label class="threshold-field">
            Max
            <input
              type="number"
              min="0"
              max="50"
              bind:value={selected.lightMax}
              onchange={() => { if (selected.lightMax < selected.lightMin) selected.lightMin = selected.lightMax }}
            />
          </label>
        </div>

        <div class="threshold-row">
          <span class="threshold-label">🌡️ Temp °F</span>
          <label class="threshold-field">
            Min
            <input
              type="number"
              min="32"
              max="100"
              bind:value={selected.tempMin}
              onchange={() => { if (selected.tempMin > selected.tempMax) selected.tempMax = selected.tempMin }}
            />
          </label>
          <label class="threshold-field">
            Max
            <input
              type="number"
              min="32"
              max="100"
              bind:value={selected.tempMax}
              onchange={() => { if (selected.tempMax < selected.tempMin) selected.tempMin = selected.tempMax }}
            />
          </label>
        </div>
      </div>

      <div class="detail-section">
        <button class="remove-button">Remove plant</button>
      </div>
    </div>
  {:else}
    <div class="phone-appbar">
      <h2>My Plants</h2>
      <span class="phone-appbar-count">{plants.length} plants</span>
    </div>

    <div class="plant-list">
      {#each plants as plant (plant.id)}
        <button class="plant-card" onclick={() => openPlant(plant.id)}>
          <div class="plant-card-body">
            <div class="plant-card-title">
              <span class="plant-card-name">{plant.name}</span>
              <span class="plant-card-status" style="background-color: {statusColor(plant)}" title={statusLabel(plant)}></span>
            </div>
            <span class="plant-card-room">{plant.room}</span>
            <div class="plant-card-stats">
              <span title="Water">💧 {plant.water}%</span>
              <span title="Sunlight">☀️ {plant.light} DLI</span>
              <span title="Temperature">🌡️ {plant.temp}°F</span>
            </div>
            <span class="plant-card-watered">Watered {plant.lastWatered}</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .phone-screen {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg);
  }

  .phone-appbar {
    flex: 0 0 auto;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 4px 18px 12px;
    border-bottom: 1px solid var(--border);
  }

  .phone-appbar h2 {
    margin: 0;
    font-size: 20px;
    color: var(--text-h);
  }

  .phone-appbar-count {
    font-size: 12px;
    color: var(--text);
  }

  .plant-list {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .plant-card {
    display: flex;
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--panel-bg);
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  .plant-card:hover {
    border-color: var(--text-h);
  }

  .plant-card-body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .plant-card-title {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .plant-card-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-h);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .plant-card-status {
    flex: 0 0 auto;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .plant-card-room {
    font-size: 12px;
    color: var(--text);
  }

  .plant-card-stats {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: var(--text);
    margin-top: 4px;
  }

  .plant-card-watered {
    font-size: 11px;
    color: var(--text);
    opacity: 0.75;
    margin-top: 2px;
  }

  .back-button {
    flex: 0 0 auto;
    border: none;
    background: none;
    font-size: 24px;
    line-height: 1;
    color: var(--text-h);
    cursor: pointer;
    padding: 0 6px 0 0;
  }

  .plant-detail {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 12px 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .detail-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: var(--text);
  }

  .detail-field input[type='text'],
  .detail-field select {
    font: inherit;
    font-size: 14px;
    color: var(--text-h);
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--panel-bg);
  }

  .detail-stats {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--panel-bg);
  }

  .detail-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--text);
  }

  .detail-stat strong {
    font-size: 14px;
    color: var(--text-h);
  }

  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
  }

  .detail-section h3 {
    margin: 0;
    font-size: 13px;
    color: var(--text-h);
  }

  .threshold-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .threshold-label {
    flex: 1 1 auto;
    font-size: 13px;
    color: var(--text-h);
  }

  .threshold-field {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text);
  }

  .threshold-field input[type='number'] {
    width: 56px;
    font: inherit;
    font-size: 13px;
    color: var(--text-h);
    padding: 4px 6px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--panel-bg);
  }

  .remove-button {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid var(--border);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    background: none;
    color: #e5533d;
    border-color: #e5533d;
  }
</style>
