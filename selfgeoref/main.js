import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRaster from './slfgr/GeoRaster';

import slfgrGeoRef from './slfgr/GeoRef';

const extentBtn = document.querySelector('.extent-btn');

const map = new slfgrMap();

slfgrRaster.fromPath('./data/Diamante_1_map_area.jpg')
    .then(img => {
        let rasterLayer = img.fitToExtent(map.getView().calculateExtent());
        map.addLayer(rasterLayer);
        
        extentBtn.addEventListener('click', () => {
            map.removeLayer(rasterLayer);

            rasterLayer = img.fitToExtent(map.getView().calculateExtent());
            map.addLayer(rasterLayer);
        });
    }
);

slfgrGeoRaster.fromPath('./data/random.tif')
    .then(gtiff => map.addLayer(gtiff));

slfgrGeoRaster.fromPath('./data/Diamante_1_3857.tif')
    .then(gtiff => map.addLayer(gtiff));

slfgrGeoRef.init()
    .then(geoRef => console.log(geoRef));

const gref = new slfgrGeoRef();
console.log(gref.byTable('./data/Diamante_1_map_area.jpg'))
