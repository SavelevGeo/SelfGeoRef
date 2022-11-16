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
const file = new File(
    [await (await fetch(imgPath)).blob()],
    imgPath.split('/').at(-1)
);

const geoRef = await slfgrGeoRef.init();
const img_gdal = await geoRef.byTable(file);
console.log(img_gdal);

const gcps = (await (await fetch('./data/gcps.txt')).text()).split(' ');
const options = gcps.concat(['-of', 'GTiff', '-a_srs', 'EPSG:3857']);

const translateResult = await geoRef.Gdal.gdal_translate(img_gdal, options);
console.log(translateResult);
