<script>
    import { showPostIt, selectedLocation, categories } from '$lib/stores.js';
    import { supabase } from '$lib/supabaseClient.js';

    let text = '';
    let selectedCategory = categories[0];
    let saving = false;

    function close() {
        showPostIt.set(false);
        text = '';
        selectedCategory = categories[0];
    }

    async function save() {
        if (!text.trim() || !$selectedLocation) return;

        saving = true;

        const { error } = await supabase
            .from('annotations')
            .insert([
                {
                    latitude: $selectedLocation.lat,
                    longitude: $selectedLocation.lng,
                    text: text.trim(),
                    category: selectedCategory.name,
                    color: selectedCategory.color
                }
            ]);

        if (!error) {
            close();
        }

        saving = false;
    }
</script>

{#if $showPostIt}
    <div class="overlay" on:click={close}></div>
    <div class="postit" style="background-color: {selectedCategory.color};">
        <button class="close-btn" on:click={close}>✕</button>

        <div class="categories">
            {#each categories as cat}
                <button
                        class="category-btn"
                        class:active={selectedCategory.name === cat.name}
                        style="background-color: {cat.color};"
                        on:click={() => selectedCategory = cat}
                >
                    {cat.label}
                </button>
            {/each}
        </div>

        <textarea
                bind:value={text}
                placeholder="Escribe tu anotación..."
                rows="6"
                maxlength="500"
        ></textarea>

        <div class="footer">
            <span class="char-count">{text.length}/500</span>
            <button class="save-btn" on:click={save} disabled={!text.trim() || saving}>
                {saving ? 'Guardando...' : 'Guardar'}
            </button>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .postit {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 400px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 1000;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .categories {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
    }

    .category-btn {
        flex: 1;
        min-width: 80px;
        padding: 10px;
        border: 2px solid transparent;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.8);
        transition: all 0.2s;
    }

    .category-btn.active {
        border-color: rgba(0, 0, 0, 0.5);
        transform: scale(1.05);
    }

    textarea {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 6px;
        resize: none;
        font-size: 16px;
        background: rgba(255, 255, 255, 0.9);
        margin-bottom: 12px;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .char-count {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
    }

    .save-btn {
        padding: 12px 24px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 16px;
    }

    .save-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Touch optimizations */
    @media (hover: none) {
        .category-btn,
        .save-btn,
        .close-btn {
            min-height: 44px;
        }
    }
</style>