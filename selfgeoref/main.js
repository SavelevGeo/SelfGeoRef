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

slfgrGeoRaster.fromPath('./data/Diamante_org_cog_tps.tif')
    .then(gtiff => {
        console.log(gtiff);
        map.addLayer(gtiff);
        }
    );


slfgrGeoRaster.fromPath('./data/Diamante_3857_qgis.tif')
    .then(gtiff => console.log(gtiff));

slfgrGeoRef.init()
    .then(geoRef => console.log(geoRef));

const gref = new slfgrGeoRef();
console.log(gref.byTable('./data/Diamante_1_map_area.jpg'))
