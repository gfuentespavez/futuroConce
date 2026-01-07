<script>
    import { onMount } from 'svelte';
    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
    import mapboxgl from 'mapbox-gl';
    import { annotations, showPostIt, selectedLocation } from '$lib/stores.js';
    import { supabase } from '$lib/supabaseClient.js';

    let mapContainer;
    let map;

    onMount(async () => {
        mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

        map = new mapboxgl.Map({
            container: mapContainer,
            //style: 'mapbox://styles/germanfuentes/cm5ntodss00fi01qp7gixa1ch', // <-- Aquí cambias el estilo
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-73.11064, -36.81024], // <-- Centro actualizado
            zoom: 9, // <-- Ajusté el zoom para que se vea bien la zona
            /*maxBounds: [ // <-- Límites del mapa
                [-73.2, -36.9], // Southwest coordinates (más al oeste y sur)
                [-73.0, -36.7]  // Northeast coordinates (más al este y norte)
            ]

             */
        });

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

        // Cambiar cursor cuando pasamos sobre un punto
        map.on('mouseenter', 'annotations-layer', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'annotations-layer', () => {
            map.getCanvas().style.cursor = '';
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

            // Agregar capa de círculos
            map.addLayer({
                id: 'annotations-layer',
                type: 'circle',
                source: 'annotations',
                paint: {
                    'circle-radius': 12,
                    'circle-color': ['get', 'color'],
                    'circle-stroke-width': 3,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 0.9
                }
            });

            loadAnnotations();
        });

        // Suscribirse a cambios en tiempo real
        supabase
            .channel('annotations')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'annotations' }, () => {
                loadAnnotations();
            })
            .subscribe();
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
</style>