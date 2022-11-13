import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRaster from './slfgr/GeoRaster';


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
    .then(gtiff => map.addLayer(gtiff) );
