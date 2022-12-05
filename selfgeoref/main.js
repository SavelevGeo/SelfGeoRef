import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';

import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRef from './slfgr/GeoRef';
import addGcpActions from './slfgr/GCPActions';
import toggleSwitch from './slfgr/ToggleSwitch';

import Control from 'ol/control/Control';

const gcpMap = new slfgrMap('gcp-map');
const worldMap = new slfgrMap('world-map');
worldMap.addLayer(new TileLayer({ title: 'OSM', source: new OSM(), visible: true }));

//georef raster from upload
const uploadBtn = document.querySelector('.upload-btn > input');
const georefBtn = document.querySelector('.georef-btn');
gcpMap.addControl(new Control({element: georefBtn}));

const switchCbx = document.querySelector('.switch__checkbox');
const switchSld = document.querySelector('.switch__slider');
const mapSwitch = new toggleSwitch(switchCbx, gcpMap, worldMap);

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

            addGcpActions(gcpMap);
            gcpMap.addLayer(raster.fitToExtent(gcpMap.getView().calculateExtent()));

            georefBtn.disabled = false;
            georefBtn.addEventListener('click', async () => {
                console.time('georef')
                console.timeLog('georef', 'georef started');
                const gcps = (await (await fetch('./data/gcps.txt'))
                    .text()).split(' ');
            
                const geoRaster = await geoRef.byTable(raster, gcps);
                worldMap.addLayer(geoRaster.layer);
                document.body.appendChild(geoRaster.link);
                
                switchCbx.disabled = false;
                switchCbx.click();
                switchSld.classList.remove('switch__slider_disabled');

                console.timeEnd('georef', 'georef finished');
            });
        };
    };
});

