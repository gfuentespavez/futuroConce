<script>
    import { annotations } from '$lib/stores.js';
    import { countAnnotationsByComuna } from '$lib/utils/geoUtils.js';

    let showRanking = false;
    let ranking = [];

    $: {
        ranking = countAnnotationsByComuna($annotations);
    }

    function toggleRanking() {
        showRanking = !showRanking;
    }
</script>

<button class="ranking-toggle" on:click={toggleRanking}>
    📊 Ranking
</button>

{#if showRanking}
    <div class="ranking-overlay" on:click={toggleRanking}></div>
    <div class="ranking-panel">
        <div class="ranking-header">
            <h2>Anotaciones por Comuna</h2>
            <button class="close-btn" on:click={toggleRanking}>✕</button>
        </div>

        <div class="ranking-list">
            {#each ranking as { nombre, count }, index}
                <div class="ranking-item" class:has-annotations={count > 0}>
                    <span class="ranking-position">{index + 1}</span>
                    <span class="ranking-name">{nombre}</span>
                    <span class="ranking-count">{count}</span>
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .ranking-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: white;
        border: none;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        z-index: 100;
        transition: all 0.2s;
    }

    .ranking-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .ranking-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .ranking-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }

    .ranking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .ranking-header h2 {
        margin: 0;
        font-size: 20px;
        color: #333;
    }

    .close-btn {
        background: rgba(0, 0, 0, 0.1);
        border: none;
        color: #666;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ranking-list {
        overflow-y: auto;
        padding: 10px 20px 20px;
    }

    .ranking-item {
        display: grid;
        grid-template-columns: 40px 1fr 60px;
        align-items: center;
        padding: 12px;
        margin: 5px 0;
        border-radius: 8px;
        background: #f8f9fa;
        opacity: 0.5;
    }

    .ranking-item.has-annotations {
        opacity: 1;
        background: linear-gradient(90deg, #e3f2fd 0%, white 100%);
    }

    .ranking-position {
        font-weight: 700;
        color: #666;
        font-size: 18px;
    }

    .ranking-item.has-annotations .ranking-position {
        color: #1976d2;
    }

    .ranking-name {
        font-size: 15px;
        color: #333;
    }

    .ranking-count {
        text-align: right;
        font-weight: 700;
        font-size: 18px;
        color: #1976d2;
    }

    /* Touch optimizations */
    @media (hover: none) {
        .ranking-toggle,
        .close-btn {
            min-height: 44px;
        }
    }
</style>