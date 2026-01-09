<script>
    import {
        activeTopic,
        topics,
        selectedFeatures,
        totalPopulation,
        genderBreakdown,
        ageGroupsData,
        employmentData,
        literacyData,
        housingData,
        avgAge,
        householdData,
        isLensActive
    } from '$lib/stores/lensStore.js';

    function setTopic(topicId) {
        activeTopic.set(topicId);
    }

    // Get max for age chart scaling
    $: ageMax = Math.max(...$ageGroupsData.map(d => d.count), 1);
</script>

<aside class="sidebar">
    <header class="sidebar-header">
        <h2>Análisis Demográfico</h2>
        <span class="manzanas-count">{$selectedFeatures.length} manzanas</span>
    </header>

    {#if !$isLensActive}
        <div class="empty-state">
            <div class="icon">🎯</div>
            <p>Mueve el cursor sobre el mapa para explorar</p>
            <span class="hint">Scroll para cambiar el radio</span>
        </div>
    {:else}
        <!-- Topic Content -->
        <div class="topic-content">
            {#if $activeTopic === 'population'}
                <h3>Población y Género</h3>

                <div class="big-number">
                    <span class="value">{$totalPopulation.toLocaleString('es-CL')}</span>
                    <span class="label">Población total</span>
                </div>

                <div class="donut-chart">
                    <svg viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#333" stroke-width="16"/>
                        <circle
                                cx="60" cy="60" r="50"
                                fill="none"
                                stroke="#4a9eff"
                                stroke-width="16"
                                stroke-dasharray="{$genderBreakdown.malePercent * 3.14} 314"
                                transform="rotate(-90 60 60)"
                        />
                        <circle
                                cx="60" cy="60" r="50"
                                fill="none"
                                stroke="#ff6b9d"
                                stroke-width="16"
                                stroke-dasharray="{$genderBreakdown.femalePercent * 3.14} 314"
                                stroke-dashoffset="-{$genderBreakdown.malePercent * 3.14}"
                                transform="rotate(-90 60 60)"
                        />
                    </svg>
                </div>

                <div class="legend">
                    <div class="legend-item">
                        <span class="color-box male"></span>
                        <span class="label">Hombres</span>
                        <span class="value">{$genderBreakdown.male.toLocaleString('es-CL')} ({$genderBreakdown.malePercent}%)</span>
                    </div>
                    <div class="legend-item">
                        <span class="color-box female"></span>
                        <span class="label">Mujeres</span>
                        <span class="value">{$genderBreakdown.female.toLocaleString('es-CL')} ({$genderBreakdown.femalePercent}%)</span>
                    </div>
                </div>

                <div class="stat-row">
                    <span class="stat-label">Edad promedio</span>
                    <span class="stat-value">{$avgAge} años</span>
                </div>

            {:else if $activeTopic === 'age-pyramid'}
                <h3>Distribución por Edad</h3>

                <div class="age-bars">
                    {#each $ageGroupsData as group}
                        <div class="age-row">
                            <span class="age-label">{group.label}</span>
                            <div class="bar-track">
                                <div
                                        class="bar-fill"
                                        style="width: {(group.count / ageMax) * 100}%"
                                ></div>
                            </div>
                            <span class="age-count">{group.count.toLocaleString('es-CL')}</span>
                        </div>
                    {/each}
                </div>

            {:else if $activeTopic === 'employment'}
                <h3>Situación Laboral</h3>

                <div class="stat-cards">
                    <div class="stat-card employed">
                        <span class="card-value">{$employmentData.employed.toLocaleString('es-CL')}</span>
                        <span class="card-label">Ocupados</span>
                        <span class="card-percent">{$employmentData.employedPercent}%</span>
                    </div>
                    <div class="stat-card unemployed">
                        <span class="card-value">{$employmentData.unemployed.toLocaleString('es-CL')}</span>
                        <span class="card-label">Desocupados</span>
                        <span class="card-percent">{$employmentData.unemployedPercent}%</span>
                    </div>
                    <div class="stat-card inactive">
                        <span class="card-value">{$employmentData.inactive.toLocaleString('es-CL')}</span>
                        <span class="card-label">Fuera fuerza laboral</span>
                        <span class="card-percent">{$employmentData.inactivePercent}%</span>
                    </div>
                </div>

            {:else if $activeTopic === 'literacy'}
                <h3>Alfabetización</h3>

                <div class="stat-bars">
                    <div class="stat-bar">
                        <div class="stat-label">
                            <span>Alfabetizados</span>
                            <span>{$literacyData.literate.toLocaleString('es-CL')}</span>
                        </div>
                        <div class="bar-track">
                            <div class="bar-fill literate" style="width: {$literacyData.literatePercent}%"></div>
                        </div>
                        <span class="percent">{$literacyData.literatePercent}%</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-label">
                            <span>Analfabetos</span>
                            <span>{$literacyData.illiterate.toLocaleString('es-CL')}</span>
                        </div>
                        <div class="bar-track">
                            <div class="bar-fill illiterate" style="width: {$literacyData.illiteratePercent}%"></div>
                        </div>
                        <span class="percent">{$literacyData.illiteratePercent}%</span>
                    </div>
                </div>

            {:else if $activeTopic === 'housing'}
                <h3>Vivienda</h3>

                <div class="housing-stats">
                    <div class="housing-total">
                        <span class="value">{$housingData.totalViv.toLocaleString('es-CL')}</span>
                        <span class="label">Viviendas particulares</span>
                    </div>

                    <div class="housing-grid">
                        <div class="housing-item">
                            <span class="icon">🏠</span>
                            <span class="count">{$housingData.casa.toLocaleString('es-CL')}</span>
                            <span class="type">Casas</span>
                        </div>
                        <div class="housing-item">
                            <span class="icon">🏢</span>
                            <span class="count">{$housingData.depto.toLocaleString('es-CL')}</span>
                            <span class="type">Deptos</span>
                        </div>
                        <div class="housing-item">
                            <span class="icon">✅</span>
                            <span class="count">{$housingData.ocupadas.toLocaleString('es-CL')}</span>
                            <span class="type">Ocupadas</span>
                        </div>
                        <div class="housing-item">
                            <span class="icon">⬜</span>
                            <span class="count">{$housingData.desocupadas.toLocaleString('es-CL')}</span>
                            <span class="type">Desocupadas</span>
                        </div>
                    </div>
                </div>

            {:else if $activeTopic === 'households'}
                <h3>Hogares</h3>

                <div class="big-number">
                    <span class="value">{$householdData.total.toLocaleString('es-CL')}</span>
                    <span class="label">Total hogares</span>
                </div>

                <div class="household-list">
                    <div class="household-item">
                        <span class="label">Unipersonales</span>
                        <span class="value">{$householdData.unipersonal.toLocaleString('es-CL')}</span>
                    </div>
                    <div class="household-item">
                        <span class="label">Con menores</span>
                        <span class="value">{$householdData.conMenores.toLocaleString('es-CL')}</span>
                    </div>
                    <div class="household-item">
                        <span class="label">Con adulto mayor (60+)</span>
                        <span class="value">{$householdData.adultoMayor.toLocaleString('es-CL')}</span>
                    </div>
                    <div class="household-item highlight">
                        <span class="label">Jefatura femenina</span>
                        <span class="value">{$householdData.jefaturaMujer.toLocaleString('es-CL')}</span>
                    </div>
                </div>

            {:else}
                <div class="coming-soon">
                    <p>Visualización "{$activeTopic}" próximamente</p>
                </div>
            {/if}
        </div>

        <!-- Topic Selector Pills -->
        <div class="topic-selector">
            <div class="pills">
                {#each topics as topic}
                    <button
                            class="pill"
                            class:active={$activeTopic === topic.id}
                            on:click={() => setTopic(topic.id)}
                    >
                        {topic.label}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</aside>

<style>
    .sidebar {
        width: 320px;
        max-height: 50vh;
        background: rgba(20, 25, 35, 0.95);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        backdrop-filter: blur(10px);
    }

    .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .sidebar-header h2 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #ffffff;
    }

    .manzanas-count {
        font-size: 0.75rem;
        color: #4ecdc4;
        background: rgba(78, 205, 196, 0.15);
        padding: 4px 10px;
        border-radius: 12px;
    }

    .empty-state {
        padding: 40px 20px;
        text-align: center;
        color: #888;
    }

    .empty-state .icon {
        font-size: 3rem;
        margin-bottom: 16px;
    }

    .empty-state p {
        margin: 0 0 8px;
        font-size: 0.95rem;
    }

    .empty-state .hint {
        font-size: 0.75rem;
        color: #666;
    }

    .topic-content {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
    }

    .topic-content h3 {
        margin: 0 0 20px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #aaa;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Big Number */
    .big-number {
        text-align: center;
        margin-bottom: 24px;
    }

    .big-number .value {
        display: block;
        font-size: 2.5rem;
        font-weight: 700;
        color: #ffffff;
    }

    .big-number .label {
        font-size: 0.8rem;
        color: #888;
    }

    /* Donut Chart */
    .donut-chart {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
    }

    .donut-chart svg {
        width: 140px;
        height: 140px;
    }

    /* Legend */
    .legend {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .color-box {
        width: 14px;
        height: 14px;
        border-radius: 3px;
    }

    .color-box.male { background: #4a9eff; }
    .color-box.female { background: #ff6b9d; }

    .legend-item .label {
        color: #ffffff;
        font-size: 0.875rem;
        flex: 1;
    }

    .legend-item .value {
        color: #888;
        font-size: 0.8rem;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.1);
    }

    .stat-row .stat-label {
        color: #888;
        font-size: 0.875rem;
    }

    .stat-row .stat-value {
        color: #4ecdc4;
        font-weight: 600;
    }

    /* Age Bars */
    .age-bars {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .age-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .age-label {
        width: 50px;
        font-size: 0.75rem;
        color: #888;
        text-align: right;
    }

    .bar-track {
        flex: 1;
        height: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #4a9eff, #4ecdc4);
        border-radius: 4px;
        transition: width 0.3s ease;
    }

    .age-count {
        width: 50px;
        font-size: 0.75rem;
        color: #aaa;
    }

    /* Stat Cards */
    .stat-cards {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .stat-card {
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 8px;
    }

    .stat-card .card-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #fff;
    }

    .stat-card .card-label {
        font-size: 0.8rem;
        color: #888;
        flex: 1;
    }

    .stat-card .card-percent {
        font-size: 0.9rem;
        font-weight: 600;
    }

    .stat-card.employed .card-percent { color: #4ecdc4; }
    .stat-card.unemployed .card-percent { color: #ff6b6b; }
    .stat-card.inactive .card-percent { color: #888; }

    /* Stat Bars */
    .stat-bars {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .stat-bar .stat-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        color: #ffffff;
        margin-bottom: 6px;
    }

    .stat-bar .bar-track {
        height: 24px;
    }

    .bar-fill.literate { background: #4ecdc4; }
    .bar-fill.illiterate { background: #ff6b6b; }

    .percent {
        font-size: 0.75rem;
        color: #888;
        text-align: right;
        margin-top: 4px;
    }

    /* Housing */
    .housing-stats {
        text-align: center;
    }

    .housing-total {
        margin-bottom: 24px;
    }

    .housing-total .value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: #fff;
    }

    .housing-total .label {
        font-size: 0.8rem;
        color: #888;
    }

    .housing-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .housing-item {
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        padding: 16px 12px;
        text-align: center;
    }

    .housing-item .icon {
        display: block;
        font-size: 1.5rem;
        margin-bottom: 8px;
    }

    .housing-item .count {
        display: block;
        font-size: 1.25rem;
        font-weight: 700;
        color: #fff;
    }

    .housing-item .type {
        font-size: 0.75rem;
        color: #888;
    }

    /* Households */
    .household-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .household-item {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
    }

    .household-item .label {
        color: #aaa;
        font-size: 0.875rem;
    }

    .household-item .value {
        color: #fff;
        font-weight: 600;
    }

    .household-item.highlight {
        background: rgba(255, 107, 157, 0.15);
        border: 1px solid rgba(255, 107, 157, 0.3);
    }

    .household-item.highlight .value {
        color: #ff6b9d;
    }

    .coming-soon {
        padding: 40px 20px;
        text-align: center;
        color: #666;
    }

    /* Topic Selector - integrated at bottom of sidebar */
    .topic-selector {
        padding: 16px;
        border-top: 1px solid rgba(255,255,255,0.1);
    }

    .selector-label {
        display: block;
        font-size: 0.75rem;
        color: #888;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .pill {
        padding: 8px 14px;
        background: rgba(255,255,255,0.08);
        border: 1px solid transparent;
        border-radius: 20px;
        color: #aaa;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .pill:hover {
        background: rgba(255,255,255,0.12);
        color: #ffffff;
    }

    .pill.active {
        background: #d4a72c;
        color: #000;
        font-weight: 600;
    }
</style>