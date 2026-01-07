<script>
    import { annotations } from '$lib/stores.js';
    import { categories } from '$lib/stores.js';
    import { countAnnotationsByComuna } from '$lib/utils/geoUtils.js';

    let ranking = [];

    $: {
        ranking = countAnnotationsByComuna($annotations);
    }

    $: top5 = ranking.filter(c => c.count > 0).slice(0, 5);
    $: comunasActivas = ranking.filter(c => c.count > 0).length;

    // Contador por categoría
    $: categoryCounts = categories.map(cat => ({
        ...cat,
        count: $annotations.filter(a => a.category === cat.name).length
    }));
</script>

<div class="bottom-bar">
    <!-- Logo Section -->
    <div class="logo-section">
            <img src="https://d26q11cgz8q0ri.cloudfront.net/2025/09/25000650/LOGO-CLBB-ORIGINAL-BLANCO-APAISADO.png" alt="logo" class="logo-image" />
    </div>

    <div class="divider-vertical"></div>

    <!-- Stats Section -->
    <div class="stats-section">
        <div class="stat-card total">
            <span class="stat-number">{$annotations.length}</span>
            <span class="stat-label">Total</span>
        </div>

        <div class="stat-card">
            <span class="stat-number">{comunasActivas}</span>
            <span class="stat-label">Comunas</span>
        </div>
    </div>

    <div class="divider-vertical"></div>

    <!-- Categories Section -->
    <div class="categories-section">
        <div class="section-title">
            <span>Por Categoría</span>
        </div>
        <div class="categories-grid">
            {#each categoryCounts as cat}
                <div class="category-item">
                    <div class="category-dot" style="background-color: {cat.color}"></div>
                    <span class="category-label">{cat.label}</span>
                    <span class="category-count">{cat.count}</span>
                </div>
            {/each}
        </div>
    </div>

    {#if top5.length > 0}
        <div class="divider-vertical"></div>

        <!-- Ranking Section -->
        <div class="ranking-section">
            <div class="section-title">
                <span>Top Comunas</span>
            </div>
            <div class="ranking-list">
                {#each top5 as { nombre, count }, index}
                    <div class="ranking-item" class:first={index === 0} class:second={index === 1} class:third={index === 2}>
                        <span class="position">{index + 1}</span>
                        <span class="name">{nombre}</span>
                        <span class="count">{count}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(44, 44, 44, 0.85);
        backdrop-filter: blur(12px);
        border-top: 2px solid rgba(247, 55, 79, 0.3);
        z-index: 100;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
        padding: 16px 24px;
        display: flex;
        align-items: center;
        gap: 24px;
        min-height: 90px;
    }

    /* Logo Section */
    .logo-section {
        display: flex;
        align-items: center;
        min-width: 120px;
    }

    .logo-placeholder {
        width: 80px;
        height: 60px;
        background: linear-gradient(135deg, #F7374F 0%, #88304E 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(247, 55, 79, 0.4);
    }

    .logo-text {
        color: #F9F8F6;
        font-weight: 700;
        font-size: 16px;
        letter-spacing: 1px;
    }

    .logo-image {
        height: 60px;
        width: auto;
        object-fit: contain;
    }

    /* Stats Section */
    .stats-section {
        display: flex;
        gap: 16px;
    }

    .stat-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 80px;
        padding: 8px 16px;
        background: rgba(82, 37, 70, 0.4);
        border-radius: 8px;
        border: 1px solid rgba(136, 48, 78, 0.5);
    }

    .stat-card.total {
        background: linear-gradient(135deg, rgba(247, 55, 79, 0.8) 0%, rgba(136, 48, 78, 0.8) 100%);
        border: 1px solid rgba(247, 55, 79, 0.6);
    }

    .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: #F9F8F6;
        line-height: 1;
    }

    .stat-label {
        font-size: 12px;
        color: rgba(249, 248, 246, 0.7);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 4px;
        font-weight: 600;
    }

    /* Dividers */
    .divider-vertical {
        width: 2px;
        height: 60px;
        background: linear-gradient(to bottom, transparent, rgba(136, 48, 78, 0.5) 20%, rgba(136, 48, 78, 0.5) 80%, transparent);
        flex-shrink: 0;
    }

    /* Section Title */
    .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 700;
        color: rgba(249, 248, 246, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    /* Categories Section */
    .categories-section {
        display: flex;
        flex-direction: column;
        min-width: 280px;
    }

    .categories-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }

    .category-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        background: rgba(82, 37, 70, 0.3);
        border-radius: 6px;
        border: 1px solid rgba(136, 48, 78, 0.4);
        transition: all 0.2s;
    }

    .category-item:hover {
        background: rgba(82, 37, 70, 0.5);
        border-color: rgba(247, 55, 79, 0.5);
    }

    .category-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
        box-shadow: 0 0 8px currentColor;
    }

    .category-label {
        font-size: 13px;
        color: #F9F8F6;
        font-weight: 500;
        flex: 1;
    }

    .category-count {
        font-weight: 700;
        font-size: 15px;
        color: #F7374F;
        min-width: 24px;
        text-align: right;
    }

    /* Ranking Section */
    .ranking-section {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
    }

    .ranking-list {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 4px;
    }

    .ranking-list::-webkit-scrollbar {
        height: 4px;
    }

    .ranking-list::-webkit-scrollbar-track {
        background: rgba(82, 37, 70, 0.3);
        border-radius: 2px;
    }

    .ranking-list::-webkit-scrollbar-thumb {
        background: #F7374F;
        border-radius: 2px;
    }

    .ranking-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px;
        background: rgba(82, 37, 70, 0.4);
        border-radius: 8px;
        white-space: nowrap;
        min-width: 140px;
        border: 1px solid rgba(136, 48, 78, 0.5);
        transition: all 0.2s;
    }

    .ranking-item:hover {
        transform: translateY(-2px);
        background: rgba(82, 37, 70, 0.6);
        border-color: rgba(247, 55, 79, 0.6);
    }

    .ranking-item.first {
        background: linear-gradient(135deg, rgba(247, 55, 79, 0.5) 0%, rgba(136, 48, 78, 0.5) 100%);
        border-color: rgba(247, 55, 79, 0.7);
        box-shadow: 0 0 12px rgba(247, 55, 79, 0.3);
    }

    .ranking-item.second {
        background: rgba(136, 48, 78, 0.4);
        border-color: rgba(136, 48, 78, 0.7);
    }

    .ranking-item.third {
        background: rgba(82, 37, 70, 0.5);
        border-color: rgba(82, 37, 70, 0.7);
    }

    .position {
        font-weight: 700;
        font-size: 18px;
        color: rgba(249, 248, 246, 0.5);
        min-width: 22px;
        text-align: center;
    }

    .ranking-item.first .position,
    .ranking-item.second .position,
    .ranking-item.third .position {
        color: #F7374F;
    }

    .name {
        font-size: 14px;
        color: #F9F8F6;
        font-weight: 600;
        flex: 1;
    }

    .count {
        font-weight: 700;
        font-size: 16px;
        color: #F7374F;
        background: rgba(249, 248, 246, 0.1);
        padding: 2px 10px;
        border-radius: 12px;
        border: 1px solid rgba(247, 55, 79, 0.3);
    }

    /* Tablet adjustments */
    @media (max-width: 1024px) {
        .bottom-bar {
            flex-wrap: wrap;
            min-height: auto;
            padding: 12px 16px;
            gap: 16px;
        }

        .logo-section {
            min-width: 80px;
        }

        .logo-placeholder {
            width: 60px;
            height: 50px;
        }

        .logo-text {
            font-size: 14px;
        }

        .categories-section {
            order: 3;
            width: 100%;
            min-width: 0;
        }

        .ranking-section {
            order: 4;
            width: 100%;
        }

        .divider-vertical:last-of-type {
            display: none;
        }
    }

    /* Mobile adjustments */
    @media (max-width: 640px) {
        .bottom-bar {
            padding: 10px 12px;
            gap: 12px;
            background: rgba(44, 44, 44, 0.9);
        }

        .logo-placeholder {
            width: 50px;
            height: 40px;
        }

        .logo-text {
            font-size: 12px;
        }

        .stats-section {
            gap: 8px;
        }

        .stat-card {
            min-width: 60px;
            padding: 6px 12px;
        }

        .stat-number {
            font-size: 22px;
        }

        .stat-label {
            font-size: 10px;
        }

        .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
        }

        .category-item {
            padding: 4px 8px;
        }

        .category-label {
            font-size: 12px;
        }

        .category-count {
            font-size: 14px;
        }

        .ranking-item {
            min-width: 120px;
            padding: 6px 10px;
            gap: 8px;
        }

        .name {
            font-size: 12px;
        }

        .count {
            font-size: 14px;
            padding: 2px 8px;
        }

        .divider-vertical {
            display: none;
        }
    }
</style>