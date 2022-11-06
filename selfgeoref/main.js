import slfgrMap from './slfgr/Map';
import slgrfRaster from './slfgr/Raster';

const map = new slfgrMap(); 

const img = slgrfRaster.HTMLImage('./data/Diamante_1_map_area.jpg');
img.then(img => {
        const raster = new slgrfRaster(img);
        
        map.addLayer(raster.fitToExtent(
                map.getView().calculateExtent()
        ));
    }
);

// const extentBtn = document.querySelector('.extent-btn');
// extentBtn.addEventListener('click', () => {
//     const curExt = map.getView().calculateExtent();

//     map.removeLayer(rasterLayer);
//     rasterLayer = raster.fitToExtent(curExt);
//     map.addLayer(rasterLayer);

//     console.log(curExt);
// });
