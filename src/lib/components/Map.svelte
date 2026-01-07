<script>
    import { onMount } from 'svelte';
    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
    import mapboxgl from 'mapbox-gl';
    import { annotations, showPostIt, selectedLocation } from '$lib/stores.js';
    import { supabase } from '$lib/supabaseClient.js';

    let mapContainer;
    let map;
    let supabaseChannel;

    onMount(async () => {
        mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

        map = new mapboxgl.Map({
            container: mapContainer,
            //style: 'mapbox://styles/germanfuentes/cm5ntodss00fi01qp7gixa1ch', // <-- Aquí cambias el estilo
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-73.11064, -36.81024], // <-- Centro actualizado
            zoom: 12,
            /*maxBounds: [ // <-- Límites del mapa
                [-73.2, -36.9], // Southwest coordinates (más al oeste y sur)
                [-73.0, -36.7]  // Northeast coordinates (más al este y norte)
            ]
             */

        });

        const handleRefreshMap = () => {
            refreshMap();
        };

        window.addEventListener('refresh-map', handleRefreshMap);

        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true
            })
        );

        map.on('click', (e) => {
            // Verificar si clickeamos en un punto existente
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['annotations-layer']
            });

            if (features.length > 0) {
                // Mostrar popup del punto existente
                const feature = features[0];
                const coords = feature.geometry.coordinates.slice();
                const props = feature.properties;

                new mapboxgl.Popup()
                    .setLngLat(coords)
                    .setHTML(`
            <div style="padding: 12px; max-width: 200px;">
              <div style="
                background-color: ${props.color};
                color: rgba(0,0,0,0.8);
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 12px;
                margin-bottom: 8px;
                display: inline-block;
              ">
                ${props.category.toUpperCase()}
              </div>
              <p style="margin: 0; font-size: 14px; line-height: 1.4;">${props.text}</p>
              <div style="
                margin-top: 8px;
                font-size: 11px;
                color: #888;
              ">
                ${new Date(props.created_at).toLocaleDateString('es-ES')}
              </div>
            </div>
          `)
                    .addTo(map);
            } else {
                // Click en área vacía - agregar nueva anotación
                selectedLocation.set({
                    lat: e.lngLat.lat,
                    lng: e.lngLat.lng
                });
                showPostIt.set(true);
            }
        });

        map.on('load', () => {
            // Agregar source para las anotaciones
            map.addSource('annotations', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            // Cargar el SVG del pin como imagen en el mapa
            const pinSVG = (color) => `
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C11.0294 2 7 6.02944 7 11C7 17.5 16 30 16 30C16 30 25 17.5 25 11C25 6.02944 20.9706 2 16 2ZM16 14.5C14.067 14.5 12.5 12.933 12.5 11C12.5 9.067 14.067 7.5 16 7.5C17.933 7.5 19.5 9.067 19.5 11C19.5 12.933 17.933 14.5 16 14.5Z"
            fill="${color}"/>
    </svg>
  `;

            // Crear imágenes para cada categoría
            const categories = [
                { name: 'problema', color: '#ff6b6b' },
                { name: 'propuesta', color: '#4ecdc4' },
                { name: 'observacion', color: '#ffeb3b' },
                { name: 'pregunta', color: '#95a5f5' }
            ];

            categories.forEach(cat => {
                const img = new Image(32, 32);
                img.onload = () => {
                    if (!map.hasImage(`pin-${cat.name}`)) {
                        map.addImage(`pin-${cat.name}`, img);
                    }
                };
                img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(pinSVG(cat.color));
            });

            // Agregar capa de símbolos con los pins
            map.addLayer({
                id: 'annotations-layer',
                type: 'symbol',
                source: 'annotations',
                layout: {
                    'icon-image': ['concat', 'pin-', ['get', 'category']],
                    'icon-size': 1,
                    'icon-anchor': 'bottom',
                    'icon-allow-overlap': true
                }
            });

            // Cambiar cursor cuando pasamos sobre un punto
            map.on('mouseenter', 'annotations-layer', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'annotations-layer', () => {
                map.getCanvas().style.cursor = '';
            });

            loadAnnotations();
        });

        // Suscribirse a cambios en tiempo real
        supabaseChannel = supabase
            .channel('annotations')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'annotations' }, () => {
                refreshMap();
            })
            .subscribe();

        // Cleanup function
        return () => {
            window.removeEventListener('refresh-map', handleRefreshMap);
            if (supabaseChannel) {
                supabase.removeChannel(supabaseChannel);
            }
            if (map) {
                map.remove();
            }
        };
    });

    async function loadAnnotations() {
        const { data, error } = await supabase
            .from('annotations')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            annotations.set(data);

            // Convertir a GeoJSON
            const geojson = {
                type: 'FeatureCollection',
                features: data.map(annotation => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [annotation.longitude, annotation.latitude]
                    },
                    properties: {
                        id: annotation.id,
                        text: annotation.text,
                        category: annotation.category,
                        color: annotation.color,
                        created_at: annotation.created_at
                    }
                }))
            };

            // Actualizar el source del mapa
            if (map.getSource('annotations')) {
                map.getSource('annotations').setData(geojson);
            }

            console.log(`Cargadas ${data.length} anotaciones`);
        }

        if (error) {
            console.error('Error cargando anotaciones:', error);
        }
    }

    function refreshMap() {
        if (map && map.getSource('annotations')) {
            // Forzar actualización del source
            const source = map.getSource('annotations');
            source.setData({ type: 'FeatureCollection', features: [] });

            // Pequeño delay para forzar el repaint
            setTimeout(() => {
                loadAnnotations();
            }, 100);
        }
    }
</script>

<div bind:this={mapContainer} class="map-container"></div>

<style>
    .map-container {
        width: 100%;
        height: 100%;
    }

    :global(.mapboxgl-popup-content) {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 0;
    }

    :global(.mapboxgl-marker) {
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    :global(.mapboxgl-marker:hover) {
        transform: scale(1.15);
    }
</style>