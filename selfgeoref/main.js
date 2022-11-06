import slfgrMap from './slfgr/Map';
import slgrfRaster from './slfgr/Raster';

const map = new slfgrMap(); 
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
