<script>
    import { annotations } from '$lib/stores.js';
    import { categories } from '$lib/stores.js';
    import { countAnnotationsByComuna } from '$lib/utils/geoUtils.js';

    let ranking = [];

    $: {
        ranking = countAnnotationsByComuna($annotations);
    }

    $: top3 = ranking.filter(c => c.count > 0).slice(0, 3);
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

    {#if top3.length > 0}
        <div class="divider-vertical"></div>

        <!-- Ranking Section -->
        <div class="ranking-section">
            <div class="section-title">
                <span>Comunas con más comentarios</span>
            </div>
            <div class="ranking-grid">
                {#each top3 as { nombre, count }, index}
                    <div class="ranking-card" class:gold={index === 0} class:silver={index === 1} class:bronze={index === 2}>
                        <div class="rank-badge">{count}</div>
                        <div class="rank-content">
                            <span class="rank-name">{nombre}</span>
                        </div>
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
        background: rgba(44, 44, 44, 0.15);
        backdrop-filter: blur(20px);
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
        margin-bottom: 10px;
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
    /* Ranking Section - MEJORADO */
    .ranking-section {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        padding: 8px 16px;
    }

    .ranking-grid {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 4px;
    }

    .ranking-grid::-webkit-scrollbar {
        height: 3px;
    }

    .ranking-grid::-webkit-scrollbar-track {
        background: rgba(82, 37, 70, 0.2);
        border-radius: 2px;
    }

    .ranking-grid::-webkit-scrollbar-thumb {
        background: #F7374F;
        border-radius: 2px;
    }

    .ranking-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: rgba(82, 37, 70, 0.25);
        border: 1px solid rgba(136, 48, 78, 0.3);
        border-radius: 18px;
        white-space: nowrap;
        min-width: 140px;
        transition: all 0.3s ease;
        position: relative;
        overflow: visible; /* Cambiar de hidden a visible */
    }

    .ranking-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        background: linear-gradient(90deg, rgba(247, 55, 79, 0.2), transparent);
        transition: width 0.3s ease;
    }

    .ranking-card.gold {
        background: linear-gradient(135deg, rgba(247, 55, 79, 0.4) 0%, rgba(136, 48, 78, 0.3) 100%);
        border-color: #F7374F;
        box-shadow: 0 0 15px rgba(247, 55, 79, 0.4);
    }

    .ranking-card.silver {
        background: linear-gradient(135deg, rgba(136, 48, 78, 0.35) 0%, rgba(82, 37, 70, 0.3) 100%);
        border-color: #88304E;
    }

    .ranking-card.bronze {
        background: linear-gradient(135deg, rgba(82, 37, 70, 0.4) 0%, rgba(44, 44, 44, 0.3) 100%);
        border-color: #522546;
    }

    .rank-badge {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(249, 248, 246, 0.1);
        border: 2px solid rgba(249, 248, 246, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 16px;
        color: rgba(249, 248, 246, 0.6);
        flex-shrink: 0;
    }

    .ranking-card.gold .rank-badge {
        background: #FFCC05;
        border-color: #ffcc05;
        color: #F9F8F6;
        box-shadow: 0 0 8px rgba(247, 55, 79, 0.4) inset, 0 0 4px rgba(247, 55, 79, 0.3); /* Reducir glow */
    }

    .ranking-card.silver .rank-badge {
        background: #88304E;
        border-color: #88304E;
        color: #F9F8F6;
        box-shadow: none; /* Sin glow */
    }

    .ranking-card.bronze .rank-badge {
        background: #522546;
        border-color: #522546;
        color: #F9F8F6;
        box-shadow: none; /* Sin glow */
    }

    .rank-content {
        display: flex;
        flex-direction: column;
        gap: 0;
        flex: 1;
        min-width: 0;
    }

    .rank-name {
        font-size: 14px;
        color: #F9F8F6;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rank-count {
        font-size: 11px;
        color: rgba(249, 248, 246, 0.6);
        font-weight: 500;
    }

    .ranking-card.gold .rank-count,
    .ranking-card.silver .rank-count,
    .ranking-card.bronze .rank-count {
        color: #F7374F;
        font-weight: 700;
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