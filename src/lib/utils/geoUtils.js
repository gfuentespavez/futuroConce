import comunasData from '$lib/data/comunas.json';

/**
 * Verifica si un punto está dentro de un polígono usando ray-casting
 */
function pointInPolygon(point, polygon) {
    const [lng, lat] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect = ((yi > lat) !== (yj > lat))
            && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}

/**
 * Verifica si un punto está dentro de un MultiPolygon
 */
function pointInMultiPolygon(point, multiPolygon) {
    for (const polygon of multiPolygon) {
        if (pointInPolygon(point, polygon[0])) {
            return true;
        }
    }
    return false;
}

/**
 * Encuentra la comuna que contiene un punto dado
 */
export function findComunaForPoint(lng, lat) {
    for (const feature of comunasData.features) {
        const geometry = feature.geometry;
        const point = [lng, lat];

        if (geometry.type === 'Polygon') {
            if (pointInPolygon(point, geometry.coordinates[0])) {
                return feature.properties.nombre;
            }
        } else if (geometry.type === 'MultiPolygon') {
            if (pointInMultiPolygon(point, geometry.coordinates)) {
                return feature.properties.nombre;
            }
        }
    }

    return null;
}

/**
 * Cuenta las anotaciones por comuna
 */
export function countAnnotationsByComuna(annotations) {
    const counts = {};

    // Inicializar contadores
    comunasData.features.forEach(feature => {
        counts[feature.properties.nombre] = 0;
    });

    // Contar anotaciones
    annotations.forEach(annotation => {
        const comuna = findComunaForPoint(annotation.longitude, annotation.latitude);
        if (comuna) {
            counts[comuna]++;
        }
    });

    // Convertir a array y ordenar
    return Object.entries(counts)
        .map(([nombre, count]) => ({ nombre, count }))
        .sort((a, b) => b.count - a.count);
}