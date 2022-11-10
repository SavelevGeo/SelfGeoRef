import slfgrMap from './slfgr/Map';
import slgrfRaster from './slfgr/Raster';

import GeoTIFF from 'ol/source/GeoTIFF';
import TileLayer from 'ol/layer/WebGLTile';

const map = new slfgrMap();

fetch('./data/random.tif')
    .then((response) => response.blob())
    .then((blob) => {
        const source = new GeoTIFF({
            sources: [
                {
                    blob: blob,
                },
            ],
        });

        const gtiff = new TileLayer({
            title: 'random raster',
            source: source
        });

        map.addLayer(gtiff)
    })

const extentBtn = document.querySelector('.extent-btn');

slgrfRaster.HTMLImage('./data/Diamante_1_map_area.jpg')
    .then(img => {
        const raster = new slgrfRaster(img);
        let rasterLayer = raster.fitToExtent(map.getView().calculateExtent());
        map.addLayer(rasterLayer);
        
        extentBtn.addEventListener('click', () => {
            map.removeLayer(rasterLayer);

            rasterLayer = raster.fitToExtent(map.getView().calculateExtent());
            map.addLayer(rasterLayer);
        });
    }
);
