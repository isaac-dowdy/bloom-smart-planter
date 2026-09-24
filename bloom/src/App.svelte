<script>
  let showInfo = $state(false)
</script>

<header id="project-header">
  <!-- TODO: project title -->
  <h1>Bloom</h1>
  <!-- TODO: your name -->
  <p>By: </p>
  <!-- TODO: link to project write-up -->
  <a href="#">Project write-up</a>
  <button type="button" onclick={() => (showInfo = !showInfo)}>
    Info
  </button>
  {#if showInfo}
    <div id="info-popover">
      <!-- TODO: explain the test controls here -->
    </div>
  {/if}
</header>

<main id="layout">
  <section id="device-ui">
    <h2>Device UI</h2>
    <!-- TODO: mock-up of the smart object's interface goes here -->

    <div id="placement-graphic">
      <!-- TODO: graphic showing where this UI sits on the physical object -->
    </div>
  </section>

  <section id="testing-ui">
    <h2>Testing UI</h2>
    <!-- TODO: project info -->

    <!-- TODO: buttons to simulate use of the object, e.g. "water", "add sunlight" -->
  </section>
</main>

<style>
  #layout {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  #device-ui,
  #testing-ui {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    min-height: 480px;
  }

  #device-ui {
    flex: 2;
  }

  #testing-ui {
    flex: 1;
  }
</style>
