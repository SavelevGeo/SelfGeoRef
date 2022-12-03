import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRef from './slfgr/GeoRef';
import addGcpActions from './slfgr/GCPActions';

import Control from 'ol/control/Control';

const map = new slfgrMap();

//georef raster from upload
const uploadBtn = document.querySelector('.upload-btn > input');
const georefBtn = document.querySelector('.georef-btn');
const switchCbx = document.querySelector('.switch__checkbox');
const switchSld = document.querySelector('.switch__slider');

const geoRef = await slfgrGeoRef.init();

uploadBtn.addEventListener('change', function() {
    console.time('image')
    console.timeLog('image loading...');

    const img = new Image();
    img.file = this.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(img.file);
    reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = async () => {
            console.timeEnd('image', 'image loaded');

            const raster = new slfgrRaster(img);

            addGcpActions(map);
            map.addLayer(raster.fitToExtent(map.getView().calculateExtent()));

            georefBtn.disabled = false;
            georefBtn.addEventListener('click', async () => {
                console.time('georef')
                console.timeLog('georef', 'georef started');
                const gcps = (await (await fetch('./data/gcps.txt'))
                    .text()).split(' ');
            
                const geoRaster = await geoRef.byTable(raster, gcps);
                map.addLayer(geoRaster.layer);
                map.addControl(new Control({element: geoRaster.link}));
                
                switchCbx.disabled = false;
                switchCbx.checked = true;
                switchSld.classList.remove('switch__slider_disabled');

                console.timeEnd('georef', 'georef finished');
            });
        };
    };
});

