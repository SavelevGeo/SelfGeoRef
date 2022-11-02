import slfgrMap from './slfgr/Map';
import slgrfRaster from './slfgr/ProjectRasterLayer';

const map = new slfgrMap(); 

const raster = new slgrfRaster('./data/Diamante_1_map_area.jpg');
let rasterLayer = raster.fitToExtent(
    [-3913009.9765944895, 771787.351525859,
     -3000376.813142625, 1442540.1658467501]
);

map.addLayer(rasterLayer);

const extentBtn = document.querySelector('.extent-btn');
extentBtn.addEventListener('click', async () => {
    const curExt = map.getView().calculateExtent();

    map.removeLayer(rasterLayer);
    rasterLayer = raster.fitToExtent(curExt);
    map.addLayer(rasterLayer);

    console.log(await raster.size);
});
