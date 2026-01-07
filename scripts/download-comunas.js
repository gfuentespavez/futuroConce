// scripts/download-biobio.js
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mapeo de códigos de comuna a nombres
const codigosComunas = {
    '08101': 'Concepción',
    '08102': 'Coronel',
    '08103': 'Chiguayante',
    '08104': 'Florida',
    '08105': 'Hualqui',
    '08106': 'Lota',
    '08107': 'Penco',
    '08108': 'San Pedro de la Paz',
    '08109': 'Santa Juana',
    '08110': 'Talcahuano',
    '08111': 'Tomé',
    '08112': 'Hualpén'
};

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

async function downloadBiobio() {
    console.log('Descargando GeoJSON de la Región del Biobío desde chilemapas...');

    const url = 'https://raw.githubusercontent.com/pachadotdev/chilemapas/master/data_geojson/comunas/r08.geojson';

    try {
        const data = await downloadFile(url);

        console.log(`\nTotal features descargadas: ${data.features.length}`);
        console.log('\nFiltrando comunas del Gran Concepción...');

        const filteredFeatures = data.features
            .filter(f => {
                const codigo = f.properties.codigo_comuna;
                return codigosComunas[codigo] !== undefined;
            })
            .map(f => {
                const codigo = f.properties.codigo_comuna;
                const nombre = codigosComunas[codigo];

                console.log(`✓ ${nombre} (código: ${codigo})`);

                return {
                    ...f,
                    properties: {
                        codigo: codigo,
                        nombre: nombre,
                        count: 0
                    }
                };
            });

        const geojson = {
            type: 'FeatureCollection',
            features: filteredFeatures
        };

        const outputPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'comunas.json');
        fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));

        console.log(`\n✓ Guardado en: ${outputPath}`);
        console.log(`✓ Total comunas guardadas: ${filteredFeatures.length}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

downloadBiobio();