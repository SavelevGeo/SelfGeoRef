import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRaster from './slfgr/GeoRaster';

import slfgrGeoRef from './slfgr/GeoRef';

const extentBtn = document.querySelector('.extent-btn');

const map = new slfgrMap();

const img = await slfgrRaster.fromPath('./data/Diamante_1_map_area.jpg');
let rasterLayer = img.fitToExtent(map.getView().calculateExtent());
map.addLayer(rasterLayer);

extentBtn.addEventListener('click', () => {
    map.removeLayer(rasterLayer);
    rasterLayer = img.fitToExtent(map.getView().calculateExtent());
    map.addLayer(rasterLayer);
})

const gtiff = await slfgrGeoRaster.fromPath('./data/Diamante_org_cog_tps.tif');
map.addLayer(gtiff);

const imgPath = './data/Diamante_1_map_area.jpg';
const fileData = await fetch(imgPath);
const file = new File([await fileData.blob()], imgPath.split('/').at(-1));

const geoRef = await slfgrGeoRef.init();
const result = await geoRef.Gdal.open(file);
console.log(result);
