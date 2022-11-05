import slfgrMap from './slfgr/Map';
import slgrfRaster from './slfgr/Raster';

const map = new slfgrMap(); 

const raster = new slgrfRaster('./data/Diamante_1_map_area.jpg');
let rasterLayer;

const size = slgrfRaster.fromImage('./data/Diamante_1_map_area.jpg');
console.log(size);

const extentBtn = document.querySelector('.extent-btn');
extentBtn.addEventListener('click', () => {
    const curExt = map.getView().calculateExtent();

    map.removeLayer(rasterLayer);
    rasterLayer = raster.fitToExtent(curExt);
    map.addLayer(rasterLayer);

    console.log(curExt);
});
