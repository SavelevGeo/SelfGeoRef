import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRaster from './slfgr/GeoRaster';
import slfgrGeoRef from './slfgr/GeoRef';

import Control from 'ol/control/Control';

const map = new slfgrMap();

const uploadBtn = document.querySelector('.upload-btn > input');
uploadBtn.addEventListener('change', function() {
    const imgFile = this.files[0];
    const img = document.createElement("img");
    img.file = imgFile;

    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
            const raster = new slfgrRaster(img);
            let rasterLayer = raster.fitToExtent(map.getView().calculateExtent());
            map.addLayer(rasterLayer);

            extentBtn.addEventListener('click', () => {
                map.removeLayer(rasterLayer);
                rasterLayer = raster.fitToExtent(map.getView().calculateExtent());
                map.addLayer(rasterLayer);
            })
        };
    };
});

const extentBtn = document.querySelector('.extent-btn');
map.addControl(new Control({element: extentBtn}));

const imgPath = './data/Diamante_1_map_area.jpg';
const file = new File(
    [await (await fetch(imgPath)).blob()],
    imgPath.split('/').at(-1)
);

const geoRef = await slfgrGeoRef.init();
const img_gdal = await geoRef.byTable(file);

const gcps = (await (await fetch('./data/gcps.txt')).text()).split(' ');
const options = gcps.concat(['-of', 'GTiff', '-a_srs', 'EPSG:3857']);

const translated = (await geoRef.Gdal.gdal_translate(img_gdal, options))['local'];

const warped = (await geoRef.Gdal.gdalwarp(
    ((await geoRef.Gdal.open(translated)).datasets[0]),
    ['-tps', '-of', 'GTiff']
))['local'];
console.log(warped);

const fileBytes = await geoRef.Gdal.getFileBytes(warped);
const fileName = warped.split('/').pop();
saveAs(fileBytes, fileName);

function saveAs(fileBytes, fileName) {
    const blob = new Blob([fileBytes]);
    map.addLayer(slfgrGeoRaster.fromBlob(blob, fileName));

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.textContent = 'Download raster';
    link.style.position = 'absolute';
    link.style.right = '50px';
    
    map.addControl(new Control({element: link}));
}
