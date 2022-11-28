import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRef from './slfgr/GeoRef';
import addGcpActions from './slfgr/GCPActions';

import Control from 'ol/control/Control';

const map = new slfgrMap();

const extentBtn = document.querySelector('.extent-btn');
map.addControl(new Control({element: extentBtn}));

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
            let rasterLayer;
            extentBtn.disabled = false;

            extentBtn.addEventListener(
                'click',
                () => addGcpActions(map),
                {once: true}    
            );
            
            extentBtn.addEventListener('click', () => {
                map.removeLayer(rasterLayer);

                rasterLayer = raster.fitToExtent(
                    map.getView().calculateExtent()
                );
                const layers = map.getLayers();
                layers.insertAt(layers.getLength() - 1, rasterLayer);
            });

            console.log( Date.now() - startTime , 'georef started');
            const gcps = (await (await fetch('./data/gcps.txt'))
                .text()).split(' ');

            const geoRaster = await geoRef.byTable(raster, gcps);
            const layers = map.getLayers();
            layers.insertAt(layers.getLength() - 1, geoRaster.layer);
            map.addControl(new Control({element: geoRaster.link}));

            console.log( Date.now() - startTime , 'georef finshed');
        };
    };
});
