import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRef from './slfgr/GeoRef';
import addGcpActions from './slfgr/GCPActions';

import Control from 'ol/control/Control';

const map = new slfgrMap();

//georef raster from upload
const uploadBtn = document.querySelector('.upload-btn > input');
const geoRef = await slfgrGeoRef.init();
uploadBtn.addEventListener('change', function() {
    const startTime = Date.now();
    console.log('image loading...');

    const img = new Image();
    img.file = this.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(img.file);
    reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = async () => {
            console.log( Date.now() - startTime , 'image loaded');

            const raster = new slfgrRaster(img);

            addGcpActions(map);
            map.addLayer(raster.fitToExtent(map.getView().calculateExtent()));

            console.log( Date.now() - startTime , 'georef started');
            const gcps = (await (await fetch('./data/gcps.txt'))
                .text()).split(' ');

            const geoRaster = await geoRef.byTable(raster, gcps);
            map.addLayer(geoRaster.layer);
            map.addControl(new Control({element: geoRaster.link}));

            console.log( Date.now() - startTime , 'georef finshed');
        };
    };
});
