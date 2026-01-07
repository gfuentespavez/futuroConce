<script>
    import Map from '$lib/components/Map.svelte';
    import PostIt from '$lib/components/PostIt.svelte';
    import BottomBar from '$lib/components/BottomBar.svelte';
    import 'mapbox-gl/dist/mapbox-gl.css';
</script>

<svelte:head>
    <title>Anotaciones Urbanas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="container">
    <Map />
    <PostIt />
    <BottomBar />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .container {
        width: 100vw;
        height: 100vh;
        position: relative;
    }
</style>